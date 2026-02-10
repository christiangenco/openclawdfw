#!/usr/bin/env ruby
# Fetch all domains from Namecheap, verify clawdfw.com is present,
# and show its DNS records.

require_relative "namecheap"

nc = Namecheap.new

puts "=== Fetching all domains ==="
all_domains = nc.domains
all_domains.each do |d|
  status = d[:is_expired] ? " [EXPIRED]" : ""
  puts "  #{d[:name]}#{status}  (expires: #{d[:expires]})"
end
puts "\nTotal: #{all_domains.size} domains"

# Check for clawdfw.com
target = "clawdfw.com"
found = all_domains.any? { |d| d[:name] == target }
puts "\n#{target} found: #{found ? '✅ YES' : '❌ NO'}"

if found
  puts "\n=== DNS records for #{target} ==="
  records = nc.dns_records(target)
  if records.empty?
    puts "  (no records)"
  else
    records.each do |r|
      puts "  #{r[:type].ljust(8)} #{r[:hostname].ljust(20)} -> #{r[:address]}  (TTL: #{r[:ttl]})"
    end
  end
end
