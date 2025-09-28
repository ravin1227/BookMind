# 📄 BookMind - File Processing Pipeline Architecture

## 🎯 Overview

The file processing pipeline is the core system that transforms various document formats into structured, searchable, and AI-ready content for the BookMind platform.

**Supported Formats**: PDF, EPUB, MOBI, DOCX, TXT, and image-based documents with OCR

## 🏗️ Pipeline Architecture

### High-Level Flow
```
Upload → Validation → Format Detection → Text Extraction → Processing → Storage → Indexing
```

### Detailed Pipeline Components

#### 1. File Upload & Validation
```ruby
# app/services/file_upload_service.rb
class FileUploadService
  SUPPORTED_FORMATS = %w[pdf epub mobi docx txt png jpg jpeg].freeze
  MAX_FILE_SIZE = 100.megabytes
  MAX_PAGES = 2000

  def initialize(file, user)
    @file = file
    @user = user
    @errors = []
  end

  def process
    return failure_response unless validate_file

    # Create processing job
    book = create_book_record
    FileProcessingJob.perform_async(book.id, @file.path)

    success_response(book)
  end

  private

  def validate_file
    validate_format &&
    validate_size &&
    validate_content &&
    scan_for_malware
  end

  def validate_format
    extension = File.extname(@file.original_filename).downcase.delete('.')

    unless SUPPORTED_FORMATS.include?(extension)
      @errors << "Unsupported file format. Supported: #{SUPPORTED_FORMATS.join(', ')}"
      return false
    end

    # MIME type validation
    detected_type = Marcel::MimeType.for(@file.tempfile)
    expected_types = format_mime_types[extension]

    unless expected_types.include?(detected_type)
      @errors << "File content doesn't match extension"
      return false
    end

    true
  end

  def validate_size
    if @file.size > MAX_FILE_SIZE
      @errors << "File too large. Maximum size: #{MAX_FILE_SIZE / 1.megabyte}MB"
      return false
    end
    true
  end

  def validate_content
    # Quick content scan for basic validation
    case file_format
    when 'pdf'
      validate_pdf_content
    when 'epub'
      validate_epub_content
    else
      true
    end
  end

  def scan_for_malware
    # Integration with ClamAV or similar
    # For MVP, basic file header validation
    true
  end

  def create_book_record
    @user.books.create!(
      title: extract_title_from_filename,
      original_filename: @file.original_filename,
      file_format: file_format,
      file_size: @file.size,
      processing_status: 'pending',
      upload_source: 'manual'
    )
  end
end
```

#### 2. Format Detection & Routing
```ruby
# app/services/format_detector_service.rb
class FormatDetectorService
  def self.detect_and_route(file_path)
    format = detect_format(file_path)

    case format
    when 'pdf'
      PdfProcessorService.new(file_path)
    when 'epub'
      EpubProcessorService.new(file_path)
    when 'mobi'
      MobiProcessorService.new(file_path)
    when 'docx'
      DocxProcessorService.new(file_path)
    when 'image'
      OcrProcessorService.new(file_path)
    else
      raise UnsupportedFormatError, "Format #{format} not supported"
    end
  end

  private

  def self.detect_format(file_path)
    mime_type = Marcel::MimeType.for(Pathname.new(file_path))

    case mime_type
    when 'application/pdf'
      'pdf'
    when 'application/epub+zip'
      'epub'
    when 'application/x-mobipocket-ebook'
      'mobi'
    when 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      'docx'
    when /^image\//
      'image'
    else
      'unknown'
    end
  end
end
```

## 📚 Format-Specific Processors

