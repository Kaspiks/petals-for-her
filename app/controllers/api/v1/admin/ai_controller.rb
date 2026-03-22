# frozen_string_literal: true

module Api
  module V1
    module Admin
      # AI Layout Engine - single endpoint for Claude completion
      # Frontend sends system_prompt + user_message; optionally image_base64 for screenshot analysis
      class AiController < BaseController
        def complete
          system_prompt = params[:system_prompt].to_s
          user_message = params[:user_message].to_s
          image_base64 = params[:image_base64].presence
          temperature = params[:temperature].present? ? params[:temperature].to_f.clamp(0.0, 1.0) : nil

          if system_prompt.blank? || user_message.blank?
            return render json: { error: "system_prompt and user_message required" }, status: :unprocessable_entity
          end

          content = AiLayoutService.new.complete(
            system_prompt: system_prompt,
            user_message: user_message,
            image_base64: image_base64,
            temperature: temperature
          )

          render json: { content: content }
        rescue => e
          Rails.logger.error("AI complete error: #{e.message}")
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
end
