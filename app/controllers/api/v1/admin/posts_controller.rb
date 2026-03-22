# frozen_string_literal: true

module Api
  module V1
    module Admin
      class PostsController < BaseController
        def index
          posts = Post.includes(:category, :author, :products).by_newest

          posts = posts.where(status: params[:status]) if params[:status].present?
          posts = posts.where(category_id: params[:category_id]) if params[:category_id].present?

          if params[:q].present?
            posts = posts.joins(:author).where(
              "posts.title ILIKE :q OR users.full_name ILIKE :q",
              q: "%#{params[:q]}%"
            )
          end

          total = posts.count
          page = [params[:page].to_i, 1].max
          per_page = params[:per_page].present? ? [params[:per_page].to_i, 1].max : 20
          posts = posts.offset((page - 1) * per_page).limit(per_page)

          render json: {
            data: posts.map { |p| post_json(p) },
            total: total,
            page: page,
            per_page: per_page,
            stats: {
              total_posts: Post.count,
              published: Post.published.count,
              drafts: Post.drafts.count,
              scheduled: Post.scheduled.count
            }
          }
        end

        def show
          post = Post.includes(:category, :author, :products).find(params[:id])
          render json: post_json(post, full: true)
        end

        def create
          post = Post.new(post_params)
          post.author = current_user
          post.published_at = Time.current if post.status == "published" && post.published_at.blank?

          if post.save
            attach_image(post) if params[:hero_image].present?
            sync_products(post) if params[:product_ids].present?
            render json: post_json(post.reload, full: true), status: :created
          else
            render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          post = Post.find(params[:id])

          if params[:status] == "published" && post.status != "published"
            post.published_at ||= Time.current
          end

          if post.update(post_params)
            attach_image(post) if params[:hero_image].present?
            sync_products(post) if params.key?(:product_ids)
            render json: post_json(post.reload, full: true)
          else
            render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          post = Post.find(params[:id])
          post.destroy!
          head :no_content
        end

        private

        def post_params
          permitted = params.permit(
            :title, :slug, :status, :featured, :published_at,
            :category_id, :meta_title, :meta_description,
            product_ids: [],
            puck_data: {},
            post: {}
          ).to_h

          permitted.delete(:post)
          permitted.delete(:product_ids) # Handled by sync_products, not a model attribute

          puck_data = params[:puck_data] || params.dig(:post, :puck_data)
          if puck_data.present?
            permitted[:puck_data] = if puck_data.is_a?(String)
              JSON.parse(puck_data)
            else
              puck_data.permit!.to_h
            end
          end

          permitted
        end

        def sync_products(post)
          ids = Array(params[:product_ids] || params.dig(:post, :product_ids)).map(&:to_i).select(&:positive?)
          post.post_products.where.not(product_id: ids).destroy_all
          ids.each_with_index do |product_id, index|
            post.post_products.find_or_create_by(product_id: product_id) do |pp|
              pp.sort_order = index
            end
          end
        end

        def attach_image(post)
          post.hero_image.purge if post.hero_image.attached?
          post.hero_image.attach(params[:hero_image])
        end

        def post_json(post, full: false)
          data = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            status: post.status,
            featured: post.featured,
            published_at: post.published_at,
            word_count: post.word_count,
            reading_time: post.reading_time,
            meta_title: post.meta_title,
            meta_description: post.meta_description,
            category: post.category ? { id: post.category.id, name: post.category.name, slug: post.category.slug } : nil,
            author: { id: post.author.id, name: post.author.full_name },
            hero_image_url: post.hero_image.attached? ? rails_blob_url(post.hero_image) : nil,
            created_at: post.created_at,
            updated_at: post.updated_at
          }

          if full
            data[:puck_data] = post.puck_data
            data[:product_ids] = post.post_products.pluck(:product_id)
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
end