### PDF Processor
```ruby
# app/services/pdf_processor_service.rb
class PdfProcessorService
  def initialize(file_path)
    @file_path = file_path
    @metadata = {}
    @pages = []
    @text_content = ""
  end

  def process
    extract_metadata
    extract_text_content
    detect_if_ocr_needed
    process_images if ocr_needed?
    structure_content

    {
      metadata: @metadata,
      content: @text_content,
      pages: @pages,
      processing_info: @processing_info
    }
  end

  private

  def extract_metadata
    reader = PDF::Reader.new(@file_path)

    @metadata = {
      title: reader.info[:Title],
      author: reader.info[:Author],
      subject: reader.info[:Subject],
      creator: reader.info[:Creator],
      producer: reader.info[:Producer],
      creation_date: reader.info[:CreationDate],
      page_count: reader.page_count,
      pdf_version: reader.pdf_version,
      encrypted: reader.encrypted?
    }
  rescue => e
    Rails.logger.error "PDF metadata extraction failed: #{e.message}"
    @metadata = { extraction_error: e.message }
  end

  def extract_text_content
    reader = PDF::Reader.new(@file_path)
    text_content = []

    reader.pages.each_with_index do |page, index|
      page_text = page.text.strip

      @pages << {
        page_number: index + 1,
        text: page_text,
        char_count: page_text.length,
        has_text: page_text.length > 0
      }

      text_content << page_text if page_text.length > 0
    end

    @text_content = text_content.join("\n\n")
    @processing_info = {
      total_pages: reader.page_count,
      pages_with_text: @pages.count { |p| p[:has_text] },
      total_characters: @text_content.length
    }
  rescue => e
    Rails.logger.error "PDF text extraction failed: #{e.message}"
    @processing_info = { extraction_error: e.message }
  end

  def detect_if_ocr_needed
    # If less than 50% of pages have text, likely needs OCR
    text_page_ratio = @pages.count { |p| p[:has_text] }.to_f / @pages.length
    @ocr_needed = text_page_ratio < 0.5

    @processing_info[:ocr_needed] = @ocr_needed
    @processing_info[:text_page_ratio] = text_page_ratio
  end

  def ocr_needed?
    @ocr_needed
  end

  def process_images
    # Convert PDF pages to images and run OCR
    OcrProcessorService.new(@file_path, format: 'pdf').process
  end

  def structure_content
    # Clean and structure the extracted text
    @text_content = TextProcessorService.new(@text_content).clean_and_structure
  end
end
```

### EPUB Processor
```ruby
# app/services/epub_processor_service.rb
class EpubProcessorService
  def initialize(file_path)
    @file_path = file_path
    @metadata = {}
    @chapters = []
    @text_content = ""
  end

  def process
    extract_metadata
    extract_content_structure
    extract_text_content
    process_images

    {
      metadata: @metadata,
      content: @text_content,
      chapters: @chapters,
      structure: @structure
    }
  end

  private

  def extract_metadata
    book = EPUB::Parser.parse(@file_path)

    @metadata = {
      title: book.metadata.titles.first&.content,
      author: book.metadata.creators.map(&:content).join(', '),
      publisher: book.metadata.publishers.first&.content,
      publication_date: book.metadata.dates.first&.content,
      isbn: book.metadata.identifiers.find { |id| id.scheme == 'ISBN' }&.content,
      language: book.metadata.languages.first&.content,
      description: book.metadata.descriptions.first&.content,
      rights: book.metadata.rights.first&.content
    }
  rescue => e
    Rails.logger.error "EPUB metadata extraction failed: #{e.message}"
    @metadata = { extraction_error: e.message }
  end

  def extract_content_structure
    book = EPUB::Parser.parse(@file_path)

    # Extract table of contents
    @structure = {
      spine: book.spine.itemrefs.map(&:idref),
      toc: extract_table_of_contents(book),
      reading_order: book.spine.itemrefs.map { |item| item.item.href }
    }
  end

  def extract_text_content
    book = EPUB::Parser.parse(@file_path)
    chapter_texts = []

    book.spine.itemrefs.each_with_index do |itemref, index|
      item = itemref.item
      next unless item.media_type == 'application/xhtml+xml'

      begin
        doc = Nokogiri::HTML(item.read)

        # Remove script and style tags
        doc.css('script, style').remove

        # Extract text content
        text = doc.css('body').text.strip.gsub(/\s+/, ' ')

        @chapters << {
          index: index,
          title: extract_chapter_title(doc),
          href: item.href,
          text: text,
          word_count: text.split.length,
          char_count: text.length
        }

        chapter_texts << text
      rescue => e
        Rails.logger.error "Failed to process EPUB chapter #{item.href}: #{e.message}"
      end
    end

    @text_content = chapter_texts.join("\n\n")
  end

  def extract_table_of_contents(book)
    return [] unless book.nav

    toc_items = []
    book.nav.css('ol li').each do |li|
      link = li.css('a').first
      next unless link

      toc_items << {
        title: link.text.strip,
        href: link['href'],
        level: calculate_nesting_level(li)
      }
    end

    toc_items
  end

  def extract_chapter_title(doc)
    # Try various selectors for chapter titles
    selectors = ['h1', 'h2', '.chapter-title', '.title', 'header h1', 'header h2']

    selectors.each do |selector|
      element = doc.css(selector).first
      return element.text.strip if element && element.text.strip.length > 0
    end

    'Untitled Chapter'
  end

  def calculate_nesting_level(element)
    level = 0
    current = element.parent

    while current
      level += 1 if current.name == 'ol'
      current = current.parent
    end

    level
  end

  def process_images
    # Extract and process any images in the EPUB
    # For now, just catalog them
    book = EPUB::Parser.parse(@file_path)

    @images = book.manifest.items.select { |item|
      item.media_type.start_with?('image/')
    }.map { |item|
      {
        href: item.href,
        media_type: item.media_type,
        size: item.read.length
      }
    }
  end
end
```

