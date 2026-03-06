# frozen_string_literal: true

class CreateClassifications < ActiveRecord::Migration[8.1]
  def change
    create_table :classifications do |t|
      t.string :code, null: false, limit: 255
      t.string :name, null: false, limit: 255

      t.timestamps
    end

    add_index :classifications, :code, unique: true
  end
end
