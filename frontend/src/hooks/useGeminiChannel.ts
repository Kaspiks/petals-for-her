import { useState, useEffect, useRef, useCallback } from "react";
import { createConsumer } from "@rails/actioncable";

const TOKEN_KEY = "petals_jwt";

function getCableUrl() {
  const token = localStorage.getItem(TOKEN_KEY);
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/cable?token=${encodeURIComponent(token || "")}`;
}

interface UseGeminiChannelReturn {
  sendPrompt: (promptType: string, customPrompt?: string, context?: string) => void;
  response: string;
  isStreaming: boolean;
  error: string | null;
  cancel: () => void;
  reset: () => void;
}

export function useGeminiChannel(): UseGeminiChannelReturn {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);
  const consumerRef = useRef<any>(null);

  const ensureConnection = useCallback(() => {
    if (!consumerRef.current) {
      consumerRef.current = createConsumer(getCableUrl());
    }
    return consumerRef.current;
  }, []);

  const subscribe = useCallback(() => {
    if (subscriptionRef.current) return;

    const consumer = ensureConnection();
    subscriptionRef.current = consumer.subscriptions.create("GeminiChannel", {
      received(data: any) {
        switch (data.type) {
          case "start":
            setResponse("");
            setIsStreaming(true);
            setError(null);
            break;
          case "chunk":
            setResponse((prev) => prev + (data.content || ""));
            break;
          case "complete":
            setIsStreaming(false);
            break;
          case "error":
            setError(data.content || "An error occurred");
            setIsStreaming(false);
            break;
        }
      },
      connected() {
        console.log("[GeminiChannel] Connected");
      },
      disconnected() {
        console.log("[GeminiChannel] Disconnected");
      },
      rejected() {
        console.error("[GeminiChannel] Subscription rejected");
        setError("WebSocket connection rejected. Please re-login.");
      },
    });
  }, [ensureConnection]);

  useEffect(() => {
    subscribe();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (consumerRef.current) {
        consumerRef.current.disconnect();
        consumerRef.current = null;
      }
    };
  }, [subscribe]);

  const sendPrompt = useCallback(
    (promptType: string, customPrompt?: string, context?: string) => {
      if (!subscriptionRef.current) {
        setError("Not connected to Gemini channel");
        return;
      }
      setResponse("");
      setIsStreaming(true);
      setError(null);
      subscriptionRef.current.perform("generate", {
        prompt_type: promptType,
        custom_prompt: customPrompt || "",
        context: context || "",
      });
    },
    []
  );

  const cancel = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setResponse("");
    setIsStreaming(false);
    setError(null);
  }, []);

  return { sendPrompt, response, isStreaming, error, cancel, reset };
}

export default useGeminiChannel;
