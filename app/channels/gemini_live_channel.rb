# frozen_string_literal: true

require "websocket/driver"
require "net/http"

class GeminiLiveChannel < ApplicationCable::Channel
  GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"

  def subscribed
    stream_for current_user
    @gemini_ws = nil
  end

  def unsubscribed
    close_gemini_connection
  end

  def start_session(data)
    api_key = Rails.application.credentials.dig(:gemini, :api_key) || ENV["GEMINI_API_KEY"]
    return broadcast_error("Gemini API key not configured") if api_key.blank?

    close_gemini_connection

    model = data["model"] || "gemini-2.0-flash-live-001"
    ws_url = "#{GEMINI_WS_URL}?key=#{api_key}"

    Thread.new do
      connect_to_gemini(ws_url, model)
    end
  end

  def send_audio(data)
    return broadcast_error("No active Gemini session") unless @gemini_ws

    audio_data = data["audio"]
    return if audio_data.blank?

    message = {
      realtimeInput: {
        mediaChunks: [{
          mimeType: "audio/pcm;rate=16000",
          data: audio_data
        }]
      }
    }

    @gemini_ws.send(message.to_json)
  rescue => e
    Rails.logger.error("GeminiLive send_audio error: #{e.message}")
    broadcast_error(e.message)
  end

  def send_text(data)
    return broadcast_error("No active Gemini session") unless @gemini_ws

    text = data["text"]
    return if text.blank?

    message = {
      clientContent: {
        turns: [{
          role: "user",
          parts: [{ text: text }]
        }],
        turnComplete: true
      }
    }

    @gemini_ws.send(message.to_json)
  rescue => e
    Rails.logger.error("GeminiLive send_text error: #{e.message}")
    broadcast_error(e.message)
  end

  def end_session(_data = nil)
    close_gemini_connection
    GeminiLiveChannel.broadcast_to(current_user, { type: "session_ended" })
  end

  private

  def connect_to_gemini(ws_url, model)
    require "faye/websocket"

    uri = URI.parse(ws_url)

    EM.run do
      ws = Faye::WebSocket::Client.new(ws_url)
      @gemini_ws = ws

      ws.on :open do
        setup_message = {
          setup: {
            model: "models/#{model}",
            generationConfig: {
              responseModalities: ["TEXT"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" }
                }
              }
            },
            systemInstruction: {
              parts: [{
                text: "You are a helpful AI assistant for Petals for Her, a luxury flower arrangement brand. " \
                      "Help with content creation, design decisions, and editorial guidance for their journal/blog. " \
                      "Be concise, creative, and knowledgeable about flowers, fragrances, and luxury branding."
              }]
            }
          }
        }
        ws.send(setup_message.to_json)
        GeminiLiveChannel.broadcast_to(current_user, { type: "session_started" })
      end

      ws.on :message do |event|
        begin
          data = JSON.parse(event.data)

          if data.dig("serverContent", "modelTurn", "parts")
            parts = data["serverContent"]["modelTurn"]["parts"]
            parts.each do |part|
              if part["text"]
                GeminiLiveChannel.broadcast_to(current_user, {
                  type: "live_text",
                  content: part["text"]
                })
              end
            end
          end

          if data.dig("serverContent", "turnComplete")
            GeminiLiveChannel.broadcast_to(current_user, { type: "turn_complete" })
          end
        rescue JSON::ParserError => e
          Rails.logger.warn("GeminiLive parse error: #{e.message}")
        end
      end

      ws.on :close do |event|
        @gemini_ws = nil
        GeminiLiveChannel.broadcast_to(current_user, {
          type: "session_ended",
          reason: event.reason
        })
        EM.stop
      end

      ws.on :error do |event|
        Rails.logger.error("GeminiLive WS error: #{event.message}")
        broadcast_error(event.message)
      end
    end
  rescue => e
    Rails.logger.error("GeminiLive connection error: #{e.message}")
    broadcast_error("Failed to connect to Gemini Live API: #{e.message}")
  end

  def close_gemini_connection
    if @gemini_ws
      @gemini_ws.close rescue nil
      @gemini_ws = nil
    end
  end

  def broadcast_error(message)
    GeminiLiveChannel.broadcast_to(current_user, { type: "error", content: message })
  end
end
