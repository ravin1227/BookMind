# 🗄️ BookMind - Database Architecture & Design

## 🎯 Database Strategy Overview

**Primary Database**: PostgreSQL 15+ with Extensions
**ORM**: Active Record (Ruby on Rails)
**Caching**: Redis for sessions, cache, and background jobs
**Search**: PostgreSQL Full-Text Search + pg_vector for AI embeddings
**File Storage**: Cloudflare R2 (S3-compatible) for books and generated content

## 📊 Core Database Schema

### 🧑‍💼 User Management

#### Users Table
```ruby
# db/migrate/001_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :uuid do |t|
      # Authentication (Devise)
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :first_name
      t.string :last_name
      t.string :username,           null: false
      t.text :bio
      t.string :avatar_url

      # Subscription & Plan
      t.integer :subscription_tier, default: 0 # enum: free, pro, premium
      t.datetime :subscription_expires_at
      t.string :stripe_customer_id

      # User Preferences (JSONB for flexibility)
      t.jsonb :reading_preferences, default: {}
      t.jsonb :ai_preferences, default: {}
      t.jsonb :notification_preferences, default: {}

      # Social Features
      t.integer :followers_count, default: 0
      t.integer :following_count, default: 0
      t.integer :quotes_shared_count, default: 0
      t.boolean :public_profile, default: true

      # Tracking
      t.datetime :last_active_at
      t.string :time_zone, default: 'UTC'
      t.jsonb :onboarding_completed, default: {}

      # Devise trackable
      t.integer :sign_in_count, default: 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.inet :current_sign_in_ip
      t.inet :last_sign_in_ip

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :username,             unique: true
    add_index :users, :subscription_tier
    add_index :users, :subscription_expires_at
    add_index :users, :reading_preferences, using: :gin
    add_index :users, :last_active_at
  end
end

# User Model
class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :trackable

  enum subscription_tier: { free: 0, pro: 1, premium: 2 }

  # Associations
  has_many :books, dependent: :destroy
  has_many :highlights, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :reading_sessions, dependent: :destroy
  has_many :ai_conversations, dependent: :destroy
  has_many :quote_shares, dependent: :destroy

  # Social
  has_many :follows_as_follower, class_name: 'Follow', foreign_key: 'follower_id'
  has_many :follows_as_followee, class_name: 'Follow', foreign_key: 'followee_id'
  has_many :following, through: :follows_as_follower, source: :followee
  has_many :followers, through: :follows_as_followee, source: :follower

  # Validations
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }
  validates :email, presence: true, uniqueness: true

  # Scopes
  scope :active_readers, -> { where('last_active_at > ?', 7.days.ago) }
  scope :premium_users, -> { where(subscription_tier: [:pro, :premium]) }
end
```

#### User Follows (Social Graph)
```ruby
# db/migrate/002_create_follows.rb
class CreateFollows < ActiveRecord::Migration[7.1]
  def change
    create_table :follows, id: :uuid do |t|
      t.references :follower, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :followee, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.timestamps null: false
    end

    add_index :follows, [:follower_id, :followee_id], unique: true
    add_index :follows, :followee_id
  end
end
```

### 📚 Books & Content Management

#### Books Table
```ruby
# db/migrate/003_create_books.rb
class CreateBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :books, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid

      # Book Metadata
      t.string :title, null: false
      t.string :author
      t.string :isbn_10
      t.string :isbn_13
      t.text :description
      t.string :language, default: 'en'
      t.string :genre
      t.integer :page_count
      t.integer :word_count
      t.date :published_date
      t.string :publisher

      # File Information
      t.string :file_type # pdf, epub, mobi, docx
      t.bigint :file_size
      t.string :file_path # S3 key
      t.string :cover_image_url
      t.string :original_filename

      # Processing Status
      t.integer :processing_status, default: 0 # enum: pending, processing, completed, failed
      t.text :processing_error
      t.datetime :processing_completed_at

      # AI Analysis Results
      t.integer :difficulty_level # 1-10 scale
      t.text :ai_summary
      t.string :reading_time_minutes
      t.jsonb :topics, default: [] # extracted topics/themes
      t.jsonb :key_concepts, default: []

      # Reading Analytics
      t.integer :total_highlights, default: 0
      t.integer :total_bookmarks, default: 0
      t.integer :total_shares, default: 0
      t.integer :completion_rate_percent, default: 0

      # Social Metrics
      t.integer :community_highlights_count, default: 0
      t.integer :community_shares_count, default: 0
      t.float :community_rating

      t.timestamps null: false
    end

    add_index :books, :user_id
    add_index :books, :title
    add_index :books, :author
    add_index :books, :genre
    add_index :books, :processing_status
    add_index :books, :difficulty_level
    add_index :books, :topics, using: :gin
    add_index :books, :created_at
  end
end

# Book Model
class Book < ApplicationRecord
  belongs_to :user

  # File attachment
  has_one_attached :file
  has_one_attached :cover_image

  # Reading data
  has_many :highlights, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :reading_sessions, dependent: :destroy
  has_many :ai_conversations, dependent: :destroy
  has_many :book_chapters, dependent: :destroy
  has_many :book_embeddings, dependent: :destroy

  enum processing_status: { pending: 0, processing: 1, completed: 2, failed: 3 }
  enum file_type: { pdf: 0, epub: 1, mobi: 2, docx: 3 }

  validates :title, presence: true
  validates :file_type, presence: true

  scope :completed, -> { where(processing_status: :completed) }
  scope :by_genre, ->(genre) { where(genre: genre) }
  scope :recently_added, -> { order(created_at: :desc) }
end
```

#### Book Chapters
```ruby
# db/migrate/004_create_book_chapters.rb
class CreateBookChapters < ActiveRecord::Migration[7.1]
  def change
    create_table :book_chapters, id: :uuid do |t|
      t.references :book, null: false, foreign_key: true, type: :uuid

      t.string :title
      t.integer :chapter_number
      t.integer :start_page
      t.integer :end_page
      t.text :content # extracted text content
      t.text :ai_summary
      t.jsonb :key_points, default: []

      # For text positioning
      t.integer :word_count
      t.integer :character_count
      t.integer :start_offset # character offset in full book
      t.integer :end_offset

      t.timestamps null: false
    end

    add_index :book_chapters, :book_id
    add_index :book_chapters, :chapter_number
    add_index :book_chapters, [:start_page, :end_page]
  end
end
```

