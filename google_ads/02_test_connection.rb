#!/usr/bin/env ruby
# Tests your Google Ads API connection by listing accessible accounts.
# Works with Explorer Access (read-only).

require "dotenv/load"
require "google/ads/google_ads"

# Validate required env vars
%w[GOOGLE_ADS_TOKEN GOOGLE_ADS_CLIENT_ID GOOGLE_ADS_CLIENT_SECRET GOOGLE_ADS_REFRESH_TOKEN GOOGLE_ADS_CUSTOMER_ID].each do |var|
  ENV.fetch(var) { abort "❌ Missing #{var} in .env" }
end

client = Google::Ads::GoogleAds::GoogleAdsClient.new do |config|
  config.developer_token    = ENV["GOOGLE_ADS_TOKEN"]
  config.client_id          = ENV["GOOGLE_ADS_CLIENT_ID"]
  config.client_secret      = ENV["GOOGLE_ADS_CLIENT_SECRET"]
  config.refresh_token      = ENV["GOOGLE_ADS_REFRESH_TOKEN"]
  config.login_customer_id  = ENV["GOOGLE_ADS_CUSTOMER_ID"]
end

customer_id = ENV["GOOGLE_ADS_CUSTOMER_ID"]

puts "🔍 Testing connection to Google Ads API..."
puts "   Customer ID: #{customer_id}"
puts

# Query basic account info
query = <<~GAQL
  SELECT
    customer.id,
    customer.descriptive_name,
    customer.currency_code,
    customer.time_zone
  FROM customer
  LIMIT 1
GAQL

begin
  responses = client.service.google_ads.search(customer_id: customer_id, query: query)

  responses.each do |row|
    c = row.customer
    puts "✅ Connection successful!"
    puts
    puts "   Account ID:   #{c.id}"
    puts "   Account Name: #{c.descriptive_name}"
    puts "   Currency:     #{c.currency_code}"
    puts "   Time Zone:    #{c.time_zone}"
  end
rescue Google::Ads::GoogleAds::Errors::GoogleAdsError => e
  puts "❌ Google Ads API error:"
  e.failure.errors.each do |error|
    puts "   #{error.error_code.to_h}: #{error.message}"
  end
  exit 1
rescue => e
  puts "❌ Error: #{e.message}"
  puts e.backtrace.first(5).map { |l| "   #{l}" }.join("\n")
  exit 1
end

# Also list any accessible campaigns
puts
puts "📋 Existing campaigns:"
puts

campaign_query = <<~GAQL
  SELECT
    campaign.id,
    campaign.name,
    campaign.status,
    campaign.advertising_channel_type
  FROM campaign
  ORDER BY campaign.id
  LIMIT 20
GAQL

begin
  responses = client.service.google_ads.search(customer_id: customer_id, query: campaign_query)

  count = 0
  responses.each do |row|
    c = row.campaign
    puts "   [#{c.status}] #{c.name} (ID: #{c.id}, Type: #{c.advertising_channel_type})"
    count += 1
  end

  puts "   (no campaigns found)" if count == 0
rescue Google::Ads::GoogleAds::Errors::GoogleAdsError => e
  puts "   ⚠️  Could not list campaigns: #{e.failure.errors.first.message}"
end

puts
puts "✅ All checks passed. Your API credentials are working."
