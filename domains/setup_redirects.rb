#!/usr/bin/env ruby
# Set up 301 redirects from all alias domains to the primary domain.

require_relative "namecheap"

PRIMARY = "https://openclawdfw.com"

ALIAS_DOMAINS = %w[
  clawdallas.com
  clawdfw.com
  dfwclaw.com
  openclawdallas.com
  openclawtx.com
  setupclawdallas.com
  setupclawdfw.com
]

nc = Namecheap.new

ALIAS_DOMAINS.each do |domain|
  puts "Setting up 301 redirect: #{domain} → #{PRIMARY}"

  records = [
    { hostname: "@",   type: "URL301", address: "#{PRIMARY}/", mx_pref: "10", ttl: "1800" },
    { hostname: "www", type: "URL301", address: "#{PRIMARY}/", mx_pref: "10", ttl: "1800" },
  ]

  begin
    nc.set_dns_records(domain, records)
    puts "  ✅ Done"
  rescue => e
    puts "  ❌ Error: #{e.message}"
  end
end

puts "\nVerifying redirects..."
ALIAS_DOMAINS.each do |domain|
  records = nc.dns_records(domain)
  redirects = records.select { |r| r[:type] == "URL301" }
  if redirects.size == 2
    puts "  ✅ #{domain} — #{redirects.size} URL301 records"
  else
    puts "  ⚠️  #{domain} — expected 2 URL301 records, got #{redirects.size}"
    records.each { |r| puts "      #{r[:type]} #{r[:hostname]} → #{r[:address]}" }
  end
end