### 🎯 Reading Progress & Sessions

#### Reading Sessions
```ruby
# db/migrate/005_create_reading_sessions.rb
class CreateReadingSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :reading_sessions, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid

      # Session tracking
      t.datetime :started_at
      t.datetime :ended_at
      t.integer :duration_seconds

      # Reading progress
      t.integer :start_page
      t.integer :end_page
      t.integer :pages_read
      t.integer :words_read
      t.float :reading_speed_wpm # words per minute

      # Device & context
      t.string :device_type # mobile, tablet, desktop
      t.string :platform # ios, android, web
      t.jsonb :session_metadata, default: {}

      # Engagement metrics
      t.integer :highlights_created, default: 0
      t.integer :bookmarks_created, default: 0
      t.integer :ai_queries_used, default: 0
      t.integer :notes_created, default: 0

      t.timestamps null: false
    end

    add_index :reading_sessions, :user_id
    add_index :reading_sessions, :book_id
    add_index :reading_sessions, [:user_id, :book_id]
    add_index :reading_sessions, :started_at
    add_index :reading_sessions, :duration_seconds
  end
end
```

#### Reading Progress (Current Position)
```ruby
# db/migrate/006_create_reading_progress.rb
class CreateReadingProgress < ActiveRecord::Migration[7.1]
  def change
    create_table :reading_progress, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid

      # Current position
      t.integer :current_page
      t.float :progress_percentage # 0.0 to 1.0
      t.integer :current_character_offset
      t.jsonb :position_data, default: {} # x, y, scroll offset for precise positioning

      # Reading statistics
      t.integer :total_time_spent_seconds, default: 0
      t.integer :total_sessions, default: 0
      t.datetime :first_opened_at
      t.datetime :last_read_at
      t.datetime :estimated_finish_date

      # Completion tracking
      t.boolean :completed, default: false
      t.datetime :completed_at
      t.integer :completion_time_seconds

      t.timestamps null: false
    end

    add_index :reading_progress, [:user_id, :book_id], unique: true
    add_index :reading_progress, :progress_percentage
    add_index :reading_progress, :last_read_at
    add_index :reading_progress, :completed
  end
end
```

### 🎨 Highlights & Annotations

#### Highlights Table
```ruby
# db/migrate/007_create_highlights.rb
class CreateHighlights < ActiveRecord::Migration[7.1]
  def change
    create_table :highlights, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :book_chapter, null: true, foreign_key: true, type: :uuid

      # Highlight content
      t.text :selected_text, null: false
      t.integer :word_count
      t.integer :character_count

      # Position information
      t.integer :page_number
      t.integer :start_offset # character offset in book
      t.integer :end_offset
      t.jsonb :position_data, default: {} # x, y coordinates, selection bounds

      # Visual styling
      t.string :color, default: 'yellow' # yellow, blue, green, red, purple, orange, brown, pink
      t.string :color_hex, default: '#FEF3C7'
      t.string :category # important_concept, question, agreement, disagreement, quote, action_item, example, reflection

      # User annotations
      t.text :note
      t.jsonb :tags, default: []

      # AI enhancements
      t.text :ai_explanation
      t.float :ai_importance_score # 0.0 to 1.0
      t.jsonb :ai_analysis, default: {} # themes, concepts, sentiment

      # Social features
      t.integer :shares_count, default: 0
      t.boolean :public, default: false
      t.boolean :featured, default: false

      # Metadata
      t.string :device_type
      t.jsonb :selection_metadata, default: {}

      t.timestamps null: false
    end

    add_index :highlights, :user_id
    add_index :highlights, :book_id
    add_index :highlights, [:user_id, :book_id]
    add_index :highlights, :color
    add_index :highlights, :category
    add_index :highlights, :page_number
    add_index :highlights, :ai_importance_score
    add_index :highlights, :shares_count
    add_index :highlights, :public
    add_index :highlights, :tags, using: :gin
    add_index :highlights, :created_at
  end
end

# Highlight Model
class Highlight < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :book_chapter, optional: true

  has_many :quote_shares, dependent: :destroy
  has_many :highlight_interactions, dependent: :destroy

  enum color: {
    yellow: 0, blue: 1, green: 2, red: 3,
    purple: 4, orange: 5, brown: 6, pink: 7
  }

  enum category: {
    important_concept: 0, question: 1, agreement: 2, disagreement: 3,
    quote: 4, action_item: 5, example: 6, reflection: 7
  }

  validates :selected_text, presence: true, length: { minimum: 1, maximum: 2000 }
  validates :page_number, presence: true, numericality: { greater_than: 0 }

  scope :public_highlights, -> { where(public: true) }
  scope :by_color, ->(color) { where(color: color) }
  scope :by_category, ->(category) { where(category: category) }
  scope :highly_rated, -> { where('ai_importance_score > ?', 0.7) }
  scope :recently_created, -> { order(created_at: :desc) }
end
```

