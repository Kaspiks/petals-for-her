# frozen_string_literal: true

class Collection < ApplicationRecord
  has_many :products, dependent: :restrict_with_error

  has_one_attached :featured_image
  has_many_attached :gallery_images

  validates :name, presence: true, length: { maximum: 255 }
  validates :slug, presence: true, uniqueness: true, length: { maximum: 255 }
  validates :meta_title, length: { maximum: 255 }, allow_blank: true
  validates :meta_description, length: { maximum: 500 }, allow_blank: true

  before_validation :generate_slug

  scope :active, -> { where(active: true) }

  private

  def generate_slug
    return if name.blank?
    return if slug.present? && !name_changed?

    base = name.parameterize.presence || "collection"
    candidate = base
    n = 0
    while Collection.where(slug: candidate).where.not(id: id).exists?
      n += 1
      candidate = "#{base}-#{n}"
    end
    self.slug = candidate
  end
end

# == Schema Information
#
# Table name: collections
#
#  id               :bigint           not null, primary key
#  active           :boolean          default(TRUE), not null
#  description      :text
#  meta_description :text
#  meta_title       :string(255)
#  name             :string           not null
#  slug             :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_collections_on_slug  (slug) UNIQUE
#
