# frozen_string_literal: true

class CreateOrderStatuses < ActiveRecord::Migration[8.0]
  def change
    create_table :order_statuses do |t|
      t.string :code, null: false, limit: 50
      t.string :name, null: false, limit: 100
      t.boolean :is_final, default: false, null: false

      t.timestamps
    end

    add_index :order_statuses, :code, unique: true
  end
end
