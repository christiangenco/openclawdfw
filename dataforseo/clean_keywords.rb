#!/usr/bin/env ruby

require 'csv'

# Read CSV file
csv_path = 'fileinbox/keywords.csv'
data = CSV.read(csv_path, headers: true)

# Clean keywords by removing special characters
cleaned_count = 0
data.each_with_index do |row, index|
  keyword = row['keyword']
  
  # Skip blank keywords
  next if keyword.nil? || keyword.strip.empty?
  
  # Remove special characters that API doesn't accept
  cleaned_keyword = keyword.gsub(/[?!@#$%^&*()+=\[\]{};:'"|\\<>\/]/, '')
  
  if cleaned_keyword != keyword
    puts "Cleaning: '#{keyword}' => '#{cleaned_keyword}'"
    row['keyword'] = cleaned_keyword
    cleaned_count += 1
  end
end

# Write the updated CSV
CSV.open(csv_path, 'w') do |csv|
  csv << data.headers
  data.each do |row|
    csv << row
  end
end

puts "\nCleaned #{cleaned_count} keywords in #{csv_path}"