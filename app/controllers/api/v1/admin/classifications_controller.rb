# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ClassificationsController < BaseController
        def index
          codes = params[:codes].to_s.split(",").map(&:strip).reject(&:blank?)
          classifications = if codes.any?
            Classification.where(code: codes).includes(:classification_values)
          else
            Classification.includes(:classification_values).order(:code)
          end

          render json: classifications.map { |c| classification_json(c) }
        end

        def show
          classification = params[:id].match?(/\A\d+\z/) ? Classification.find(params[:id]) : Classification.find_by!(code: params[:id])
          render json: classification_json(classification)
        end

        def create
          classification = Classification.new(classification_params)
          if classification.save
            render json: classification_json(classification), status: :created
          else
            render json: { errors: classification.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          classification = Classification.find(params[:id])
          if classification.update(classification_params)
            render json: classification_json(classification)
          else
            render json: { errors: classification.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def classification_params
          params.permit(:code, :name)
        end

        def classification_json(c)
          {
            id: c.id,
            code: c.code,
            name: c.name,
            values: c.classification_values.active.ordered.map { |v| classification_value_json(v) }
          }
        end

        def classification_value_json(v)
          {
            id: v.id,
            value: v.value,
            hex_code: v.hex_code,
            sort_order: v.sort_order
          }
        end
      end
    end
  end
end
