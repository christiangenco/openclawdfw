#!/usr/bin/env ruby
# Set up Mailgun DNS records for openclawdfw.com while preserving existing records.

require_relative "namecheap"

DOMAIN = "openclawdfw.com"

nc = Namecheap.new

puts "Fetching existing DNS records for #{DOMAIN}..."
existing = nc.dns_records(DOMAIN)
puts "\nExisting records:"
existing.each do |r|
  puts "  #{r[:type].ljust(8)} #{r[:hostname].ljust(25)} → #{r[:address]}  (TTL: #{r[:ttl]})"
end

# Start with existing A and CNAME records (preserve them)
records = existing.select { |r| %w[A CNAME].include?(r[:type]) }.map do |r|
  { hostname: r[:hostname], type: r[:type], address: r[:address], ttl: r[:ttl] }
end

puts "\nPreserving #{records.length} A/CNAME records..."

# Add Mailgun records
mailgun_records = [
  # SPF record for sending
  { hostname: "@", type: "TXT", address: "v=spf1 include:mailgun.org ~all", ttl: "1800" },

  # DKIM record
  { hostname: "mx._domainkey", type: "TXT", address: "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6q0CTFTugrsud1mh2bUjCiALW9WDGrIznk47sDi5bNd5xhANKqlK8RNdVCFf6UqQj9SQCJJmI9xE4F15wi2d1ZjwfNoy5dNbNXS01A6viG9ZbuYrk1gT8vh+O8LcjLm229yA/V6944JQgkZTlwJEBO6zoguOAU0ZfjT3J8LZ+2wIDAQAB", ttl: "1800" },

  # MX records for receiving
  { hostname: "@", type: "MX", address: "mxa.mailgun.org.", mx_pref: "10", ttl: "1800" },
  { hostname: "@", type: "MX", address: "mxb.mailgun.org.", mx_pref: "10", ttl: "1800" },

  # CNAME for tracking (opens, clicks, unsubscribes)
  { hostname: "email", type: "CNAME", address: "mailgun.org.", ttl: "1800" },

  # DMARC record
  { hostname: "_dmarc", type: "TXT", address: "v=DMARC1; p=none; pct=100; fo=1; ri=3600; rua=mailto:d46e0f73@dmarc.mailgun.org,mailto:4c88d8c2@inbox.ondmarc.com; ruf=mailto:d46e0f73@dmarc.mailgun.org,mailto:4c88d8c2@inbox.ondmarc.com;", ttl: "1800" },
]

records.concat(mailgun_records)

puts "\nSetting #{records.length} total DNS records for #{DOMAIN}..."
records.each do |r|
  mx = r[:mx_pref] ? " (MX: #{r[:mx_pref]})" : ""
  puts "  #{r[:type].ljust(8)} #{r[:hostname].ljust(25)} → #{r[:address][0..50]}...#{mx}"
end

print "\nProceed? [y/N] "
exit unless gets.strip.downcase == "y"

nc.set_dns_records(DOMAIN, records)
puts "\nRecords set successfully!"

puts "\nVerifying..."
nc.dns_records(DOMAIN).each do |r|
  puts "  #{r[:type].ljust(8)} #{r[:hostname].ljust(25)} → #{r[:address][0..50]}  (TTL: #{r[:ttl]})"
end
