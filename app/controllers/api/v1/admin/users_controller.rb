# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UsersController < BaseController
        def index
          users = User
            .order(created_at: :desc)

          users = users.where(admin: params[:admin]) if params[:admin]

          orders = orders.where(order_status_id: params[:status_id]) if params[:status_id].present?

          if params[:q].present?
            q = "%#{params[:q]}%"
            conditions = ["orders.email ILIKE :q OR orders.customer_name ILIKE :q"]
            binds = { q: }
            if (id_num = params[:q].to_s.gsub(/\D/, "")).present?
              conditions << "orders.id = :id"
              binds[:id] = id_num.to_i
            end
            orders = orders.where(conditions.join(" OR "), binds)
          end

          if params[:from_date].present?
            orders = orders.where("orders.created_at >= ?", Time.zone.parse(params[:from_date]))
          end
          if params[:to_date].present?
            orders = orders.where("orders.created_at <= ?", Time.zone.parse(params[:to_date]).end_of_day)
          end

          total_count = orders.count
          per_page = [(params[:per_page] || 25).to_i, 100].min
          page = [params[:page].to_i, 1].max
          orders = orders.offset((page - 1) * per_page).limit(per_page)

          render json: {
            orders: orders.map { |o| order_json(o) },
            total: total_count,
            page:,
            per_page:
          }
        end

        # def show
        #   order = Order.includes(:order_status, order_items: { product: :collection }).find(params[:id])
        #   render json: order_detail_json(order)
        # end

        # def update
        #   order = Order.find(params[:id])
        #   status_id = params[:order_status_id] || params.dig(:order, :order_status_id)
        #   if status_id.present?
        #     order.update!(order_status_id: status_id)
        #     render json: order_detail_json(order.reload)
        #   else
        #     render json: { error: "order_status_id required" }, status: :unprocessable_entity
        #   end
        # end

        # private

        # def order_json(order)
        #   items_summary = order.order_items.map do |oi|
        #     "#{oi.quantity}x #{oi.product.name}"
        #   end.join(", ")
        #   {
        #     id: order.id,
        #     order_id: "ORD-#{order.id}",
        #     customer_name: order.customer_name.presence || order.email,
        #     email: order.email,
        #     items: items_summary,
        #     total: order.total.to_f,
        #     status: order.order_status.name,
        #     status_code: order.order_status.code,
        #     created_at: order.created_at.iso8601
        #   }
        # end

        # def order_detail_json(order)
        #   {
        #     id: order.id,
        #     order_id: "ORD-#{order.id}",
        #     customer_name: order.customer_name,
        #     email: order.email,
        #     shipping_address: order.shipping_address,
        #     total: order.total.to_f,
        #     status: order.order_status.name,
        #     status_code: order.order_status.code,
        #     created_at: order.created_at.iso8601,
        #     order_items: order.order_items.map do |oi|
        #       {
        #         id: oi.id,
        #         product_id: oi.product.id,
        #         product_name: oi.product.name,
        #         quantity: oi.quantity,
        #         unit_price: oi.unit_price.to_f,
        #         subtotal: (oi.quantity * oi.unit_price).to_f,
        #         image_url: oi.product.image.attached? ? rails_blob_url(oi.product.image) : nil
        #       }
        #     end,
        #     available_statuses: OrderStatus.order(:id).map { |s| { id: s.id, code: s.code, name: s.name } }
        #   }
        # end

        # def rails_blob_url(blob)
        #   Rails.application.routes.url_helpers.rails_blob_url(blob)
        # end
      end
    end
  end
end
