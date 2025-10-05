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

ActiveRecord::Schema[8.0].define(version: 2025_09_29_125126) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "books", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "uuid", limit: 36, null: false
    t.string "title", limit: 500, null: false
    t.string "author", limit: 255
    t.string "isbn", limit: 20
    t.string "file_path", limit: 1000, null: false
    t.string "file_type", limit: 10, null: false
    t.bigint "file_size", null: false
    t.text "content_text"
    t.string "processing_status", limit: 20, default: "pending"
    t.json "metadata"
    t.datetime "uploaded_at", null: false
    t.datetime "processed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "error_message"
    t.string "content_file_path"
    t.index ["file_type"], name: "index_books_on_file_type"
    t.index ["processing_status"], name: "index_books_on_processing_status"
    t.index ["user_id"], name: "index_books_on_user_id"
    t.index ["uuid"], name: "index_books_on_uuid", unique: true
  end

  create_table "highlights", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.bigint "user_id", null: false
    t.string "uuid", limit: 36, null: false
    t.integer "start_position", null: false
    t.integer "end_position", null: false
    t.text "highlighted_text", null: false
    t.string "color", limit: 20, default: "yellow"
    t.text "note"
    t.integer "page_number"
    t.boolean "is_favorite", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id", "user_id"], name: "index_highlights_on_book_id_and_user_id"
    t.index ["book_id"], name: "index_highlights_on_book_id"
    t.index ["is_favorite"], name: "index_highlights_on_is_favorite"
    t.index ["user_id"], name: "index_highlights_on_user_id"
    t.index ["uuid"], name: "index_highlights_on_uuid", unique: true
  end

  create_table "reading_progresses", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.bigint "user_id", null: false
    t.integer "current_page", default: 1
    t.integer "total_pages"
    t.decimal "progress_percentage", precision: 5, scale: 2, default: "0.0"
    t.string "current_chapter"
    t.integer "reading_position"
    t.decimal "reading_speed", precision: 6, scale: 2
    t.datetime "last_read_at"
    t.datetime "started_reading_at"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_id", "user_id"], name: "index_reading_progresses_on_book_id_and_user_id", unique: true
    t.index ["book_id"], name: "index_reading_progresses_on_book_id"
    t.index ["last_read_at"], name: "index_reading_progresses_on_last_read_at"
    t.index ["user_id"], name: "index_reading_progresses_on_user_id"
  end

  create_table "user_devices", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "device_token", limit: 500, null: false
    t.string "device_type", limit: 20, null: false
    t.string "device_name", limit: 100
    t.boolean "active", default: true
    t.datetime "last_used_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_user_devices_on_active"
    t.index ["device_token"], name: "index_user_devices_on_device_token"
    t.index ["user_id", "device_token"], name: "index_user_devices_on_user_id_and_device_token", unique: true
    t.index ["user_id"], name: "index_user_devices_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "uuid", limit: 36, null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.boolean "email_verified", default: false
    t.datetime "last_login_at"
    t.string "account_status", limit: 20, default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_status"], name: "index_users_on_account_status"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["uuid"], name: "index_users_on_uuid", unique: true
  end

  add_foreign_key "books", "users"
  add_foreign_key "highlights", "books"
  add_foreign_key "highlights", "users"
  add_foreign_key "reading_progresses", "books"
  add_foreign_key "reading_progresses", "users"
  add_foreign_key "user_devices", "users"
end
