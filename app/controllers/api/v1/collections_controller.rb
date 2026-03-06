# frozen_string_literal: true

module Api
  module V1
    class CollectionsController < ApplicationController
      def index
        collections = Collection.includes(:products).all
        render json: collections.map { |c| collection_json(c) }
      end

      def show
        collection = Collection.includes(:products).find(params[:id])
        render json: collection_json(collection)
      end

      private

      def collection_json(collection)
        {
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description,
          products: collection.products.active.map { |p| product_json(p) }
        }
      end

      def product_json(product)
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.to_f,
          collection_type: product.collection_type,
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
