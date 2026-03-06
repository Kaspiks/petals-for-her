# frozen_string_literal: true

class AddSlugToProducts < ActiveRecord::Migration[8.1]
  def up
    add_column :products, :slug, :string, limit: 255
    add_index :products, :slug, unique: true

    # Backfill slugs from name
    Product.reset_column_information
    Product.find_each do |p|
      base = p.name.parameterize.presence || "product"
      slug = base
      n = 0
      while Product.where(slug: slug).where.not(id: p.id).exists?
        n += 1
        slug = "#{base}-#{n}"
      end
      p.update_column(:slug, slug)
    end

    change_column_null :products, :slug, false
  end

  def down
    remove_index :products, :slug
    remove_column :products, :slug
  end
end
