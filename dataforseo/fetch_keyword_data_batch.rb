#!/usr/bin/env ruby

require 'csv'
require './dataforseo'

# Read CSV file
csv_path = 'fileinbox/keywords.csv'
data = CSV.read(csv_path, headers: true)

# Collect all non-empty keywords with their indices
keywords_with_indices = []
data.each_with_index do |row, index|
  keyword = row['keyword']
  if keyword && !keyword.strip.empty?
    keywords_with_indices << { keyword: keyword, index: index }
  end
end

puts "Found #{keywords_with_indices.length} keywords to process"

# Process in batches of 100
batch_size = 100
batches = keywords_with_indices.each_slice(batch_size).to_a

puts "Processing in #{batches.length} batches of up to #{batch_size} keywords each"

batches.each_with_index do |batch, batch_index|
  batch_keywords = batch.map { |item| item[:keyword] }
  
  begin
    puts "\nBatch #{batch_index + 1}/#{batches.length}: Fetching data for #{batch_keywords.length} keywords..."
    
    # Get metrics for the batch
    metrics_hash = DataForSEO.get_keywords_batch_metrics(batch_keywords)
    
    # Update each row in the batch
    batch.each do |item|
      keyword = item[:keyword]
      index = item[:index]
      
      if metrics_hash[keyword]
        metrics = metrics_hash[keyword]
        data[index]['volume'] = metrics['volume'].to_s
        data[index]['difficulty'] = metrics['difficulty'].to_s
        data[index]['cpc'] = metrics['cpc'].to_f.round(2).to_s
        
        puts "  Updated: #{keyword} => Volume: #{metrics['volume']}, Difficulty: #{metrics['difficulty']}, CPC: $#{metrics['cpc'].to_f.round(2)}"
      else
        puts "  Warning: No data returned for #{keyword}"
      end
    end
    
    # Write the updated CSV after each batch
    CSV.open(csv_path, 'w') do |csv|
      csv << data.headers
      data.each do |row|
        csv << row
      end
    end
    
    status = metrics_hash.values.first['cached'] ? 'cached' : 'fetched'
    puts "Batch #{batch_index + 1} completed (#{status})"
    
  rescue StandardError => e
    puts "Error processing batch #{batch_index + 1}: #{e.message}"
    # Continue to next batch even if this one fails
  end
end

puts "\nCompleted! Updated #{csv_path} with keyword data."