### OCR Processor
```ruby
# app/services/ocr_processor_service.rb
class OcrProcessorService
  def initialize(file_path, format: 'image')
    @file_path = file_path
    @format = format
    @results = []
  end

  def process
    case @format
    when 'image'
      process_single_image
    when 'pdf'
      process_pdf_pages
    end

    combine_results
  end

  private

  def process_single_image
    result = perform_ocr(@file_path)
    @results << {
      page: 1,
      text: result[:text],
      confidence: result[:confidence],
      processing_time: result[:processing_time]
    }
  end

  def process_pdf_pages
    # Convert PDF to images first
    image_paths = convert_pdf_to_images

    image_paths.each_with_index do |image_path, index|
      result = perform_ocr(image_path)
      @results << {
        page: index + 1,
        text: result[:text],
        confidence: result[:confidence],
        processing_time: result[:processing_time]
      }

      # Clean up temporary image
      File.delete(image_path) if File.exist?(image_path)
    end
  end

  def perform_ocr(image_path)
    start_time = Time.current

    # Using Tesseract via RTesseract gem
    image = RTesseract.new(image_path)
    text = image.to_s.strip

    # Get confidence data
    confidence_data = image.confidence
    avg_confidence = confidence_data.values.sum / confidence_data.length if confidence_data.any?

    {
      text: text,
      confidence: avg_confidence || 0,
      processing_time: Time.current - start_time
    }
  rescue => e
    Rails.logger.error "OCR processing failed for #{image_path}: #{e.message}"
    {
      text: "",
      confidence: 0,
      processing_time: Time.current - start_time,
      error: e.message
    }
  end

  def convert_pdf_to_images
    output_dir = Rails.root.join('tmp', 'pdf_images', SecureRandom.uuid)
    FileUtils.mkdir_p(output_dir)

    # Using ImageMagick to convert PDF pages to images
    `convert -density 300 #{@file_path} #{output_dir}/page.png`

    Dir.glob("#{output_dir}/page*.png").sort
  end

  def combine_results
    {
      total_pages: @results.length,
      total_text: @results.map { |r| r[:text] }.join("\n\n"),
      average_confidence: @results.map { |r| r[:confidence] }.sum / @results.length,
      total_processing_time: @results.sum { |r| r[:processing_time] },
      pages: @results
    }
  end
