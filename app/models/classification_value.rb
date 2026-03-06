# frozen_string_literal: true

class ClassificationValue < ApplicationRecord
  belongs_to :classification

  has_many :products_as_vase, class_name: "Product", foreign_key: :vase_option_id, inverse_of: :vase_option, dependent: :nullify
  has_many :products_as_ribbon_material, class_name: "Product", foreign_key: :ribbon_material_id, inverse_of: :ribbon_material, dependent: :nullify
  has_many :products_as_ribbon_color, class_name: "Product", foreign_key: :ribbon_color_id, inverse_of: :ribbon_color, dependent: :nullify
  has_many :products_as_primary_fragrance, class_name: "Product", foreign_key: :primary_fragrance_option_id, inverse_of: :primary_fragrance_option, dependent: :nullify

  validates :value, presence: true
  validates :value, uniqueness: { scope: :classification_id }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:sort_order, :value) }

  class << self
    def by_classification_code(code)
      joins(:classification).where(classifications: { code: code })
    end
  end
end

# == Schema Information
#
# Table name: classification_values
#
#  id                :bigint           not null, primary key
#  active            :boolean          default(TRUE), not null
#  hex_code          :string(20)
#  sort_order        :integer          default(0), not null
#  value             :string(500)      not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  classification_id :bigint           not null
#
# Indexes
#
#  index_classification_values_on_classification_id            (classification_id)
#  index_classification_values_on_classification_id_and_value  (classification_id,value) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (classification_id => classifications.id)
#
