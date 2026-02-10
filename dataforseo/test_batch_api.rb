#!/usr/bin/env ruby

require './dataforseo'
require 'json'

# Test with a small batch first
test_keywords = ["file transfer", "share files", "upload files"]

begin
  puts "Testing batch API with keywords: #{test_keywords.join(', ')}"
  
  # Test the API directly first
  uri = URI('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live')
  
  request = Net::HTTP::Post.new(uri)
  request.basic_auth(ENV['DATAFORSEO_USERNAME'], ENV['DATAFORSEO_PASSWORD'])
  request['Content-Type'] = 'application/json'
  
  payload = [{
    "keywords": test_keywords,
    "language_code": "en",
    "location_code": 2840  # United States
  }]
  
  request.body = payload.to_json
  
  puts "\nSending request..."
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  
  puts "Response Code: #{response.code}"
  
  if response.code == '200'
    data = JSON.parse(response.body)
    puts "\nResponse structure:"
    puts JSON.pretty_generate(data)
  else
    puts "Error: #{response.body}"
  end
  
rescue StandardError => e
  puts "Error: #{e.message}"
  puts e.backtrace.first(5)
end