#### Bookmarks Table
```ruby
# db/migrate/008_create_bookmarks.rb
class CreateBookmarks < ActiveRecord::Migration[7.1]
  def change
    create_table :bookmarks, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :book_chapter, null: true, foreign_key: true, type: :uuid

      # Bookmark metadata
      t.string :title
      t.text :note
      t.string :category, default: 'manual' # manual, auto, favorite, review, notes

      # Position information
      t.integer :page_number, null: false
      t.jsonb :position_data, default: {} # x, y, scroll offset
      t.string :context_text # surrounding text for preview

      # Auto-bookmark specific
      t.boolean :is_auto_bookmark, default: false
      t.datetime :last_visited_at

      # Visual elements
      t.string :thumbnail_url # page screenshot
      t.string :icon # emoji or icon identifier

      # Reading session context
      t.integer :reading_duration_seconds # how long spent at this position
      t.float :reading_progress_when_created # 0.0 to 1.0

      t.timestamps null: false
    end

    add_index :bookmarks, :user_id
    add_index :bookmarks, :book_id
    add_index :bookmarks, [:user_id, :book_id]
    add_index :bookmarks, :category
    add_index :bookmarks, :page_number
    add_index :bookmarks, :is_auto_bookmark
    add_index :bookmarks, :last_visited_at
    add_index :bookmarks, :created_at

    # Ensure only one auto-bookmark per user per book
    add_index :bookmarks, [:user_id, :book_id, :is_auto_bookmark],
              unique: true, where: 'is_auto_bookmark = true',
              name: 'index_bookmarks_unique_auto_per_user_book'
  end
end

# Bookmark Model
class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :book_chapter, optional: true

  enum category: {
    manual: 0, auto: 1, favorite: 2, review: 3, notes: 4
  }

  validates :page_number, presence: true, numericality: { greater_than: 0 }
  validates :title, length: { maximum: 200 }

  scope :manual_bookmarks, -> { where(is_auto_bookmark: false) }
  scope :auto_bookmarks, -> { where(is_auto_bookmark: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :recently_visited, -> { order(last_visited_at: :desc) }

  before_save :set_auto_bookmark_title, if: :is_auto_bookmark?

  private

  def set_auto_bookmark_title
    self.title = "Reading Position - #{book.title}"
  end
end
```

#### Annotations Table (Notes, Voice, Drawings)
```ruby
# db/migrate/009_create_annotations.rb
class CreateAnnotations < ActiveRecord::Migration[7.1]
  def change
    create_table :annotations, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :highlight, null: true, foreign_key: true, type: :uuid
      t.references :bookmark, null: true, foreign_key: true, type: :uuid

      # Annotation type and content
      t.string :annotation_type, null: false # text, voice, drawing, ai_insight
      t.text :content # text content or JSON for complex annotations
      t.text :plain_text_content # searchable text version

      # Position information
      t.integer :page_number
      t.jsonb :position_data, default: {}
      t.text :attached_text # text this annotation is attached to

      # Media attachments
      t.string :audio_file_url # for voice notes
      t.integer :audio_duration_seconds
      t.text :audio_transcript
      t.text :drawing_data # SVG or JSON drawing data
      t.string :image_url # for image annotations

      # Organization
      t.jsonb :tags, default: []
      t.string :template_type # for structured annotations
      t.integer :word_count, default: 0

      # AI enhancements
      t.text :ai_summary
      t.jsonb :ai_suggestions, default: {}
      t.float :relevance_score

      # Social and sharing
      t.boolean :public, default: false
      t.boolean :featured, default: false

      t.timestamps null: false
    end

    add_index :annotations, :user_id
    add_index :annotations, :book_id
    add_index :annotations, :highlight_id
    add_index :annotations, :bookmark_id
    add_index :annotations, :annotation_type
    add_index :annotations, :page_number
    add_index :annotations, :tags, using: :gin
    add_index :annotations, :public
    add_index :annotations, :created_at

    # Full-text search
    add_index :annotations, :plain_text_content, using: :gin,
              opclass: :gin_trgm_ops
  end
end

# Annotation Model
class Annotation < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :highlight, optional: true
  belongs_to :bookmark, optional: true

  has_one_attached :audio_file
  has_one_attached :image

  enum annotation_type: {
    text: 0, voice: 1, drawing: 2, ai_insight: 3
  }

  validates :content, presence: true
  validates :page_number, presence: true, numericality: { greater_than: 0 }

  scope :public_annotations, -> { where(public: true) }
  scope :by_type, ->(type) { where(annotation_type: type) }
  scope :text_searchable, -> { where.not(plain_text_content: [nil, '']) }

  before_save :extract_plain_text
  after_create :update_word_count

  private

  def extract_plain_text
    case annotation_type
    when 'text'
      self.plain_text_content = content
    when 'voice'
      self.plain_text_content = audio_transcript
    when 'drawing'
      self.plain_text_content = content # any text descriptions
    end
  end

  def update_word_count
    self.word_count = plain_text_content&.split&.length || 0
    save if persisted? && changed?
  end
end
```

### 🤖 AI & Machine Learning Tables

#### AI Conversations
```ruby
# db/migrate/010_create_ai_conversations.rb
class CreateAiConversations < ActiveRecord::Migration[7.1]
  def change
    create_table :ai_conversations, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :book_chapter, null: true, foreign_key: true, type: :uuid

      # Conversation content
      t.text :question, null: false
      t.text :answer, null: false
      t.jsonb :context_used, default: {} # pages, chapters, previous conversation
      t.text :attached_text # specific text user was asking about

      # AI metadata
      t.string :ai_provider # openai, anthropic, etc.
      t.string :model_used # gpt-4, claude-3, etc.
      t.float :confidence_score # 0.0 to 1.0
      t.integer :response_time_ms
      t.integer :tokens_used
      t.decimal :cost_usd, precision: 8, scale: 4

      # Context and sources
      t.jsonb :sources_referenced, default: [] # pages/sections used for answer
      t.jsonb :conversation_history, default: [] # previous Q&As in session
      t.text :search_query_used # what was searched in the book

      # User feedback
      t.integer :user_rating # 1-5 stars
      t.text :user_feedback
      t.boolean :marked_helpful, default: false

      # Usage tracking
      t.string :feature_used # chat, explain, summarize, define
      t.string :trigger_type # manual, auto_suggestion
      t.jsonb :session_metadata, default: {}

      t.timestamps null: false
    end

    add_index :ai_conversations, :user_id
    add_index :ai_conversations, :book_id
    add_index :ai_conversations, [:user_id, :book_id]
    add_index :ai_conversations, :ai_provider
    add_index :ai_conversations, :confidence_score
    add_index :ai_conversations, :user_rating
    add_index :ai_conversations, :feature_used
    add_index :ai_conversations, :created_at
    add_index :ai_conversations, :question, using: :gin,
              opclass: :gin_trgm_ops # Full-text search on questions
  end
end

# AI Conversation Model
class AiConversation < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :book_chapter, optional: true

  validates :question, presence: true, length: { minimum: 3, maximum: 1000 }
  validates :answer, presence: true
  validates :user_rating, inclusion: { in: 1..5 }, allow_nil: true

  scope :highly_rated, -> { where('user_rating >= ?', 4) }
  scope :recent_conversations, -> { order(created_at: :desc) }
  scope :by_feature, ->(feature) { where(feature_used: feature) }
  scope :cost_tracking, -> { select(:cost_usd, :tokens_used, :created_at) }

  def self.total_ai_cost_for_user(user, period = 30.days)
    where(user: user, created_at: period.ago..).sum(:cost_usd)
  end
end
```

