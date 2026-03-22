# frozen_string_literal: true

class PostProduct < ApplicationRecord
  belongs_to :post
  belongs_to :product

  validates :product_id, uniqueness: { scope: :post_id }

  default_scope { order(:sort_order) }
end

# == Schema Information
#
# Table name: post_products
#
#  id         :bigint           not null, primary key
#  sort_order :integer          default(0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :bigint           not null
#  product_id :bigint           not null
#
# Indexes
#
#  index_post_products_on_post_id                 (post_id)
#  index_post_products_on_post_id_and_product_id  (post_id,product_id) UNIQUE
#  index_post_products_on_product_id              (product_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (product_id => products.id)
#
