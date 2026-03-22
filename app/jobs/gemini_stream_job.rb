# frozen_string_literal: true

class GeminiStreamJob < ApplicationJob
  queue_as :default

  def perform(user_id:, prompt_type:, custom_prompt: nil, context: nil)
    user = User.find(user_id)
    service = ClaudeService.new

    GeminiChannel.broadcast_to(user, { type: "start", prompt_type: prompt_type })

    service.stream_generate(
      prompt_type: prompt_type,
      custom_prompt: custom_prompt,
      context: context
    ) do |chunk|
      GeminiChannel.broadcast_to(user, { type: "chunk", content: chunk })
    end

    GeminiChannel.broadcast_to(user, { type: "complete" })
  rescue => e
    Rails.logger.error("GeminiStreamJob error: #{e.message}")
    GeminiChannel.broadcast_to(user, { type: "error", content: e.message })
  end
end
