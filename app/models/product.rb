# frozen_string_literal: true

class Product < ApplicationRecord
  belongs_to :collection
  belongs_to :vase_option, class_name: "ClassificationValue", optional: true
  belongs_to :ribbon_material, class_name: "ClassificationValue", optional: true
  belongs_to :ribbon_color, class_name: "ClassificationValue", optional: true
  belongs_to :primary_fragrance_option, class_name: "ClassificationValue", optional: true

  has_many :order_items, dependent: :restrict_with_error

  has_one_attached :image

  validates :name, presence: true, length: { maximum: 255 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :collection_type, length: { maximum: 255 }, allow_blank: true
  validates :sku, uniqueness: true, allow_blank: true

  before_validation :generate_sku, on: :create

  scope :active, -> { where(active: true) }

  SCENT_INTENSITIES = %w[subtle moderate strong].freeze
  STOCK_STATUSES = %w[in_stock out_of_stock].freeze

  private

  def generate_sku
    return if sku.present?

    prefix = "PFH"
    max_num = Product.where("sku ~ ?", "^#{prefix}-[0-9]+$")
      .maximum("CAST(SUBSTRING(sku FROM 5) AS INTEGER)") || 0
    self.sku = format("%s-%05d", prefix, max_num + 1)
  end
end

# == Schema Information
#
# Table name: products
#
#  id                          :bigint           not null, primary key
#  active                      :boolean          default(TRUE), not null
#  collection_type             :string
#  description                 :text
#  gift_wrapping_included      :boolean          default(TRUE), not null
#  include_scent_refill        :boolean          default(FALSE), not null
#  name                        :string           not null
#  price                       :decimal(10, 2)   not null
#  scent_intensity             :string(50)       default("moderate")
#  silk_material_type          :string(255)
#  sku                         :string(100)
#  stock_status                :string(50)       default("in_stock")
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  collection_id               :bigint           not null
#  primary_fragrance_option_id :bigint
#  ribbon_color_id             :bigint
#  ribbon_material_id          :bigint
#  vase_option_id              :bigint
#
# Indexes
#
#  index_products_on_active                       (active)
#  index_products_on_collection_id                (collection_id)
#  index_products_on_name                         (name)
#  index_products_on_primary_fragrance_option_id  (primary_fragrance_option_id)
#  index_products_on_ribbon_color_id              (ribbon_color_id)
#  index_products_on_ribbon_material_id           (ribbon_material_id)
#  index_products_on_sku                          (sku) UNIQUE
#  index_products_on_vase_option_id               (vase_option_id)
#
# Foreign Keys
#
#  fk_rails_...  (collection_id => collections.id)
#  fk_rails_...  (primary_fragrance_option_id => classification_values.id)
#  fk_rails_...  (ribbon_color_id => classification_values.id)
#  fk_rails_...  (ribbon_material_id => classification_values.id)
#  fk_rails_...  (vase_option_id => classification_values.id)
#