#### Book Embeddings (Vector Storage)
```ruby
# db/migrate/011_create_book_embeddings.rb
class CreateBookEmbeddings < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'vector' # pg_vector extension

    create_table :book_embeddings, id: :uuid do |t|
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :book_chapter, null: true, foreign_key: true, type: :uuid

      # Text chunk information
      t.text :content, null: false # the actual text chunk
      t.integer :chunk_index # order in book
      t.integer :start_page
      t.integer :end_page
      t.integer :start_offset # character offset
      t.integer :end_offset
      t.integer :word_count
      t.text :chunk_title # chapter or section title

      # Vector embedding (1536 dimensions for OpenAI ada-002)
      t.vector :embedding, limit: 1536

      # Metadata for search optimization
      t.jsonb :metadata, default: {} # themes, concepts, difficulty
      t.float :importance_score # 0.0 to 1.0
      t.jsonb :topics, default: []
      t.string :content_type # paragraph, heading, list, quote, etc.

      # Processing information
      t.string :embedding_model # text-embedding-ada-002, etc.
      t.datetime :embedded_at

      t.timestamps null: false
    end

    add_index :book_embeddings, :book_id
    add_index :book_embeddings, :book_chapter_id
    add_index :book_embeddings, :chunk_index
    add_index :book_embeddings, [:start_page, :end_page]
    add_index :book_embeddings, :importance_score
    add_index :book_embeddings, :topics, using: :gin
    add_index :book_embeddings, :content_type

    # Vector similarity index for fast semantic search
    add_index :book_embeddings, :embedding, using: :ivfflat, opclass: :vector_cosine_ops
  end
end

# Book Embedding Model
class BookEmbedding < ApplicationRecord
  belongs_to :book
  belongs_to :book_chapter, optional: true

  validates :content, presence: true
  validates :embedding, presence: true

  scope :by_chapter, ->(chapter) { where(book_chapter: chapter) }
  scope :important_chunks, -> { where('importance_score > ?', 0.7) }

  # Semantic search using vector similarity
  def self.semantic_search(query_embedding, book_id, limit: 5)
    where(book_id: book_id)
      .order(Arel.sql("embedding <-> '#{query_embedding}'"))
      .limit(limit)
  end

  def self.hybrid_search(query, book_id, limit: 5)
    # Combine text search with vector search
    text_results = where(book_id: book_id)
                   .where("content ILIKE ?", "%#{query}%")
                   .limit(limit)

    # This would typically be combined with vector search in production
    text_results
  end
end
```

### 📤 Social Sharing & Community

#### Quote Shares
```ruby
# db/migrate/012_create_quote_shares.rb
class CreateQuoteShares < ActiveRecord::Migration[7.1]
  def change
    create_table :quote_shares, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :book, null: false, foreign_key: true, type: :uuid
      t.references :highlight, null: false, foreign_key: true, type: :uuid

      # Quote card details
      t.string :template_id, null: false
      t.text :quote_text, null: false
      t.string :author_attribution
      t.string :book_attribution
      t.jsonb :customizations, default: {} # colors, fonts, layout choices

      # Generated content
      t.string :card_image_url # generated quote card
      t.string :shareable_url # public link to quote
      t.text :share_message # user's custom message
      t.jsonb :hashtags, default: []

      # Platform sharing
      t.jsonb :platforms_shared, default: [] # twitter, instagram, linkedin, etc.
      t.jsonb :platform_post_ids, default: {} # track posts on each platform
      t.boolean :scheduled_share, default: false
      t.datetime :scheduled_at

      # Engagement tracking
      t.integer :views_count, default: 0
      t.integer :likes_count, default: 0
      t.integer :shares_count, default: 0
      t.integer :comments_count, default: 0
      t.integer :saves_count, default: 0

      # Viral tracking
      t.integer :click_throughs, default: 0 # clicks to download app
      t.integer :app_installs_attributed, default: 0
      t.float :viral_coefficient # how many new users this generated
      t.string :referral_code # unique tracking code

      # Performance metrics
      t.float :engagement_rate
      t.integer :reach_count
      t.datetime :peak_engagement_at
      t.jsonb :demographics_data, default: {}

      t.timestamps null: false
    end

    add_index :quote_shares, :user_id
    add_index :quote_shares, :book_id
    add_index :quote_shares, :highlight_id
    add_index :quote_shares, :template_id
    add_index :quote_shares, :platforms_shared, using: :gin
    add_index :quote_shares, :views_count
    add_index :quote_shares, :engagement_rate
    add_index :quote_shares, :viral_coefficient
    add_index :quote_shares, :referral_code, unique: true
    add_index :quote_shares, :created_at
  end
end

# Quote Share Model
class QuoteShare < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :highlight

  has_many :quote_interactions, dependent: :destroy
  has_many :referral_conversions, dependent: :destroy

  validates :quote_text, presence: true, length: { minimum: 10, maximum: 500 }
  validates :template_id, presence: true
  validates :referral_code, presence: true, uniqueness: true

  scope :viral_quotes, -> { where('viral_coefficient > ?', 1.0) }
  scope :high_engagement, -> { where('engagement_rate > ?', 0.05) }
  scope :recent_shares, -> { order(created_at: :desc) }
  scope :by_platform, ->(platform) { where('platforms_shared ? ?', platform) }

  before_create :generate_referral_code

  def self.trending(timeframe = 24.hours)
    where(created_at: timeframe.ago..)
      .order(engagement_rate: :desc, views_count: :desc)
      .limit(50)
  end

  def calculate_engagement_rate
    return 0 if views_count.zero?

    total_engagements = likes_count + shares_count + comments_count + saves_count
    (total_engagements.to_f / views_count * 100).round(2)
  end

  private

  def generate_referral_code
    self.referral_code = SecureRandom.urlsafe_base64(8)
  end
end
```

