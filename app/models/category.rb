# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :posts, dependent: :nullify
  has_many :subcategories, class_name: "Category", foreign_key: :parent_category_id, dependent: :nullify
  belongs_to :parent_category, class_name: "Category", optional: true

  has_one_attached :hero_image

  validates :name, presence: true, length: { maximum: 255 }
  validates :slug, presence: true, uniqueness: true, length: { maximum: 255 }
  validates :category_type, presence: true, inclusion: { in: %w[product journal] }
  validates :visibility, inclusion: { in: %w[public internal] }
  validates :meta_title, length: { maximum: 255 }, allow_blank: true
  validates :meta_description, length: { maximum: 500 }, allow_blank: true

  before_validation :generate_slug

  scope :active, -> { where(active: true) }
  scope :journal, -> { where(category_type: "journal") }
  scope :product, -> { where(category_type: "product") }
  scope :top_level, -> { where(parent_category_id: nil) }
  scope :visible, -> { where(visibility: "public") }

  CATEGORY_TYPES = %w[product journal].freeze
  VISIBILITIES = %w[public internal].freeze

  private

  def generate_slug
    return if name.blank?
    return if slug.present? && !name_changed?

    base = name.parameterize.presence || "category"
    candidate = base
    n = 0
    while Category.where(slug: candidate).where.not(id: id).exists?
      n += 1
      candidate = "#{base}-#{n}"
    end
    self.slug = candidate
  end
end

# == Schema Information
#
# Table name: categories
#
#  id                 :bigint           not null, primary key
#  active             :boolean          default(TRUE), not null
#  category_type      :string(20)       default("journal"), not null
#  description        :text
#  meta_description   :text
#  meta_title         :string(255)
#  name               :string           not null
#  slug               :string           not null
#  visibility         :string(20)       default("public"), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_category_id :bigint
#
# Indexes
#
#  index_categories_on_active              (active)
#  index_categories_on_category_type       (category_type)
#  index_categories_on_parent_category_id  (parent_category_id)
#  index_categories_on_slug                (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (parent_category_id => categories.id)
#
