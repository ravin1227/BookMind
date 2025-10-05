class AddContentFilePathToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :content_file_path, :string
  end
end