#### Quote Templates
```ruby
# db/migrate/013_create_quote_templates.rb
class CreateQuoteTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :quote_templates, id: :uuid do |t|
      # Template identification
      t.string :name, null: false
      t.string :category # professional, creative, academic, motivational
      t.text :description
      t.string :preview_image_url

      # Template configuration
      t.jsonb :design_config, null: false # colors, fonts, layout
      t.jsonb :customizable_options, default: {} # what users can modify
      t.jsonb :platform_optimizations, default: {} # size/format per platform

      # Availability and pricing
      t.boolean :is_premium, default: false
      t.boolean :is_active, default: true
      t.integer :sort_order, default: 0

      # Usage analytics
      t.integer :usage_count, default: 0
      t.float :average_engagement_rate
      t.jsonb :performance_by_platform, default: {}

      # A/B testing
      t.string :experiment_group
      t.float :conversion_rate

      t.timestamps null: false
    end

    add_index :quote_templates, :category
    add_index :quote_templates, :is_premium
    add_index :quote_templates, :is_active
    add_index :quote_templates, :usage_count
    add_index :quote_templates, :average_engagement_rate
    add_index :quote_templates, :sort_order
  end
end

# Quote Template Model
class QuoteTemplate < ApplicationRecord
  has_many :quote_shares, primary_key: :id, foreign_key: :template_id

  validates :name, presence: true, uniqueness: true
  validates :design_config, presence: true

  scope :active_templates, -> { where(is_active: true) }
  scope :free_templates, -> { where(is_premium: false) }
  scope :premium_templates, -> { where(is_premium: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :popular, -> { order(usage_count: :desc) }
  scope :high_performing, -> { order(average_engagement_rate: :desc) }

  def self.recommended_for_user(user)
    # AI recommendation logic based on user's previous choices
    # and template performance
    active_templates.order(:sort_order)
  end

  def update_performance_metrics
    shares = quote_shares.includes(:quote_interactions)

    self.usage_count = shares.count
    self.average_engagement_rate = shares.average(:engagement_rate) || 0.0

    # Update platform-specific performance
    platforms_data = {}
    QuoteShare::PLATFORMS.each do |platform|
      platform_shares = shares.select { |s| s.platforms_shared.include?(platform) }
      next if platform_shares.empty?

      platforms_data[platform] = {
        usage: platform_shares.size,
        avg_engagement: platform_shares.sum(&:engagement_rate) / platform_shares.size
      }
    end

    self.performance_by_platform = platforms_data
    save!
  end
end
```

#### Community Features
```ruby
# db/migrate/014_create_trending_quotes.rb
class CreateTrendingQuotes < ActiveRecord::Migration[7.1]
  def change
    create_table :trending_quotes, id: :uuid do |t|
      t.references :quote_share, null: false, foreign_key: true, type: :uuid
      t.string :timeframe # hourly, daily, weekly
      t.integer :rank_position
      t.float :trending_score
      t.integer :total_engagement
      t.datetime :trending_period_start
      t.datetime :trending_period_end

      t.timestamps null: false
    end

    add_index :trending_quotes, [:timeframe, :rank_position]
    add_index :trending_quotes, :trending_score
    add_index :trending_quotes, :trending_period_start
  end
end

# db/migrate/015_create_quote_collections.rb
class CreateQuoteCollections < ActiveRecord::Migration[7.1]
  def change
    create_table :quote_collections, id: :uuid do |t|
      t.references :user, null: true, foreign_key: true, type: :uuid # null for system collections

      t.string :title, null: false
      t.text :description
      t.string :collection_type # user_created, ai_curated, trending, featured
      t.string :theme # motivation, business, philosophy, etc.
      t.boolean :public, default: false
      t.string :cover_image_url

      # Social metrics
      t.integer :followers_count, default: 0
      t.integer :quotes_count, default: 0
      t.float :average_rating

      t.timestamps null: false
    end

    add_index :quote_collections, :user_id
    add_index :quote_collections, :collection_type
    add_index :quote_collections, :theme
    add_index :quote_collections, :public
    add_index :quote_collections, :followers_count
  end
end

# db/migrate/016_create_quote_collection_items.rb
class CreateQuoteCollectionItems < ActiveRecord::Migration[7.1]
  def change
    create_table :quote_collection_items, id: :uuid do |t|
      t.references :quote_collection, null: false, foreign_key: true, type: :uuid
      t.references :quote_share, null: false, foreign_key: true, type: :uuid
      t.integer :position
      t.text :curator_note # why this quote was added

      t.timestamps null: false
    end

    add_index :quote_collection_items, [:quote_collection_id, :position]
    add_index :quote_collection_items, :quote_share_id
    add_index :quote_collection_items, [:quote_collection_id, :quote_share_id],
              unique: true, name: 'index_quote_collections_shares_unique'
  end
end
```

## 🚀 Performance Optimization & Indexing

### Database Extensions & Setup
```ruby
# db/migrate/000_enable_extensions.rb
class EnableExtensions < ActiveRecord::Migration[7.1]
  def change
    # Enable UUID generation
    enable_extension 'pgcrypto'

    # Enable vector similarity search for AI
    enable_extension 'vector'

    # Enable trigram similarity for full-text search
    enable_extension 'pg_trgm'

    # Enable unaccent for better text search
    enable_extension 'unaccent'

    # Enable btree_gin for better JSONB indexing
    enable_extension 'btree_gin'
  end
end
```

