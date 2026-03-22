# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CategoriesController < BaseController
        def index
          categories = Category.all.order(:name)

          categories = categories.where(category_type: params[:category_type]) if params[:category_type].present?

          if params[:q].present?
            categories = categories.where(
              "name ILIKE :q OR slug ILIKE :q OR description ILIKE :q",
              q: "%#{params[:q]}%"
            )
          end

          total = categories.count
          page = [params[:page].to_i, 1].max
          per_page = params[:per_page].present? ? [params[:per_page].to_i, 1].max : 20
          categories = categories.offset((page - 1) * per_page).limit(per_page)

          product_count = Category.product.count
          journal_count = Category.journal.count
          total_items = Post.count + Product.count

          render json: {
            data: categories.map { |c| category_json(c) },
            total: total,
            page: page,
            per_page: per_page,
            stats: {
              product_categories: product_count,
              journal_categories: journal_count,
              total_items_categorized: total_items
            }
          }
        end

        def show
          category = Category.find(params[:id])
          render json: category_json(category)
        end

        def create
          category = Category.new(category_params)
          if category.save
            attach_image(category) if params[:hero_image].present?
            render json: category_json(category.reload), status: :created
          else
            render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          category = Category.find(params[:id])
          if category.update(category_params)
            attach_image(category) if params[:hero_image].present?
            render json: category_json(category.reload)
          else
            render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          category = Category.find(params[:id])
          if category.posts.any?
            render json: { errors: ["Cannot delete category with associated posts"] }, status: :unprocessable_entity
          else
            category.destroy!
            head :no_content
          end
        end

        private

        def category_params
          params.permit(
            :name, :slug, :description, :category_type, :active,
            :visibility, :parent_category_id, :meta_title, :meta_description
          )
        end

        def attach_image(category)
          category.hero_image.purge if category.hero_image.attached?
          category.hero_image.attach(params[:hero_image])
        end

        def category_json(category)
          items_count = if category.category_type == "journal"
            category.posts.count
          else
            0
          end

          {
            id: category.id,
            name: category.name,
            slug: category.slug,
            category_type: category.category_type,
            description: category.description,
            active: category.active,
            visibility: category.visibility,
            parent_category_id: category.parent_category_id,
            parent_category_name: category.parent_category&.name,
            meta_title: category.meta_title,
            meta_description: category.meta_description,
            items_count: items_count,
            hero_image_url: category.hero_image.attached? ? rails_blob_url(category.hero_image) : nil,
            created_at: category.created_at,
            updated_at: category.updated_at
          }
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob)
        end
      end
    end
  end
end