end
```

## 🧹 Text Processing & Cleaning

### Text Processor Service
```ruby
# app/services/text_processor_service.rb
class TextProcessorService
  def initialize(raw_text)
    @raw_text = raw_text
    @processed_text = raw_text.dup
  end

  def clean_and_structure
    normalize_whitespace
    remove_artifacts
    fix_hyphenation
    identify_chapters
    extract_structure

    {
      cleaned_text: @processed_text,
      structure: @structure,
      statistics: generate_statistics,
      quality_score: calculate_quality_score
    }
  end

  private

  def normalize_whitespace
    # Remove excessive whitespace while preserving paragraph breaks
    @processed_text = @processed_text
      .gsub(/\r\n|\r/, "\n")                    # Normalize line endings
      .gsub(/[^\S\n]+/, ' ')                    # Normalize spaces and tabs
      .gsub(/\n{3,}/, "\n\n")                   # Limit consecutive newlines
      .strip
  end

  def remove_artifacts
    # Remove common OCR and extraction artifacts
    artifacts = [
      /\b\d+\b\s*$/m,                          # Page numbers at end of lines
      /^[^\w\s]*$/m,                           # Lines with only symbols
      /\b[A-Z]{2,}\s*\d+\s*$/m,               # Headers with numbers
      /^\s*[\-_=]{3,}\s*$/m                    # Separator lines
    ]

    artifacts.each do |pattern|
      @processed_text = @processed_text.gsub(pattern, '')
    end
  end

  def fix_hyphenation
    # Fix broken words from line breaks
    @processed_text = @processed_text.gsub(/(\w+)-\s*\n\s*(\w+)/) do |match|
      # Check if it's a real word when combined
      combined = "#{$1}#{$2}"
      word_exists?(combined) ? combined : match
    end
  end

  def identify_chapters
    chapter_patterns = [
      /^Chapter\s+\d+/i,
      /^Part\s+\d+/i,
      /^\d+\.\s+[A-Z]/,
      /^[IVX]+\.\s+[A-Z]/
    ]

    @chapters = []
    lines = @processed_text.split("\n")

    lines.each_with_index do |line, index|
      chapter_patterns.each do |pattern|
        if line.match?(pattern)
          @chapters << {
            title: line.strip,
            start_position: @processed_text.index(line),
            line_number: index
          }
          break
        end
      end
    end
  end

  def extract_structure
    @structure = {
      chapters: @chapters,
      paragraph_count: @processed_text.split(/\n\s*\n/).length,
      estimated_reading_time: calculate_reading_time,
      language: detect_language,
      complexity_score: calculate_complexity
    }
  end

  def generate_statistics
    words = @processed_text.split(/\s+/)
    sentences = @processed_text.split(/[.!?]+/)

    {
      character_count: @processed_text.length,
      word_count: words.length,
      sentence_count: sentences.length,
      paragraph_count: @processed_text.split(/\n\s*\n/).length,
      avg_words_per_sentence: words.length.to_f / sentences.length,
      avg_sentence_length: @processed_text.length.to_f / sentences.length
    }
  end

  def calculate_quality_score
    # Simple quality assessment based on various factors
    scores = []

    # Text length score (0-25 points)
    scores << [@processed_text.length / 1000.0, 25].min

    # Sentence structure score (0-25 points)
    avg_sentence_length = generate_statistics[:avg_sentence_length]
    scores << (avg_sentence_length > 10 && avg_sentence_length < 200) ? 25 : 10

    # Character diversity score (0-25 points)
    unique_chars = @processed_text.downcase.chars.uniq.length
    scores << [unique_chars, 25].min

    # Word frequency distribution score (0-25 points)
    words = @processed_text.downcase.split(/\s+/)
    unique_words = words.uniq.length
    word_diversity = unique_words.to_f / words.length
    scores << (word_diversity * 100).to_i

    scores.sum
  end

  def calculate_reading_time
    # Average reading speed: 200-250 words per minute
    word_count = @processed_text.split(/\s+/).length
    (word_count / 225.0).ceil # minutes
  end

  def detect_language
    # Simple language detection - for MVP
    # In production, use a proper language detection library
    if @processed_text.match?(/\b(the|and|is|in|to|of|a|that|it|with|for|as|was|on|are|you)\b/i)
      'en'
    else
      'unknown'
    end
  end

  def calculate_complexity
    # Flesch Reading Ease approximation
    stats = generate_statistics

    return 0 if stats[:sentence_count] == 0 || stats[:word_count] == 0

    avg_sentence_length = stats[:word_count].to_f / stats[:sentence_count]

    # Simplified complexity score (lower = more complex)
    if avg_sentence_length < 10
      'easy'
    elsif avg_sentence_length < 20
      'medium'
    else
      'complex'
    end
  end

  def word_exists?(word)
    # Simple word validation - in production use a dictionary API
    word.length > 2 && word.match?(/^[a-zA-Z]+$/)
  end
end
```

## 🔄 Background Job Processing

### File Processing Job
```ruby
# app/jobs/file_processing_job.rb
class FileProcessingJob
  include Sidekiq::Job

  sidekiq_options queue: 'file_processing', retry: 3

  def perform(book_id, file_path)
    book = Book.find(book_id)
    update_status(book, 'processing')

    begin
      # Process the file based on format
      processor = FormatDetectorService.detect_and_route(file_path)
      result = processor.process

      # Store processed content
      store_processed_content(book, result)

      # Generate embeddings for AI features
      EmbeddingGenerationJob.perform_async(book_id)

      update_status(book, 'completed')

    rescue => e
      Rails.logger.error "File processing failed for book #{book_id}: #{e.message}"
      update_status(book, 'failed', e.message)
      raise e
    ensure
      # Clean up temporary files
      cleanup_temp_files(file_path)
    end
  end

  private

  def store_processed_content(book, result)
    book.update!(
      title: result[:metadata][:title] || book.title,
      author: result[:metadata][:author],
      publisher: result[:metadata][:publisher],
      publication_date: result[:metadata][:publication_date],
      isbn: result[:metadata][:isbn],
      language: result[:metadata][:language] || result.dig(:structure, :language),
      page_count: result[:metadata][:page_count],
      word_count: result.dig(:statistics, :word_count),
      character_count: result.dig(:statistics, :character_count),
      estimated_reading_time: result.dig(:structure, :estimated_reading_time),
      content_quality_score: result[:quality_score]
    )

    # Store the processed text content
    BookContent.create!(
      book: book,
      content_type: 'full_text',
      content: result[:content] || result[:cleaned_text],
      structure_data: result[:structure],
      processing_metadata: {
        processor_version: '1.0',
        processed_at: Time.current,
        statistics: result[:statistics]
      }
    )

    # Store chapter information if available
    if result[:chapters]
      result[:chapters].each_with_index do |chapter, index|
        BookChapter.create!(
          book: book,
          chapter_number: index + 1,
          title: chapter[:title],
          content: chapter[:text],
          word_count: chapter[:word_count],
          start_position: chapter[:start_position]
        )
      end
    end
  end

  def update_status(book, status, error_message = nil)
    book.update!(
      processing_status: status,
      processing_error: error_message,
      processed_at: status == 'completed' ? Time.current : nil
    )

    # Notify user via WebSocket or push notification
    BookProcessingChannel.broadcast_to(
      book.user,
      {
        book_id: book.id,
        status: status,
        error: error_message
      }
    )
  end

  def cleanup_temp_files(file_path)
    File.delete(file_path) if File.exist?(file_path)

    # Clean up any temporary directories created during processing
    temp_dirs = Dir.glob(Rails.root.join('tmp', 'processing_*'))
    temp_dirs.each do |dir|
      FileUtils.rm_rf(dir) if File.mtime(dir) < 1.hour.ago
    end
  end
