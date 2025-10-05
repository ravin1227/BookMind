-- BookMind Database Schema for Visualization Tools
-- Compatible with dbdiagram.io, DrawSQL, etc.

-- Users table (Core authentication)
Table users {
  id bigserial [pk]
  uuid varchar(36) [unique, not null, note: 'App unique identifier']
  email varchar(255) [unique, not null, note: 'Login email']
  name varchar(255) [not null, note: 'Display name']
  password_digest varchar(255) [not null, note: 'Encrypted password']
  email_verified boolean [default: false, note: 'Email confirmation']
  last_login_at timestamp
  account_status varchar(20) [default: 'active', note: 'active/suspended/deleted']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- User devices for push notifications
Table user_devices {
  id bigserial [pk]
  user_id bigint [ref: > users.id, not null]
  device_token varchar(500) [not null, note: 'FCM/APNS token']
  device_type varchar(20) [not null, note: 'ios/android']
  device_name varchar(100) [note: 'iPhone 15, Samsung Galaxy']
  active boolean [default: true, note: 'Current device status']
  last_used_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- User preferences and settings
Table user_preferences {
  id bigserial [pk]
  user_id bigint [ref: - users.id, not null, note: 'One-to-one relationship']
  reading_settings json [note: 'font_size, theme, tts_voice, speed']
  notification_settings json [note: 'reminders, achievements, social']
  timezone varchar(50) [note: 'User timezone']
  daily_reading_goal integer [note: 'Minutes per day']
  preferred_reading_time varchar(20) [note: 'morning/afternoon/evening']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- User reading statistics and gamification
Table user_reading_stats {
  id bigserial [pk]
  user_id bigint [ref: - users.id, not null, note: 'One-to-one relationship']
  reading_streak integer [default: 0, note: 'Consecutive days']
  total_books_read integer [default: 0, note: 'Completed books']
  total_reading_time integer [default: 0, note: 'Minutes read']
  pages_read_today integer [default: 0, note: 'Daily progress']
  last_reading_date date [note: 'Streak tracking']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Books uploaded by users
Table books {
  id bigserial [pk]
  user_id bigint [ref: > users.id, not null]
  uuid varchar(36) [unique, not null, note: 'Book sharing identifier']
  title varchar(500) [not null, note: 'Book title']
  author varchar(255) [note: 'Book author']
  isbn varchar(20) [note: 'ISBN if available']
  file_path varchar(1000) [not null, note: 'Storage location']
  file_type varchar(10) [not null, note: 'pdf/epub/txt']
  file_size bigint [not null, note: 'File size in bytes']
  content_text text [note: 'Extracted text content']
  processing_status varchar(20) [default: 'pending', note: 'pending/processing/completed/failed']
  metadata json [note: 'page_count, language, extraction_info']
  uploaded_at timestamp [not null]
  processed_at timestamp
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Reading progress tracking
Table reading_progress {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  user_id bigint [ref: > users.id, not null]
  current_page integer [default: 1, note: 'Current reading position']
  total_pages integer [note: 'Total book pages']
  progress_percentage decimal(5,2) [default: 0.0, note: '0.00 to 100.00']
  current_chapter varchar(255) [note: 'Chapter name/number']
  reading_position integer [note: 'Character/word position in text']
  reading_speed decimal(6,2) [note: 'Words per minute']
  last_read_at timestamp [note: 'Last reading session']
  started_reading_at timestamp [note: 'First time opened']
  completed_at timestamp [note: 'Book completion time']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Text highlights in books
Table highlights {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  user_id bigint [ref: > users.id, not null]
  uuid varchar(36) [unique, not null, note: 'Highlight sharing ID']
  start_position integer [not null, note: 'Text start position']
  end_position integer [not null, note: 'Text end position']
  highlighted_text text [not null, note: 'Selected text']
  color varchar(20) [default: 'yellow', note: 'highlight_color']
  note text [note: 'User annotation']
  page_number integer [note: 'Page location']
  is_favorite boolean [default: false, note: 'Star highlight']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Page bookmarks
Table bookmarks {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  user_id bigint [ref: > users.id, not null]
  page_number integer [not null, note: 'Bookmarked page']
  position integer [note: 'Position on page']
  title varchar(255) [note: 'Bookmark name']
  note text [note: 'Bookmark description']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Social sharing quotes
Table quotes {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  user_id bigint [ref: > users.id, not null]
  highlight_id bigint [ref: > highlights.id, note: 'Source highlight']
  uuid varchar(36) [unique, not null, note: 'Quote sharing ID']
  quote_text text [not null, note: 'Quote content']
  context text [note: 'Surrounding context']
  background_template varchar(50) [note: 'Design template name']
  style_settings json [note: 'colors, fonts, layout customization']
  social_media_data json [note: 'platform_specific_formats']
  share_count integer [default: 0, note: 'Times shared publicly']
  shared_at timestamp [note: 'First share time']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- AI chat sessions
Table chat_sessions {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  user_id bigint [ref: > users.id, not null]
  uuid varchar(36) [unique, not null, note: 'Session sharing ID']
  title varchar(255) [note: 'Chat session name']
  status varchar(20) [default: 'active', note: 'active/archived']
  message_count integer [default: 0, note: 'Number of messages']
  last_message_at timestamp [note: 'Recent activity']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Chat messages within sessions
Table chat_messages {
  id bigserial [pk]
  chat_session_id bigint [ref: > chat_sessions.id, not null]
  role varchar(20) [not null, note: 'user/assistant/system']
  content text [not null, note: 'Message content']
  metadata json [note: 'tokens_used, model_version, processing_time']
  context_reference text [note: 'Book section/page referenced']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Vector embeddings for AI search
Table embeddings {
  id bigserial [pk]
  book_id bigint [ref: > books.id, not null]
  chunk_id varchar(100) [unique, not null, note: 'Unique chunk identifier']
  content text [not null, note: 'Text chunk for embedding']
  chunk_index integer [not null, note: 'Order in book']
  start_position integer [not null, note: 'Text start position']
  end_position integer [not null, note: 'Text end position']
  embedding vector [note: 'Vector embedding (PostgreSQL pgvector)']
  metadata json [note: 'page_number, chapter, section_type']
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

-- Indexes for performance
-- CREATE INDEX idx_users_uuid ON users(uuid);
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_books_user_id ON books(user_id);
-- CREATE INDEX idx_books_uuid ON books(uuid);
-- CREATE INDEX idx_reading_progress_book_user ON reading_progress(book_id, user_id);
-- CREATE INDEX idx_highlights_book_id ON highlights(book_id);
-- CREATE INDEX idx_highlights_user_id ON highlights(user_id);
-- CREATE INDEX idx_bookmarks_book_id ON bookmarks(book_id);
-- CREATE INDEX idx_chat_sessions_book_id ON chat_sessions(book_id);
-- CREATE INDEX idx_chat_messages_session_id ON chat_messages(chat_session_id);
-- CREATE INDEX idx_embeddings_book_id ON embeddings(book_id);
-- CREATE INDEX idx_embeddings_chunk_id ON embeddings(chunk_id);