# frozen_string_literal: true

require "net/http"

class ClaudeService
  API_BASE = "https://api.anthropic.com/v1"
  MODEL = "claude-3-5-haiku-20241022"

  PROMPT_TEMPLATES = {
    "generate_headline" => {
      system: "You are a creative copywriter for Petals for Her, a luxury flower arrangement brand. Generate 3-5 SEO-friendly headline options. Return only the headlines, numbered.",
      user_prefix: "Generate headline options for a journal post about:"
    },
    "draft_paragraph" => {
      system: "You are a content writer for Petals for Her, a luxury flower arrangement brand. Write in an elegant, warm tone. Use sensory language about flowers, fragrances, and beauty. Write one polished paragraph.",
      user_prefix: "Draft a paragraph about:"
    },
    "optimize_seo" => {
      system: "You are an SEO specialist for a luxury flower brand called Petals for Her. Analyze the content and provide specific, actionable SEO improvement suggestions. Format as a numbered list.",
      user_prefix: "Analyze this content for SEO improvements:"
    },
    "suggest_palette" => {
      system: "You are a design consultant for Petals for Her, a luxury flower brand with blush pink (#D4A5A5) as the primary color. Suggest complementary color palettes with hex codes and usage recommendations.",
      user_prefix: "Suggest a color palette for content themed around:"
    },
    "optimize_layout" => {
      system: "You are a UX designer for a luxury flower brand's journal. Suggest layout improvements for the current page blocks. Be specific about block ordering, spacing, and visual hierarchy.",
      user_prefix: "Suggest layout improvements for these page blocks:"
    },
    "typography_pairings" => {
      system: "You are a typography expert. The brand uses Cormorant Garamond for headings and DM Sans for body text. Suggest complementary typography pairings and sizing recommendations.",
      user_prefix: "Suggest typography pairings for:"
    },
    "accessibility_audit" => {
      system: "You are a web accessibility expert. Audit the following content for WCAG 2.1 AA compliance issues. Provide specific, actionable recommendations.",
      user_prefix: "Audit this content for accessibility:"
    },
    "custom" => {
      system: "You are a helpful AI assistant for Petals for Her, a luxury flower arrangement brand. Help with content creation, design decisions, and editorial guidance. Be concise and actionable.",
      user_prefix: ""
    }
  }.freeze

  def initialize
    @api_key = Rails.application.credentials.dig(:anthropic, :api_key) || ENV["ANTHROPIC_API_KEY"]
    raise "Anthropic API key not configured" if @api_key.blank?
  end

  def stream_generate(prompt_type:, custom_prompt: nil, context: nil, &block)
    template = PROMPT_TEMPLATES[prompt_type] || PROMPT_TEMPLATES["custom"]
    system_instruction = template[:system]

    user_message = if prompt_type == "custom" && custom_prompt.present?
      custom_prompt
    else
      parts = [template[:user_prefix]]
      parts << context if context.present?
      parts << custom_prompt if custom_prompt.present?
      parts.join("\n\n")
    end

    url = URI("#{API_BASE}/messages")

    body = {
      model: MODEL,
      max_tokens: 1024,
      system: system_instruction,
      messages: [{ role: "user", content: user_message }],
      stream: true
    }

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.read_timeout = 60

    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = "application/json"
    request["x-api-key"] = @api_key
    request["anthropic-version"] = "2023-06-01"
    request.body = body.to_json

    retries = 0
    max_retries = 3

    begin
      http.request(request) do |response|
        if response.code == "429"
          error_body = begin; response.body; rescue; ""; end
          Rails.logger.error("Claude 429 response: #{error_body}")
          raise RateLimitError, error_body
        end

        unless response.is_a?(Net::HTTPSuccess)
          error_body = response.body
          Rails.logger.error("Claude API error: #{response.code} - #{error_body}")
          block.call("[Error: Claude API returned #{response.code}]")
          return
        end

        buffer = ""
        response.read_body do |chunk|
          buffer += chunk
          while (line_end = buffer.index("\n"))
            line = buffer.slice!(0, line_end + 1).strip
            next if line.empty?
            next unless line.start_with?("data: ")

            json_str = line.sub("data: ", "")
            next if json_str == "[DONE]"

            begin
              parsed = JSON.parse(json_str)
              next if parsed["type"] != "content_block_delta"

              delta = parsed["delta"]
              next unless delta && delta["type"] == "text_delta"

              text = delta["text"]
              block.call(text) if text.present?
            rescue JSON::ParserError => e
              Rails.logger.warn("Claude SSE parse error: #{e.message}")
            end
          end
        end
      end
    rescue RateLimitError => e
      retries += 1
      if retries <= max_retries
        wait_time = 2**retries
        Rails.logger.warn("Claude rate limited, retrying in #{wait_time}s (attempt #{retries}/#{max_retries})")
        block.call("[Rate limited — retrying in #{wait_time}s...]\n")
        sleep(wait_time)
        retry
      else
        detail = begin
          parsed = JSON.parse(e.message) rescue nil
          parsed&.dig("error", "message") || e.message
        end
        block.call("[Rate limited by Claude API: #{detail}]")
      end
    end
  end

  class RateLimitError < StandardError; end
end
