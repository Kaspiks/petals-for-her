# frozen_string_literal: true

class GeminiChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def unsubscribed
    # Cleanup if needed
  end

  def generate(data)
    GeminiStreamJob.perform_later(
      user_id: current_user.id,
      prompt_type: data["prompt_type"],
      custom_prompt: data["custom_prompt"],
      context: data["context"]
    )
  end
end