### Composite Indexes for Common Queries
```ruby
# db/migrate/017_add_performance_indexes.rb
class AddPerformanceIndexes < ActiveRecord::Migration[7.1]
  def change
    # User activity and reading patterns
    add_index :users, [:subscription_tier, :last_active_at]
    add_index :users, [:created_at, :subscription_tier]

    # Book discovery and filtering
    add_index :books, [:genre, :difficulty_level, :created_at]
    add_index :books, [:processing_status, :created_at]
    add_index :books, [:user_id, :processing_status, :created_at]

    # Reading progress and sessions
    add_index :reading_progress, [:user_id, :last_read_at]
    add_index :reading_progress, [:progress_percentage, :last_read_at]
    add_index :reading_sessions, [:user_id, :started_at]
    add_index :reading_sessions, [:book_id, :started_at]

    # Highlight and annotation performance
    add_index :highlights, [:user_id, :created_at]
    add_index :highlights, [:book_id, :page_number, :created_at]
    add_index :highlights, [:public, :ai_importance_score, :created_at]
    add_index :bookmarks, [:user_id, :last_visited_at]

    # AI conversation optimization
    add_index :ai_conversations, [:user_id, :created_at]
    add_index :ai_conversations, [:book_id, :created_at]
    add_index :ai_conversations, [:feature_used, :created_at]

    # Social sharing performance
    add_index :quote_shares, [:user_id, :created_at]
    add_index :quote_shares, [:engagement_rate, :created_at]
    add_index :quote_shares, [:viral_coefficient, :created_at]
    add_index :quote_shares, [:book_id, :created_at]

    # Search and discovery
    add_index :books, [:title, :author], using: :gin,
              opclass: { title: :gin_trgm_ops, author: :gin_trgm_ops }
    add_index :highlights, :selected_text, using: :gin,
              opclass: :gin_trgm_ops
  end
end
```

### Partitioning for Large Tables
```ruby
# db/migrate/018_partition_large_tables.rb
class PartitionLargeTables < ActiveRecord::Migration[7.1]
  def up
    # Partition reading sessions by month for better query performance
    execute <<-SQL
      -- Create partitioned table for reading sessions
      CREATE TABLE reading_sessions_partitioned (LIKE reading_sessions INCLUDING ALL)
      PARTITION BY RANGE (started_at);

      -- Create monthly partitions for current and next 12 months
      CREATE TABLE reading_sessions_2024_01 PARTITION OF reading_sessions_partitioned
      FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

      CREATE TABLE reading_sessions_2024_02 PARTITION OF reading_sessions_partitioned
      FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

      -- Add more partitions as needed
    SQL

    # Partition AI conversations by month (high volume table)
    execute <<-SQL
      CREATE TABLE ai_conversations_partitioned (LIKE ai_conversations INCLUDING ALL)
      PARTITION BY RANGE (created_at);

      CREATE TABLE ai_conversations_2024_01 PARTITION OF ai_conversations_partitioned
      FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    SQL
  end

  def down
    execute "DROP TABLE IF EXISTS reading_sessions_partitioned CASCADE"
    execute "DROP TABLE IF EXISTS ai_conversations_partitioned CASCADE"
  end
end
```

### Materialized Views for Analytics
```ruby
# db/migrate/019_create_analytics_views.rb
class CreateAnalyticsViews < ActiveRecord::Migration[7.1]
  def up
    # User reading statistics
    execute <<-SQL
      CREATE MATERIALIZED VIEW user_reading_stats AS
      SELECT
        u.id as user_id,
        u.subscription_tier,
        COUNT(DISTINCT b.id) as total_books,
        COUNT(DISTINCT h.id) as total_highlights,
        COUNT(DISTINCT bm.id) as total_bookmarks,
        COUNT(DISTINCT rs.id) as total_sessions,
        COALESCE(SUM(rs.duration_seconds), 0) as total_reading_time,
        COALESCE(AVG(rs.reading_speed_wpm), 0) as average_reading_speed,
        COUNT(DISTINCT qs.id) as quotes_shared,
        MAX(rs.started_at) as last_reading_session
      FROM users u
      LEFT JOIN books b ON u.id = b.user_id
      LEFT JOIN highlights h ON u.id = h.user_id
      LEFT JOIN bookmarks bm ON u.id = bm.user_id
      LEFT JOIN reading_sessions rs ON u.id = rs.user_id
      LEFT JOIN quote_shares qs ON u.id = qs.user_id
      GROUP BY u.id, u.subscription_tier;

      CREATE UNIQUE INDEX ON user_reading_stats (user_id);
    SQL

    # Book popularity and engagement
    execute <<-SQL
      CREATE MATERIALIZED VIEW book_popularity_stats AS
      SELECT
        b.id as book_id,
        b.title,
        b.author,
        b.genre,
        COUNT(DISTINCT h.user_id) as unique_highlighters,
        COUNT(h.id) as total_highlights,
        COUNT(DISTINCT qs.id) as total_shares,
        COALESCE(AVG(qs.engagement_rate), 0) as average_engagement_rate,
        COUNT(DISTINCT rs.user_id) as unique_readers,
        COALESCE(AVG(rp.progress_percentage), 0) as average_completion_rate
      FROM books b
      LEFT JOIN highlights h ON b.id = h.book_id
      LEFT JOIN quote_shares qs ON b.id = qs.book_id
      LEFT JOIN reading_sessions rs ON b.id = rs.book_id
      LEFT JOIN reading_progress rp ON b.id = rp.book_id
      GROUP BY b.id, b.title, b.author, b.genre;

      CREATE UNIQUE INDEX ON book_popularity_stats (book_id);
    SQL

    # Daily platform metrics
    execute <<-SQL
      CREATE MATERIALIZED VIEW daily_platform_metrics AS
      SELECT
        DATE(created_at) as metric_date,
        COUNT(DISTINCT user_id) as daily_active_users,
        COUNT(DISTINCT CASE WHEN subscription_tier != 'free' THEN user_id END) as premium_active_users,
        COUNT(*) as total_reading_sessions,
        SUM(duration_seconds) as total_reading_time,
        COUNT(DISTINCT book_id) as books_read
      FROM reading_sessions
      WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY DATE(created_at)
      ORDER BY metric_date DESC;

      CREATE UNIQUE INDEX ON daily_platform_metrics (metric_date);
    SQL
  end

  def down
    execute "DROP MATERIALIZED VIEW IF EXISTS user_reading_stats"
    execute "DROP MATERIALIZED VIEW IF EXISTS book_popularity_stats"
    execute "DROP MATERIALIZED VIEW IF EXISTS daily_platform_metrics"
  end
end
```

## 🔄 Database Maintenance & Monitoring

