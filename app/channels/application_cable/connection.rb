# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token] || request.headers["Authorization"]&.sub("Bearer ", "")
      return reject_unauthorized_connection if token.blank?

      decoded = Warden::JWTAuth::TokenDecoder.new.call(token)
      user = User.find_by(id: decoded["sub"], jti: decoded["jti"])
      user || reject_unauthorized_connection
    rescue JWT::DecodeError, JWT::ExpiredSignature
      reject_unauthorized_connection
    end
  end
end
