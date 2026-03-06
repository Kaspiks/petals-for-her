# frozen_string_literal: true

class OccasionProduct < ApplicationRecord
  belongs_to :occasion
  belongs_to :product

  validates :product_id, uniqueness: { scope: :occasion_id }
end

# == Schema Information
#
# Table name: occasion_products
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  occasion_id :bigint           not null
#  product_id  :bigint           not null
#
# Indexes
#
#  index_occasion_products_on_occasion_id                 (occasion_id)
#  index_occasion_products_on_occasion_id_and_product_id  (occasion_id,product_id) UNIQUE
#  index_occasion_products_on_product_id                  (product_id)
#
# Foreign Keys
#
#  fk_rails_...  (occasion_id => occasions.id)
#  fk_rails_...  (product_id => products.id)
#
