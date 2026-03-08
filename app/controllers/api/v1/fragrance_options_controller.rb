# frozen_string_literal: true

module Api
  module V1
    class FragranceOptionsController < ApplicationController
      def index
        classification = Classification.find_by(code: "primary_fragrance")
        return render json: [] unless classification

        values = classification.classification_values.active.ordered
        render json: values.map { |v| { id: v.id, value: v.value } }
      end
    end
  end
end
