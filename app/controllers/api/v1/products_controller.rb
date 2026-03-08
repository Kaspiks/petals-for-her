# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = Product.active.includes(:collection, :primary_fragrance_option, :occasions)
        products = products.where(collection_id: params[:collection_id]) if params[:collection_id].present?

        if params[:occasion_id].present?
          products = products.joins(:occasion_products).where(occasion_products: { occasion_id: params[:occasion_id] })
        end

        if params[:q].present?
          products = products.where("products.name ILIKE ?", "%#{params[:q]}%")
        end

        if params[:scent_profile].present?
          products = products.joins(:primary_fragrance_option)
                            .where(classification_values: { value: params[:scent_profile] })
        end

        if params[:min_price].present?
          products = products.where("products.price >= ?", params[:min_price].to_f)
        end
        if params[:max_price].present?
          products = products.where("products.price <= ?", params[:max_price].to_f)
        end

        if params[:sort] == "price_asc"
          products = products.order(price: :asc)
        elsif params[:sort] == "price_desc"
          products = products.order(price: :desc)
        elsif params[:sort] == "newest"
          products = products.order(created_at: :desc)
        else
          products = products.order(:name)
        end

        total = products.count

        if params[:page].present?
          page = [params[:page].to_i, 1].max
          per_page = [params[:per_page].to_i, 1].max
          per_page = 12 if params[:per_page].blank?
          products = products.offset((page - 1) * per_page).limit(per_page)

          render json: {
            data: products.map { |p| product_json(p) },
            total: total,
            page: page,
            per_page: per_page
          }
        else
          render json: products.map { |p| product_json(p) }
        end
      end

      def show
        product = Product.active.includes(:collection, :primary_fragrance_option)
                         .find_by(slug: params[:id]) || Product.active.find(params[:id])
        raise ActiveRecord::RecordNotFound unless product

        render json: product_json(product, full: true)
      end

      private

      def product_json(product, full: false)
        json = {
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.to_f,
          collection_type: product.collection_type,
          stock_status: product.stock_status,
          scent_profile: product.primary_fragrance_option&.value,
          meta_title: product.meta_title,
          meta_description: product.meta_description,
          collection: {
            id: product.collection.id,
            name: product.collection.name,
            slug: product.collection.slug
          },
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }

        if full
          json[:gallery_image_urls] = product.gallery_images.map { |img| rails_blob_url(img) }
          json[:scent_intensity] = product.scent_intensity
        end

        json
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
