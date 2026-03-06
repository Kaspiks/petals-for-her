# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = Product.active.includes(:collection)
        products = products.where(collection_id: params[:collection_id]) if params[:collection_id].present?
        render json: products.map { |p| product_json(p) }
      end

      def show
        product = Product.active.find_by(slug: params[:id]) || Product.active.find(params[:id])
        raise ActiveRecord::RecordNotFound unless product

        render json: product_json(product)
      end

      private

      def product_json(product)
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price.to_f,
          collection_type: product.collection_type,
          stock_status: product.stock_status,
          meta_title: product.meta_title,
          meta_description: product.meta_description,
          collection: {
            id: product.collection.id,
            name: product.collection.name,
            slug: product.collection.slug
          },
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
