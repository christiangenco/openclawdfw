#!/usr/bin/env ruby
# Set up DNS records for the primary domain (openclawdfw.com) pointing to Vercel.

require_relative "namecheap"

DOMAIN = "openclawdfw.com"

nc = Namecheap.new

puts "Setting up Vercel DNS for #{DOMAIN}..."

records = [
  { hostname: "@",   type: "A",     address: "216.150.1.1",                          ttl: "1800" },
  { hostname: "www", type: "CNAME", address: "6970489b434355ed.vercel-dns-016.com.", ttl: "1800" },
]

nc.set_dns_records(DOMAIN, records)
puts "✅ Records set"

puts "\nVerifying..."
nc.dns_records(DOMAIN).each do |r|
  puts "  #{r[:type].ljust(8)} #{r[:hostname].ljust(20)} → #{r[:address]}  (TTL: #{r[:ttl]})"
end
