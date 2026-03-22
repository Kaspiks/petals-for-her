import { useState, useEffect, useRef, useCallback } from "react";
import { createConsumer } from "@rails/actioncable";

const TOKEN_KEY = "petals_jwt";

function getCableUrl() {
  const token = localStorage.getItem(TOKEN_KEY);
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/cable?token=${encodeURIComponent(token || "")}`;
}

interface UseGeminiLiveReturn {
  isSessionActive: boolean;
  isRecording: boolean;
  response: string;
  error: string | null;
  startSession: () => void;
  endSession: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  sendText: (text: string) => void;
  reset: () => void;
}

export function useGeminiLive(): UseGeminiLiveReturn {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const subscriptionRef = useRef<any>(null);
  const consumerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const ensureConnection = useCallback(() => {
    if (!consumerRef.current) {
      consumerRef.current = createConsumer(getCableUrl());
    }
    return consumerRef.current;
  }, []);

  useEffect(() => {
    const consumer = ensureConnection();
    subscriptionRef.current = consumer.subscriptions.create("GeminiLiveChannel", {
      received(data: any) {
        switch (data.type) {
          case "session_started":
            setIsSessionActive(true);
            setError(null);
            break;
          case "session_ended":
            setIsSessionActive(false);
            setIsRecording(false);
            break;
          case "live_text":
            setResponse((prev) => prev + (data.content || ""));
            break;
          case "turn_complete":
            // Turn is complete, user can apply or continue
            break;
          case "error":
            setError(data.content || "An error occurred");
            break;
        }
      },
      connected() {
        console.log("[GeminiLiveChannel] Connected");
      },
      disconnected() {
        console.log("[GeminiLiveChannel] Disconnected");
        setIsSessionActive(false);
      },
      rejected() {
        setError("Live channel connection rejected");
      },
    });

    return () => {
      stopRecordingInternal();
      subscriptionRef.current?.unsubscribe();
      consumerRef.current?.disconnect();
      subscriptionRef.current = null;
      consumerRef.current = null;
    };
  }, [ensureConnection]);

  const startSession = useCallback(() => {
    subscriptionRef.current?.perform("start_session", {});
    setResponse("");
    setError(null);
  }, []);

  const endSession = useCallback(() => {
    stopRecordingInternal();
    subscriptionRef.current?.perform("end_session", {});
  }, []);

  const stopRecordingInternal = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const startRecording = useCallback(async () => {
    if (!isSessionActive) {
      setError("Start a session first");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const pcmData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, Math.round(pcmData[i] * 32767)));
        }
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(int16.buffer))
        );
        subscriptionRef.current?.perform("send_audio", { audio: base64 });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
    } catch (err: any) {
      setError("Microphone access denied: " + err.message);
    }
  }, [isSessionActive]);

  const stopRecording = useCallback(() => {
    stopRecordingInternal();
  }, []);

  const sendText = useCallback((text: string) => {
    if (!isSessionActive) return;
    subscriptionRef.current?.perform("send_text", { text });
  }, [isSessionActive]);

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
  }, []);

  return {
    isSessionActive,
    isRecording,
    response,
    error,
    startSession,
    endSession,
    startRecording,
    stopRecording,
    sendText,
    reset,
  };
}

export default useGeminiLive;
