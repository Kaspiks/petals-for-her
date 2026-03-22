# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :author, class_name: "User"

  has_many :post_products, dependent: :destroy
  has_many :products, through: :post_products

  has_one_attached :hero_image

  validates :title, presence: true, length: { maximum: 255 }
  validates :slug, presence: true, uniqueness: true, length: { maximum: 255 }
  validates :status, presence: true, inclusion: { in: %w[draft published scheduled] }
  validates :meta_title, length: { maximum: 255 }, allow_blank: true
  validates :meta_description, length: { maximum: 500 }, allow_blank: true

  before_validation :generate_slug
  before_save :compute_reading_stats

  scope :published, -> { where(status: "published") }
  scope :drafts, -> { where(status: "draft") }
  scope :scheduled, -> { where(status: "scheduled") }
  scope :featured, -> { where(featured: true) }
  scope :by_newest, -> { order(created_at: :desc) }
  scope :published_order, -> { order(published_at: :desc) }

  STATUSES = %w[draft published scheduled].freeze

  private

  def generate_slug
    return if title.blank?
    return if slug.present? && !title_changed?

    base = title.parameterize.presence || "post"
    candidate = base
    n = 0
    while Post.where(slug: candidate).where.not(id: id).exists?
      n += 1
      candidate = "#{base}-#{n}"
    end
    self.slug = candidate
  end

  def compute_reading_stats
    text = extract_text_from_puck_data
    words = text.split(/\s+/).reject(&:blank?).length
    self.word_count = words
    self.reading_time = [(words / 200.0).ceil, 1].max
  end

  def extract_text_from_puck_data
    return "" if puck_data.blank?

    content = puck_data["content"] || []
    content.map { |block| extract_block_text(block) }.join(" ")
  end

  def extract_block_text(block)
    props = block["props"] || {}
    texts = []
    props.each_value do |v|
      texts << v if v.is_a?(String)
      texts << extract_block_text(v) if v.is_a?(Hash)
      v.each { |item| texts << extract_block_text(item) } if v.is_a?(Array)
    end
    texts.join(" ")
  end
end

# == Schema Information
#
# Table name: posts
#
#  id               :bigint           not null, primary key
#  featured         :boolean          default(FALSE), not null
#  meta_description :text
#  meta_title       :string(255)
#  published_at     :datetime
#  puck_data        :jsonb            not null
#  reading_time     :integer          default(0)
#  slug             :string           not null
#  status           :string(20)       default("draft"), not null
#  title            :string           not null
#  word_count       :integer          default(0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  author_id        :bigint           not null
#  category_id      :bigint
#
# Indexes
#
#  index_posts_on_author_id     (author_id)
#  index_posts_on_category_id   (category_id)
#  index_posts_on_featured      (featured)
#  index_posts_on_published_at  (published_at)
#  index_posts_on_slug          (slug) UNIQUE
#  index_posts_on_status        (status)
#
# Foreign Keys
#
#  fk_rails_...  (author_id => users.id)
#  fk_rails_...  (category_id => categories.id)
#
