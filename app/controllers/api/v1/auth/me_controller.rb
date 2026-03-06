# frozen_string_literal: true

module Api
  module V1
    module Auth
      class MeController < ApplicationController
        before_action :authenticate_user!

        def show
          render json: {
            id: current_user.id,
            email: current_user.email,
            full_name: current_user.full_name,
            admin: current_user.admin?
          }
        end
      end
    end
  end
end
