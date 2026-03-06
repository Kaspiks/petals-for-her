# frozen_string_literal: true

class Collection < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true, length: { maximum: 255 }
  validates :slug, presence: true, uniqueness: true, length: { maximum: 255 }
end

# == Schema Information
#
# Table name: collections
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_collections_on_slug  (slug) UNIQUE
#
