# frozen_string_literal: true

class CreatePostProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :post_products do |t|
      t.references :post, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :sort_order, default: 0, null: false
      t.timestamps
    end

    add_index :post_products, [:post_id, :product_id], unique: true
  end
end
