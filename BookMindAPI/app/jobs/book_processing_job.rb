class BookProcessingJob
  include Sidekiq::Job

  def perform(book_id)
    book = Book.find(book_id)
    Rails.logger.info "Processing book #{book.uuid} (ID: #{book_id})"

    success = BookProcessingService.process(book)

    if success
      Rails.logger.info "Successfully processed book #{book.uuid}"
      # TODO: Send notification to user about completion
    else
      Rails.logger.error "Failed to process book #{book.uuid}"
      # TODO: Send notification to user about failure
    end

    success
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "Book with ID #{book_id} not found"
    false
  rescue => e
    Rails.logger.error "Unexpected error processing book #{book_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    false
  end
end