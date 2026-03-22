# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :category_type, limit: 20, null: false, default: "journal"
      t.text :description
      t.references :parent_category, foreign_key: { to_table: :categories }, null: true
      t.boolean :active, null: false, default: true
      t.string :visibility, limit: 20, null: false, default: "public"
      t.string :meta_title, limit: 255
      t.text :meta_description
      t.timestamps
    end

    add_index :categories, :slug, unique: true
    add_index :categories, :category_type
    add_index :categories, :active
  end
end
