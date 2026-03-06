# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        def create
          build_resource(sign_up_params)
          resource.save
          if resource.persisted?
            resource.update!(
              verification_code: format("%06d", rand(100_000..999_999)),
              verification_code_sent_at: Time.current
            )
            UserVerificationMailer.verification_code(resource).deliver_later

            render json: {
              needs_verification: true,
              email: resource.email,
              message: "Verification code sent to your email"
            }, status: :created
          else
            render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :full_name)
        end

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
