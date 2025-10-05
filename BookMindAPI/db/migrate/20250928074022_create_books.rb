class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.references :user, null: false, foreign_key: true
      t.string :uuid, null: false, limit: 36
      t.string :title, null: false, limit: 500
      t.string :author, limit: 255
      t.string :isbn, limit: 20
      t.string :file_path, null: false, limit: 1000
      t.string :file_type, null: false, limit: 10
      t.bigint :file_size, null: false
      t.text :content_text
      t.string :processing_status, default: 'pending', limit: 20
      t.json :metadata
      t.datetime :uploaded_at, null: false
      t.datetime :processed_at

      t.timestamps
    end

    add_index :books, :uuid, unique: true
    add_index :books, :processing_status
    add_index :books, :file_type
  end
end
