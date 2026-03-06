# frozen_string_literal: true

module Api
  module V1
    module Admin
      class OrderStatusesController < BaseController
        def index
          statuses = OrderStatus.order(:id).map { |s| { id: s.id, code: s.code, name: s.name } }
          render json: statuses
        end
      end
    end
  end
end
