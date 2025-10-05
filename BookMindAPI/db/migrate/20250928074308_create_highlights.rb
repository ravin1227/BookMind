class CreateHighlights < ActiveRecord::Migration[8.0]
  def change
    create_table :highlights do |t|
      t.references :book, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :uuid, null: false, limit: 36
      t.integer :start_position, null: false
      t.integer :end_position, null: false
      t.text :highlighted_text, null: false
      t.string :color, default: 'yellow', limit: 20
      t.text :note
      t.integer :page_number
      t.boolean :is_favorite, default: false

      t.timestamps
    end

    add_index :highlights, :uuid, unique: true
    add_index :highlights, [:book_id, :user_id]
    add_index :highlights, :is_favorite
  end
end