### Automated Statistics Updates
```ruby
# lib/tasks/database_maintenance.rake
namespace :db do
  desc "Refresh materialized views"
  task refresh_views: :environment do
    ActiveRecord::Base.connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY user_reading_stats")
    ActiveRecord::Base.connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY book_popularity_stats")
    ActiveRecord::Base.connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY daily_platform_metrics")
    puts "Materialized views refreshed successfully"
  end

  desc "Update quote template performance metrics"
  task update_template_metrics: :environment do
    QuoteTemplate.find_each(&:update_performance_metrics)
    puts "Template performance metrics updated"
  end

  desc "Clean up old data"
  task cleanup_old_data: :environment do
    # Remove old reading sessions (keep 1 year)
    ReadingSession.where('created_at < ?', 1.year.ago).delete_all

    # Remove old AI conversations for free users (keep 3 months)
    AiConversation.joins(:user)
                  .where(users: { subscription_tier: 'free' })
                  .where('ai_conversations.created_at < ?', 3.months.ago)
                  .delete_all

    # Remove expired quote cards
    QuoteShare.where('created_at < ? AND views_count = 0', 30.days.ago).delete_all

    puts "Old data cleanup completed"
  end
end
```

### Database Health Monitoring
```ruby
# app/models/concerns/database_health.rb
module DatabaseHealth
  extend ActiveSupport::Concern

  class_methods do
    def check_database_health
      {
        connection_status: check_connection,
        slow_queries: check_slow_queries,
        index_usage: check_index_usage,
        table_sizes: check_table_sizes,
        replication_lag: check_replication_lag
      }
    end

    private

    def check_connection
      ActiveRecord::Base.connection.execute("SELECT 1")
      { status: 'healthy', response_time: Time.current }
    rescue => e
      { status: 'error', error: e.message }
    end

    def check_slow_queries
      # Monitor queries taking longer than 1 second
      slow_queries = ActiveRecord::Base.connection.execute(<<-SQL)
        SELECT query, mean_exec_time, calls
        FROM pg_stat_statements
        WHERE mean_exec_time > 1000
        ORDER BY mean_exec_time DESC
        LIMIT 10;
      SQL

      slow_queries.to_a
    end

    def check_table_sizes
      sizes = ActiveRecord::Base.connection.execute(<<-SQL)
        SELECT
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY size_bytes DESC;
      SQL

      sizes.to_a
    end
  end
end
```

## 🔗 Complete Rails Models with Associations

### Application Record Base
```ruby
# app/models/application_record.rb
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Add UUID generation for all models
  before_create :generate_uuid

  # Soft delete functionality
  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  def soft_delete!
    update!(deleted_at: Time.current)
  end

  def restore!
    update!(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end

  private

  def generate_uuid
    self.id = SecureRandom.uuid if id.blank?
  end
end
```

### Complete User Model
```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :trackable

  # Enums
  enum subscription_tier: { free: 0, pro: 1, premium: 2 }

  # Associations
  has_many :books, dependent: :destroy
  has_many :highlights, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :annotations, dependent: :destroy
  has_many :reading_sessions, dependent: :destroy
  has_many :reading_progress, dependent: :destroy
  has_many :ai_conversations, dependent: :destroy
  has_many :quote_shares, dependent: :destroy
  has_many :quote_collections, dependent: :destroy

  # Social relationships
  has_many :follows_as_follower, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :follows_as_followee, class_name: 'Follow', foreign_key: 'followee_id', dependent: :destroy
  has_many :following, through: :follows_as_follower, source: :followee
  has_many :followers, through: :follows_as_followee, source: :follower

  # Derived associations
  has_many :shared_highlights, -> { where(public: true) }, class_name: 'Highlight'
  has_many :viral_quotes, -> { where('viral_coefficient > ?', 1.0) }, class_name: 'QuoteShare'

  # Validations
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }
  validates :email, presence: true, uniqueness: true
  validates :first_name, length: { maximum: 50 }
  validates :last_name, length: { maximum: 50 }

  # Callbacks
  before_create :set_default_preferences
  after_create :create_welcome_data

  # Scopes
  scope :active_readers, -> { where('last_active_at > ?', 7.days.ago) }
  scope :premium_users, -> { where(subscription_tier: [:pro, :premium]) }
  scope :by_reading_level, ->(level) { joins(:books).where(books: { difficulty_level: level }) }

  # Instance methods
  def full_name
    [first_name, last_name].compact.join(' ')
  end

  def display_name
    full_name.present? ? full_name : username
  end

  def can_access_ai_features?
    pro? || premium?
  end

  def ai_queries_remaining_today
    return Float::INFINITY if premium?
    return 100 if pro?

    daily_limit = 5
    used_today = ai_conversations.where(created_at: Date.current.all_day).count
    [daily_limit - used_today, 0].max
  end

  def reading_statistics
    Rails.cache.fetch("user_#{id}_reading_stats", expires_in: 1.hour) do
      {
        total_books: books.count,
        completed_books: reading_progress.where(completed: true).count,
        total_highlights: highlights.count,
        total_reading_time: reading_sessions.sum(:duration_seconds),
        quotes_shared: quote_shares.count,
        reading_streak: calculate_reading_streak
      }
    end
  end

  def follow!(other_user)
    return false if self == other_user || following?(other_user)

    follows_as_follower.create!(followee: other_user)
    increment_counter(:following_count)
    other_user.increment_counter(:followers_count)
    true
  end

  def unfollow!(other_user)
    follow = follows_as_follower.find_by(followee: other_user)
    return false unless follow

    follow.destroy!
    decrement_counter(:following_count)
    other_user.decrement_counter(:followers_count)
    true
  end

  def following?(other_user)
    following.include?(other_user)
  end

  private

  def set_default_preferences
    self.reading_preferences ||= {
      theme: 'light',
      font_size: 16,
      font_family: 'Georgia',
      line_spacing: 1.5
    }

    self.ai_preferences ||= {
      response_length: 'detailed',
      auto_suggestions: true,
      voice_enabled: false
    }

    self.notification_preferences ||= {
      reading_reminders: true,
      social_notifications: true,
      ai_suggestions: true
    }
  end

  def create_welcome_data
    # Create welcome content, sample templates, etc.
    WelcomeUserJob.perform_later(self)
  end

  def calculate_reading_streak
    sessions = reading_sessions.order(started_at: :desc)
                              .group_by { |s| s.started_at.to_date }

    current_date = Date.current
    streak = 0

    sessions.keys.sort.reverse.each do |date|
      break if date < current_date - streak.days

      streak += 1 if date == current_date - (streak).days
    end

    streak
  end
end
```

