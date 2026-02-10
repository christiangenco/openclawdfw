#!/usr/bin/env ruby

require 'json'
require 'fileutils'

cache_dir = '_dataforseo'
removed_count = 0

Dir.glob(File.join(cache_dir, '*.json')).each do |file|
  begin
    data = JSON.parse(File.read(file))
    
    # Check if this is a keyword cache file with rate limit error
    if data['response'] && data['response']['tasks'] && data['response']['tasks'][0]
      task = data['response']['tasks'][0]
      if task['status_code'] == 40202 || task['status_message']&.include?('rates limit')
        puts "Removing rate-limited cache: #{File.basename(file)}"
        if data['keyword']
          puts "  Keyword: #{data['keyword']}"
        end
        FileUtils.rm(file)
        removed_count += 1
      end
    end
  rescue => e
    puts "Error reading #{file}: #{e.message}"
  end
end

puts "\nRemoved #{removed_count} rate-limited cache files"