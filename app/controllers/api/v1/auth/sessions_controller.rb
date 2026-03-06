# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        def create
          self.resource = User.find_by(email: params[:user][:email])
          unless resource&.valid_password?(params[:user][:password])
            return render json: { error: "Invalid email or password" }, status: :unauthorized
          end
          unless resource.confirmed?
            return render json: { error: "Please verify your email address first" }, status: :forbidden
          end
          sign_in(:user, resource, store: false)
          token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first
          response.headers["Authorization"] = "Bearer #{token}"
          render json: user_json(resource).merge(token: token), status: :ok
        end

        def destroy
          signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
          render json: { message: "Signed out successfully" } if signed_out
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
