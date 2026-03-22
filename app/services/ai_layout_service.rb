# frozen_string_literal: true

require "net/http"

# AI Layout Engine - Non-streaming Anthropic Claude calls
# Used for layout planning, palette, etc. - returns full JSON response
class AiLayoutService
  API_BASE = "https://api.anthropic.com/v1"
  MODEL = "claude-haiku-4-5"

  def initialize
    @api_key = Rails.application.credentials.dig(:anthropic, :api_key) || ENV["ANTHROPIC_API_KEY"]
    raise "Anthropic API key not configured" if @api_key.blank?
  end

  # @param system_prompt [String]
  # @param user_message [String]
  # @param image_base64 [String, nil] optional base64 image (e.g. from screenshot upload)
  # @param temperature [Float, nil] 0.0-1.0, higher = more creative/varied (default: 0.8 for layout gen)
  # @return [String] raw text content from Claude
  def complete(system_prompt:, user_message:, image_base64: nil, temperature: nil)
    url = URI("#{API_BASE}/messages")

    user_content = build_user_content(user_message, image_base64)

    body = {
      model: MODEL,
      max_tokens: 4096,
      system: system_prompt,
      messages: [{ role: "user", content: user_content }]
    }
    body[:temperature] = temperature if temperature.present?

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.read_timeout = 60

    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = "application/json"
    request["x-api-key"] = @api_key
    request["anthropic-version"] = "2023-06-01"
    request.body = body.to_json

    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error("AI Layout API error: #{response.code} - #{response.body}")
      raise "AI request failed: #{response.code}"
    end

    parsed = JSON.parse(response.body)
    text = parsed.dig("content", 0, "text")
    text.to_s
  end

  private

  def build_user_content(message, image_base64)
    if image_base64.present?
      # Strip data URL prefix if present (e.g. data:image/png;base64,)
      data = image_base64.sub(/\Adata:image\/\w+;base64,/, "")
      media_type = image_base64.match(/data:image\/(\w+);/) ? "image/#{$1}" : "image/jpeg"
      [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: media_type,
            data: data
          }
        },
        { type: "text", text: message }
      ]
    else
      [{ type: "text", text: message }]
    end
  end
end
