# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DashboardController < BaseController
        def index
          period = params[:period] || "month"
          range = date_range_for(period)
          previous_range = previous_date_range_for(period)

          orders_scope = Order.joins(:order_status).where.not(order_statuses: { code: "cancelled" })
          current_orders = orders_scope.where(created_at: range)
          previous_orders = orders_scope.where(created_at: previous_range)

          total_revenue = current_orders.sum(:total).to_f
          previous_revenue = previous_orders.sum(:total).to_f
          revenue_change = previous_revenue.positive? ? ((total_revenue - previous_revenue) / previous_revenue * 100).round(1) : 0

          total_orders_count = current_orders.count
          previous_orders_count = previous_orders.count
          orders_change = previous_orders_count.positive? ? ((total_orders_count - previous_orders_count).to_f / previous_orders_count * 100).round(1) : 0

          most_popular = most_popular_collection(range)
          sales_trends = sales_trends_data(range, period)
          recent_orders = recent_orders_data(10)
          scent_popularity = scent_popularity_data(range)
          top_products = top_products_data(range)

          render json: {
            total_revenue:,
            total_revenue_change: revenue_change,
            total_orders: total_orders_count,
            total_orders_change: orders_change,
            most_popular_scent: most_popular,
            sales_trends:,
            recent_orders:,
            scent_popularity:,
            top_products_by_sales: top_products,
            period:,
            date_range: { start: range.begin, end: range.end }
          }
        end

        private

        def date_range_for(period)
          now = Time.current
          case period
          when "week"
            1.week.ago.beginning_of_week..now.end_of_week
          when "month"
            1.month.ago.beginning_of_month..now.end_of_month
          else
            1.month.ago.beginning_of_month..now.end_of_month
          end
        end

        def previous_date_range_for(period)
          now = Time.current
          case period
          when "week"
            2.weeks.ago.beginning_of_week..1.week.ago.end_of_week
          when "month"
            2.months.ago.beginning_of_month..1.month.ago.end_of_month
          else
            2.months.ago.beginning_of_month..1.month.ago.end_of_month
          end
        end

        def most_popular_collection(range)
          result = OrderItem
            .joins(order: :order_status, product: :collection)
            .where(orders: { created_at: range })
            .where.not(order_statuses: { code: "cancelled" })
            .group("collections.name")
            .select("collections.name, SUM(order_items.quantity * order_items.unit_price) as revenue")
            .order("revenue DESC")
            .first

          return { name: "N/A", description: "No sales yet" } unless result

          { name: result.name, description: "Top seller this period" }
        end

        def sales_trends_data(range, period)
          group_expr = period == "month" ? "DATE_TRUNC('month', orders.created_at)" : "DATE_TRUNC('week', orders.created_at)"
          groups = Order
            .joins(:order_status)
            .where(created_at: range)
            .where.not(order_statuses: { code: "cancelled" })
            .group(group_expr)
            .sum(:total)

          groups.sort_by { |date, _| date }.map do |date, total|
            { label: date.to_date.strftime("%b %d"), value: total.to_f }
          end
        end

        def recent_orders_data(limit)
          Order
            .includes(:order_status, order_items: { product: :collection })
            .order(created_at: :desc)
            .limit(limit)
            .map { |o| order_json(o) }
        end

        def order_json(order)
          items_summary = order.order_items.map do |oi|
            "#{oi.quantity}x #{oi.product.name}"
          end.join(", ")
          {
            id: order.id,
            order_id: "ORD-#{order.id}",
            customer_name: order.customer_name.presence || order.email,
            email: order.email,
            items: items_summary,
            total: order.total.to_f,
            status: order.order_status.name,
            status_code: order.order_status.code,
            created_at: order.created_at.iso8601
          }
        end

        def scent_popularity_data(range)
          totals = OrderItem
            .joins(order: :order_status, product: :collection)
            .where(orders: { created_at: range })
            .where.not(order_statuses: { code: "cancelled" })
            .group("collections.name")
            .sum("order_items.quantity * order_items.unit_price")

          grand_total = totals.values.sum.to_f
          return [] if grand_total.zero?

          totals.map do |name, revenue|
            {
              name:,
              revenue: revenue.to_f,
              percentage: ((revenue / grand_total) * 100).round(1)
            }
          end.sort_by { |h| -h[:revenue] }
        end

        def top_products_data(range, limit: 5)
          OrderItem
            .joins(order: :order_status, product: :collection)
            .where(orders: { created_at: range })
            .where.not(order_statuses: { code: "cancelled" })
            .group("products.id", "products.name", "products.description", "collections.name")
            .select(
              "products.id",
              "products.name",
              "products.description",
              "collections.name as collection_name",
              "SUM(order_items.quantity * order_items.unit_price) as total_sales",
              "SUM(order_items.quantity) as sale_count"
            )
            .order("total_sales DESC")
            .limit(limit)
            .map do |row|
              product = Product.find(row.id)
              {
                id: product.id,
                name: product.name,
                description: product.description.to_s.truncate(50),
                collection_name: row.collection_name,
                total_sales: row.total_sales.to_f,
                sale_count: row.sale_count.to_i,
                image_url: product.image.attached? ? rails_blob_url(product.image) : nil
              }
            end
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob)
        end
      end
    end
  end
end
