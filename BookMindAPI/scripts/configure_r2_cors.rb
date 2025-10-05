#!/usr/bin/env ruby
# Configure CORS for R2 bucket

require 'aws-sdk-s3'

# R2 Configuration from .env
r2_config = {
  access_key_id: ENV['R2_ACCESS_KEY_ID'] || 'ba9cecfba0e1f20ef73aaff9fb7a1148',
  secret_access_key: ENV['R2_SECRET_ACCESS_KEY'] || '409a92022257e785c5bd53f55e6bce063e6de9f9987fa39410379604d09e7cb0',
  endpoint: ENV['R2_ENDPOINT'] || 'https://6b3476156cae357ceccb647b6c36db3f.r2.cloudflarestorage.com',
  bucket_name: ENV['R2_BUCKET_NAME'] || 'bookmind-files'
}

puts "🔧 Configuring CORS for R2 bucket: #{r2_config[:bucket_name]}"
puts "📍 Endpoint: #{r2_config[:endpoint]}"

# Create S3 client for R2
s3_client = Aws::S3::Client.new(
  access_key_id: r2_config[:access_key_id],
  secret_access_key: r2_config[:secret_access_key],
  endpoint: r2_config[:endpoint],
  region: 'auto',
  force_path_style: true
)

# CORS configuration
cors_configuration = {
  cors_rules: [
    {
      allowed_origins: ['*'],
      allowed_methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      allowed_headers: ['*'],
      expose_headers: ['ETag', 'Content-Type', 'Content-Length'],
      max_age_seconds: 3600
    }
  ]
}

begin
  # Apply CORS configuration
  s3_client.put_bucket_cors(
    bucket: r2_config[:bucket_name],
    cors_configuration: cors_configuration
  )

  puts "✅ CORS configuration applied successfully!"
  puts ""
  puts "CORS Rules:"
  puts "  - Allowed Origins: *"
  puts "  - Allowed Methods: GET, PUT, POST, DELETE, HEAD"
  puts "  - Allowed Headers: *"
  puts "  - Max Age: 3600 seconds"

rescue Aws::S3::Errors::ServiceError => e
  puts "❌ Failed to configure CORS: #{e.message}"
  puts ""
  puts "You can configure CORS manually in Cloudflare R2 dashboard:"
  puts "1. Go to https://dash.cloudflare.com/"
  puts "2. Navigate to R2 > bookmind-files"
  puts "3. Go to Settings > CORS Policy"
  puts "4. Add the following CORS rule:"
  puts ""
  puts cors_configuration.to_json
  exit 1
end