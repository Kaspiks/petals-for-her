# frozen_string_literal: true

class AddProductClassificationFields < ActiveRecord::Migration[8.1]
  def change
    add_reference :products, :vase_option, foreign_key: { to_table: :classification_values }
    add_reference :products, :ribbon_material, foreign_key: { to_table: :classification_values }
    add_reference :products, :ribbon_color, foreign_key: { to_table: :classification_values }
    add_reference :products, :primary_fragrance_option, foreign_key: { to_table: :classification_values }
    add_column :products, :sku, :string, limit: 100
    add_column :products, :scent_intensity, :string, limit: 50, default: "moderate"
    add_column :products, :include_scent_refill, :boolean, default: false, null: false
    add_column :products, :silk_material_type, :string, limit: 255
    add_column :products, :gift_wrapping_included, :boolean, default: true, null: false
    add_column :products, :stock_status, :string, limit: 50, default: "in_stock"

    add_index :products, :sku, unique: true
  end
end
