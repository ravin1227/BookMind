class CreateReadingProgress < ActiveRecord::Migration[8.0]
  def change
    create_table :reading_progresses do |t|
      t.references :book, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :current_page, default: 1
      t.integer :total_pages
      t.decimal :progress_percentage, precision: 5, scale: 2, default: 0.0
      t.string :current_chapter
      t.integer :reading_position
      t.decimal :reading_speed, precision: 6, scale: 2
      t.datetime :last_read_at
      t.datetime :started_reading_at
      t.datetime :completed_at

      t.timestamps
    end

    add_index :reading_progresses, [:book_id, :user_id], unique: true
    add_index :reading_progresses, :last_read_at
  end
end
