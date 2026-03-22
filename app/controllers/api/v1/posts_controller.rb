# frozen_string_literal: true

module Api
  module V1
    class PostsController < ApplicationController
      def index
        posts = Post.published.includes(:category, :author, :products).published_order

        posts = posts.where(category_id: params[:category_id]) if params[:category_id].present?
        posts = posts.featured if params[:featured] == "true"

        total = posts.count
        page = [params[:page].to_i, 1].max
        per_page = params[:per_page].present? ? [params[:per_page].to_i, 1].max : 12
        posts = posts.offset((page - 1) * per_page).limit(per_page)

        render json: {
          data: posts.map { |p| post_json(p) },
          total: total,
          page: page,
          per_page: per_page
        }
      end

      def show
        post = Post.published.includes(:category, :author, :products).find_by!(slug: params[:id])

        render json: post_json(post, full: true)
      end

      private

      def post_json(post, full: false)
        data = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          published_at: post.published_at,
          word_count: post.word_count,
          reading_time: post.reading_time,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          category: post.category ? { id: post.category.id, name: post.category.name, slug: post.category.slug } : nil,
          author: { id: post.author.id, name: post.author.full_name },
          hero_image_url: post.hero_image.attached? ? rails_blob_url(post.hero_image) : nil
        }

        if full
          data[:puck_data] = post.puck_data
          data[:products] = post.products.map do |product|
            {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price.to_f,
              image_url: product.image.attached? ? rails_blob_url(product.image) : nil
            }
          end
        end

        data
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
