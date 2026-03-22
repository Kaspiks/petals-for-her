# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ApplicationController
      def index
        categories = Category.active.visible.journal.order(:name)

        render json: {
          data: categories.map { |c| category_json(c) }
        }
      end

      def show
        category = Category.active.visible.find_by!(slug: params[:id])

        render json: category_json(category)
      end

      private

      def category_json(category)
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          posts_count: category.posts.published.count,
          hero_image_url: category.hero_image.attached? ? rails_blob_url(category.hero_image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
