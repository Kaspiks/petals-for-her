# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.jsonb :puck_data, null: false, default: {}
      t.string :status, limit: 20, null: false, default: "draft"
      t.boolean :featured, null: false, default: false
      t.datetime :published_at
      t.integer :word_count, default: 0
      t.integer :reading_time, default: 0
      t.string :meta_title, limit: 255
      t.text :meta_description
      t.references :category, foreign_key: true, null: true
      t.references :author, foreign_key: { to_table: :users }, null: false
      t.timestamps
    end

    add_index :posts, :slug, unique: true
    add_index :posts, :status
    add_index :posts, :featured
    add_index :posts, :published_at
  end
end