end
```

### Embedding Generation Job
```ruby
# app/jobs/embedding_generation_job.rb
class EmbeddingGenerationJob
  include Sidekiq::Job

  sidekiq_options queue: 'ai_processing', retry: 2

  def perform(book_id)
    book = Book.find(book_id)
    content = book.book_content.find_by(content_type: 'full_text')

    return unless content&.content.present?

    # Split content into chunks for embedding
    chunks = TextChunkingService.new(content.content).create_chunks

    chunks.each_with_index do |chunk, index|
      # Generate embeddings using OpenAI
      embedding = OpenAiEmbeddingService.new(chunk[:text]).generate

      BookEmbedding.create!(
        book: book,
        chunk_index: index,
        chunk_text: chunk[:text],
        chunk_metadata: chunk[:metadata],
        embedding_vector: embedding,
        embedding_model: 'text-embedding-ada-002',
        created_at: Time.current
      )
    end

    book.update!(embeddings_generated_at: Time.current)

  rescue => e
    Rails.logger.error "Embedding generation failed for book #{book_id}: #{e.message}"
    raise e
  end
end
```

## 🗂️ Storage Strategy

### File Storage Configuration
```ruby
# config/storage.yml
development:
  service: Disk
  root: <%= Rails.root.join("storage") %>

production:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-east-1
  bucket: bookmind-documents-<%= Rails.env %>
  public: false

# Separate bucket for processed content
processed_content:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-east-1
  bucket: bookmind-processed-content-<%= Rails.env %>
  public: false
```

## 📊 Performance Considerations

### Optimization Strategies

1. **Parallel Processing**: Process multiple files simultaneously
2. **Chunked Processing**: Break large files into smaller chunks
3. **Caching**: Cache processed content and metadata
4. **Progressive Processing**: Start with metadata, then content
5. **Resource Management**: Limit concurrent OCR jobs

### Monitoring & Metrics

```ruby
# app/services/processing_metrics_service.rb
class ProcessingMetricsService
  def self.track_processing(book, start_time, end_time, result)
    ProcessingMetric.create!(
      book: book,
      file_format: book.file_format,
      file_size: book.file_size,
      processing_time: end_time - start_time,
      success: result[:success],
      word_count: result.dig(:statistics, :word_count),
      quality_score: result[:quality_score],
      ocr_used: result[:ocr_used],
      error_message: result[:error]
    )
  end
end
```

## 🚀 Implementation Checklist

### Phase 1: Core Infrastructure (Week 1)
- [ ] Set up file upload handling with validation
- [ ] Implement basic PDF text extraction
- [ ] Create background job processing system
- [ ] Set up file storage (local/S3)

### Phase 2: Format Support (Week 2)
- [ ] Implement EPUB processor
- [ ] Add DOCX support
- [ ] Integrate OCR capabilities
- [ ] Create text cleaning pipeline

### Phase 3: Advanced Features (Week 3)
- [ ] Add metadata extraction for all formats
- [ ] Implement chapter detection and structuring
- [ ] Create quality assessment system
- [ ] Add processing progress tracking

### Phase 4: AI Integration (Week 4)
- [ ] Implement text chunking for embeddings
- [ ] Integrate OpenAI embedding generation
- [ ] Set up vector storage and indexing
- [ ] Add content search capabilities

---

*This file processing pipeline provides robust document ingestion with support for multiple formats, OCR capabilities, and AI-ready content preparation for the BookMind platform.*