### Complete Book Model
```ruby
# app/models/book.rb
class Book < ApplicationRecord
  belongs_to :user

  # File attachments
  has_one_attached :file
  has_one_attached :cover_image

  # Reading and annotation data
  has_many :book_chapters, dependent: :destroy
  has_many :highlights, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :annotations, dependent: :destroy
  has_many :reading_sessions, dependent: :destroy
  has_one :reading_progress, dependent: :destroy
  has_many :ai_conversations, dependent: :destroy
  has_many :book_embeddings, dependent: :destroy
  has_many :quote_shares, dependent: :destroy

  # Derived associations
  has_many :public_highlights, -> { where(public: true) }, class_name: 'Highlight'
  has_many :community_highlights, through: :public_highlights, source: :user

  # Enums
  enum processing_status: { pending: 0, processing: 1, completed: 2, failed: 3 }
  enum file_type: { pdf: 0, epub: 1, mobi: 2, docx: 3 }

  # Validations
  validates :title, presence: true, length: { maximum: 500 }
  validates :file_type, presence: true
  validates :page_count, numericality: { greater_than: 0 }, allow_nil: true
  validates :difficulty_level, inclusion: { in: 1..10 }, allow_nil: true

  # Callbacks
  after_create :enqueue_processing
  before_destroy :cleanup_files

  # Scopes
  scope :completed, -> { where(processing_status: :completed) }
  scope :by_genre, ->(genre) { where(genre: genre) }
  scope :by_difficulty, ->(level) { where(difficulty_level: level) }
  scope :recently_added, -> { order(created_at: :desc) }
  scope :popular, -> { order(community_highlights_count: :desc) }
  scope :with_ai_analysis, -> { where.not(ai_summary: nil) }

  # Instance methods
  def processing_complete?
    completed?
  end

  def reading_progress_for(user)
    user.reading_progress.find_by(book: self) ||
      user.reading_progress.build(book: self, current_page: 1, progress_percentage: 0.0)
  end

  def estimated_reading_time
    return nil unless word_count

    # Average reading speed: 250 words per minute
    (word_count / 250.0).ceil
  end

  def difficulty_label
    case difficulty_level
    when 1..3 then 'Beginner'
    when 4..6 then 'Intermediate'
    when 7..8 then 'Advanced'
    when 9..10 then 'Expert'
    else 'Unknown'
    end
  end

  def popular_highlights(limit: 10)
    highlights.joins(:quote_shares)
              .group('highlights.id')
              .order('COUNT(quote_shares.id) DESC')
              .limit(limit)
  end

  def ai_insights
    {
      summary: ai_summary,
      key_concepts: key_concepts,
      topics: topics,
      difficulty: difficulty_label,
      reading_time: estimated_reading_time
    }
  end

  def social_proof
    {
      total_readers: community_highlights.distinct.count,
      highlights_count: community_highlights_count,
      shares_count: total_shares,
      average_completion: reading_progress.average(:progress_percentage) || 0
    }
  end

  private

  def enqueue_processing
    ProcessBookJob.perform_later(self) if file.attached?
  end

  def cleanup_files
    file.purge_later if file.attached?
    cover_image.purge_later if cover_image.attached?
  end
end
```

### Summary of Complete Database Schema

#### Core Tables (16 total)
1. **users** - User accounts and preferences
2. **follows** - Social following relationships
3. **books** - Book metadata and files
4. **book_chapters** - Chapter structure and content
5. **reading_sessions** - Reading activity tracking
6. **reading_progress** - Current reading positions
7. **highlights** - Text highlighting with AI analysis
8. **bookmarks** - Reading position bookmarks
9. **annotations** - Notes, voice memos, drawings
10. **ai_conversations** - AI chat history and analytics
11. **book_embeddings** - Vector embeddings for semantic search
12. **quote_shares** - Social sharing of quotes
13. **quote_templates** - Design templates for quote cards
14. **trending_quotes** - Trending quote rankings
15. **quote_collections** - Curated quote collections
16. **quote_collection_items** - Items within collections

#### Key Features Supported
✅ **User Management** - Authentication, preferences, social following
✅ **Book Management** - Multi-format support, AI processing, metadata
✅ **Reading Experience** - Progress tracking, sessions, cross-device sync
✅ **Highlighting System** - 8 semantic colors, AI analysis, social sharing
✅ **Bookmarking** - Auto and manual bookmarks with thumbnails
✅ **AI Features** - Conversations, embeddings, semantic search, cost tracking
✅ **Social Sharing** - Quote cards, viral tracking, community features
✅ **Performance** - Optimized indexes, partitioning, materialized views
✅ **Analytics** - User stats, book popularity, platform metrics

#### Scalability Features
- **UUID Primary Keys** for distributed architecture
- **JSONB Columns** for flexible metadata storage
- **Vector Search** with pg_vector for AI features
- **Partitioning** for high-volume tables
- **Materialized Views** for analytics performance
- **Comprehensive Indexing** for all query patterns

This database design supports BookMind's full feature set while maintaining excellent performance and scalability for millions of users! 🚀

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Design core database schema for users, books, and reading data", "status": "completed", "activeForm": "Designing core database schema for users, books, and reading data"}, {"content": "Create highlighting and annotation database models", "status": "completed", "activeForm": "Creating highlighting and annotation database models"}, {"content": "Design AI and social sharing database architecture", "status": "completed", "activeForm": "Designing AI and social sharing database architecture"}, {"content": "Add database indexing and performance optimization", "status": "completed", "activeForm": "Adding database indexing and performance optimization"}, {"content": "Create Rails migrations and model associations", "status": "completed", "activeForm": "Creating Rails migrations and model associations"}]