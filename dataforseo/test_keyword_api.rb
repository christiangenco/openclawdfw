#!/usr/bin/env ruby

require './dataforseo'

# Test with a single keyword first
test_keyword = "file transfer"

begin
  puts "Testing API with keyword: '#{test_keyword}'"
  metrics = DataForSEO.get_keyword_metrics(test_keyword)
  
  puts "Success!"
  puts "  Volume: #{metrics['volume']}"
  puts "  Difficulty: #{metrics['difficulty']}"
  puts "  Cached: #{metrics['cached']}"
rescue StandardError => e
  puts "Error: #{e.message}"
end