# frozen_string_literal: true

module Api
  module V1
    module Auth
      class VerificationsController < ApplicationController
        respond_to :json

        def create
          user = User.find_by(email: params[:email])
          unless user
            return render json: { error: "Email not found" }, status: :not_found
          end
          if user.confirmed?
            return render json: { error: "Account is already verified" }, status: :unprocessable_entity
          end

          code = params[:code].to_s.gsub(/\s+/, "")
          if code.blank?
            return render json: { error: "Verification code is required" }, status: :unprocessable_entity
          end
          if code != user.verification_code
            return render json: { error: "Invalid verification code" }, status: :unprocessable_entity
          end

          user.update!(
            confirmed_at: Time.current,
            verification_code: nil,
            confirmation_token: nil
          )

          sign_in(:user, user, store: false)
          token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
          response.headers["Authorization"] = "Bearer #{token}"
          render json: user_json(user).merge(token: token), status: :ok
        end

        def resend
          user = User.find_by(email: params[:email])
          unless user
            return render json: { error: "Email not found" }, status: :not_found
          end
          if user.confirmed?
            return render json: { error: "Account is already verified" }, status: :unprocessable_entity
          end

          if user.verification_code_sent_at && user.verification_code_sent_at > 2.minutes.ago
            return render json: {
              error: "Please wait before requesting a new code",
              retry_after: (user.verification_code_sent_at + 2.minutes - Time.current).ceil
            }, status: :too_many_requests
          end

          user.update!(
            verification_code: format("%06d", rand(100_000..999_999)),
            verification_code_sent_at: Time.current
          )
          UserVerificationMailer.verification_code(user).deliver_later

          render json: { message: "Verification code sent" }, status: :ok
        end

        private

        def user_json(user)
          {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            created_at: user.created_at
          }
        end
      end
    end
  end
end
