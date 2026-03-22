# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_09_100002) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.datetime "updated_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "idx_on_blob_id_variation_digest_f36bede0d9", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.string "category_type", limit: 20, default: "journal", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.text "meta_description"
    t.string "meta_title", limit: 255
    t.string "name", null: false
    t.bigint "parent_category_id"
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.string "visibility", limit: 20, default: "public", null: false
    t.index ["active"], name: "index_categories_on_active"
    t.index ["category_type"], name: "index_categories_on_category_type"
    t.index ["parent_category_id"], name: "index_categories_on_parent_category_id"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "classification_values", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.bigint "classification_id", null: false
    t.datetime "created_at", null: false
    t.string "hex_code", limit: 20
    t.integer "sort_order", default: 0, null: false
    t.datetime "updated_at", null: false
    t.string "value", limit: 500, null: false
    t.index ["classification_id", "value"], name: "index_classification_values_on_classification_id_and_value", unique: true
    t.index ["classification_id"], name: "index_classification_values_on_classification_id"
  end

  create_table "classifications", force: :cascade do |t|
    t.string "code", limit: 255, null: false
    t.datetime "created_at", null: false
    t.string "name", limit: 255, null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_classifications_on_code", unique: true
  end

  create_table "collections", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.text "meta_description"
    t.string "meta_title", limit: 255
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_collections_on_slug", unique: true
  end

  create_table "contact_messages", comment: "Contact messages", force: :cascade do |t|
    t.datetime "created_at", null: false, comment: "Timestamps"
    t.string "email", null: false, comment: "Email"
    t.text "message", null: false, comment: "Message"
    t.string "name", null: false, comment: "Name"
    t.string "subject", null: false, comment: "Subject"
    t.datetime "updated_at", null: false, comment: "Timestamps"
  end

  create_table "newsletter_subscribers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_newsletter_subscribers_on_email", unique: true
  end

  create_table "occasion_products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "occasion_id", null: false
    t.bigint "product_id", null: false
    t.datetime "updated_at", null: false
    t.index ["occasion_id", "product_id"], name: "index_occasion_products_on_occasion_id_and_product_id", unique: true
    t.index ["occasion_id"], name: "index_occasion_products_on_occasion_id"
    t.index ["product_id"], name: "index_occasion_products_on_product_id"
  end

  create_table "occasions", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.text "meta_description"
    t.string "meta_title", limit: 255
    t.string "name", null: false
    t.string "slug", limit: 255, null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_occasions_on_slug", unique: true
  end

  create_table "order_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", default: 1, null: false
    t.decimal "unit_price", precision: 10, scale: 2, null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "order_statuses", force: :cascade do |t|
    t.string "code", limit: 50, null: false
    t.datetime "created_at", null: false
    t.boolean "is_final", default: false, null: false
    t.string "name", limit: 100, null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_order_statuses_on_code", unique: true
  end

  create_table "orders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "customer_name"
    t.string "email", null: false
    t.bigint "order_status_id", null: false
    t.string "shipping_address"
    t.decimal "total", precision: 10, scale: 2, default: "0.0", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_orders_on_created_at"
    t.index ["email"], name: "index_orders_on_email"
    t.index ["order_status_id"], name: "index_orders_on_order_status_id"
  end

  create_table "post_products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "post_id", null: false
    t.bigint "product_id", null: false
    t.integer "sort_order", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["post_id", "product_id"], name: "index_post_products_on_post_id_and_product_id", unique: true
    t.index ["post_id"], name: "index_post_products_on_post_id"
    t.index ["product_id"], name: "index_post_products_on_product_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.boolean "featured", default: false, null: false
    t.text "meta_description"
    t.string "meta_title", limit: 255
    t.datetime "published_at"
    t.jsonb "puck_data", default: {}, null: false
    t.integer "reading_time", default: 0
    t.string "slug", null: false
    t.string "status", limit: 20, default: "draft", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "word_count", default: 0
    t.index ["author_id"], name: "index_posts_on_author_id"
    t.index ["category_id"], name: "index_posts_on_category_id"
    t.index ["featured"], name: "index_posts_on_featured"
    t.index ["published_at"], name: "index_posts_on_published_at"
    t.index ["slug"], name: "index_posts_on_slug", unique: true
    t.index ["status"], name: "index_posts_on_status"
  end

  create_table "products", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.bigint "collection_id", null: false
    t.string "collection_type"
    t.datetime "created_at", null: false
    t.text "description"
    t.boolean "gift_wrapping_included", default: true, null: false
    t.boolean "include_scent_refill", default: false, null: false
    t.text "meta_description"
    t.string "meta_title", limit: 255
    t.string "name", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.bigint "primary_fragrance_option_id"
    t.bigint "ribbon_color_id"
    t.bigint "ribbon_material_id"
    t.string "scent_intensity", limit: 50, default: "moderate"
    t.string "silk_material_type", limit: 255
    t.string "sku", limit: 100
    t.string "slug", limit: 255, null: false
    t.string "stock_status", limit: 50, default: "in_stock"
    t.datetime "updated_at", null: false
    t.bigint "vase_option_id"
    t.index ["active"], name: "index_products_on_active"
    t.index ["collection_id"], name: "index_products_on_collection_id"
    t.index ["name"], name: "index_products_on_name"
    t.index ["primary_fragrance_option_id"], name: "index_products_on_primary_fragrance_option_id"
    t.index ["ribbon_color_id"], name: "index_products_on_ribbon_color_id"
    t.index ["ribbon_material_id"], name: "index_products_on_ribbon_material_id"
    t.index ["sku"], name: "index_products_on_sku", unique: true
    t.index ["slug"], name: "index_products_on_slug", unique: true
    t.index ["vase_option_id"], name: "index_products_on_vase_option_id"
  end

  create_table "store_settings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "key", null: false
    t.datetime "updated_at", null: false
    t.text "value"
    t.index ["key"], name: "index_store_settings_on_key", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "confirmation_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "full_name", default: "", null: false
    t.string "jti", default: -> { "gen_random_uuid()" }, null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.string "unconfirmed_email"
    t.datetime "updated_at", null: false
    t.string "verification_code", limit: 6
    t.datetime "verification_code_sent_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "categories", "categories", column: "parent_category_id"
  add_foreign_key "classification_values", "classifications"
  add_foreign_key "occasion_products", "occasions"
  add_foreign_key "occasion_products", "products"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "order_statuses"
  add_foreign_key "post_products", "posts"
  add_foreign_key "post_products", "products"
  add_foreign_key "posts", "categories"
  add_foreign_key "posts", "users", column: "author_id"
  add_foreign_key "products", "classification_values", column: "primary_fragrance_option_id"
  add_foreign_key "products", "classification_values", column: "ribbon_color_id"
  add_foreign_key "products", "classification_values", column: "ribbon_material_id"
  add_foreign_key "products", "classification_values", column: "vase_option_id"
  add_foreign_key "products", "collections"
end
