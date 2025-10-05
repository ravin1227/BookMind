class Highlight < ApplicationRecord
  # Generate UUID before creation
  before_create :generate_uuid

  # Relationships
  belongs_to :book
  belongs_to :user

  # Validations
  validates :uuid, presence: true, uniqueness: true
  validates :start_position, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :end_position, presence: true, numericality: { greater_than: :start_position }
  validates :highlighted_text, presence: true
  validates :color, presence: true, inclusion: { in: %w[yellow blue green pink orange purple] }

  # Scopes
  scope :by_user, ->(user) { where(user: user) }
  scope :by_book, ->(book) { where(book: book) }
  scope :by_color, ->(color) { where(color: color) }
  scope :favorites, -> { where(is_favorite: true) }
  scope :with_notes, -> { where.not(note: [nil, '']) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_position, -> { order(:start_position) }

  # Instance methods
  def favorite?
    is_favorite?
  end

  def toggle_favorite!
    update!(is_favorite: !is_favorite)
  end

  def has_note?
    note.present?
  end

  def text_length
    highlighted_text.length
  end

  def word_count
    highlighted_text.split.length
  end

  def shareable_content
    content = highlighted_text.strip
    content += "\n\n— #{book.title}"
    content += " by #{book.author}" if book.author.present?
    content
  end

  def context_with_highlight
    return highlighted_text unless book.content_text.present?

    # Get surrounding context (100 characters before and after)
    start_context = [start_position - 100, 0].max
    end_context = [end_position + 100, book.content_text.length].min

    before_text = book.content_text[start_context...start_position]
    after_text = book.content_text[end_position...end_context]

    "#{before_text}**#{highlighted_text}**#{after_text}"
  end

  def overlaps_with?(other_highlight)
    return false unless other_highlight.is_a?(Highlight)
    return false unless book_id == other_highlight.book_id

    start_position < other_highlight.end_position && end_position > other_highlight.start_position
  end

  private

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end
end