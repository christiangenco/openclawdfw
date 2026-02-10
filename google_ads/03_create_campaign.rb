#!/usr/bin/env ruby
# Creates a Google Ads search campaign geo-fenced to DFW.
# ⚠️  Requires Basic Access (not Explorer). Apply at:
#     https://developers.google.com/google-ads/api/docs/access-levels
#
# Usage:
#   ruby google_ads/03_create_campaign.rb
#
# This creates:
#   1. A campaign budget ($50/day default)
#   2. A search campaign
#   3. DFW geo-targeting (Dallas-Ft. Worth DMA, geo ID 200623)
#   4. An ad group
#   5. Keywords and a responsive search ad
#
# Everything is created in PAUSED state so nothing spends until you enable it.

require "dotenv/load"
require "google/ads/google_ads"

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

# ─── Configuration ───────────────────────────────────────────────────────────
CAMPAIGN_NAME   = "SetupClaw DFW - Search"
DAILY_BUDGET    = 50_00  # $50.00 in micros-friendly cents (will be converted)
DFW_GEO_ID      = 200623  # Dallas-Ft. Worth DMA
AD_GROUP_NAME   = "AI Executive Assistant - DFW"

KEYWORDS = [
  "AI executive assistant",
  "OpenClaw setup",
  "AI email assistant for executives",
  "executive AI assistant Dallas",
  "AI chief of staff",
  "automate executive email",
  "AI calendar assistant",
  "OpenClaw consultant",
]

HEADLINES = [
  "AI Executive Assistant Setup",
  "OpenClaw for Your Team",
  "White-Glove AI Deployment",
  "Your AI Chief of Staff",
  "In-Person Setup in DFW",
  "Manage Email & Calendar w/ AI",
  "Trusted by Founders",
  "14-Day Hypercare Included",
  "Runs on Your Hardware",
  "Book a Free Consultation",
  "AI That Works For You",
  "Setup in Under a Week",
  "From $1,200 Remote Setup",
  "In-Person DFW: $2,400",
  "Secure & Private AI",
]

DESCRIPTIONS = [
  "We deploy & maintain OpenClaw, the open-source AI exec assistant. In-person setup in DFW. Book a call today.",
  "White-glove AI assistant deployment for founders & exec teams. Email, calendar, workflows — handled.",
  "Secure, on-premise AI assistant setup. 14-day hypercare via Slack. Trusted by exec teams across DFW.",
  "Stop drowning in email. Get an AI executive assistant deployed on your hardware in under a week.",
]
# ─────────────────────────────────────────────────────────────────────────────

puts "🚀 Creating SetupClaw DFW campaign...\n\n"

# Step 1: Create budget
puts "1️⃣  Creating campaign budget ($#{DAILY_BUDGET / 100}/day)..."
budget_operation = client.operation.create_resource.campaign_budget do |budget|
  budget.name                   = "#{CAMPAIGN_NAME} Budget"
  budget.amount_micros          = DAILY_BUDGET * 10_000  # cents to micros
  budget.delivery_method        = :STANDARD
  budget.explicitly_shared      = false
end

budget_response = client.service.campaign_budget.mutate_campaign_budgets(
  customer_id: customer_id,
  operations:  [budget_operation]
)
budget_resource = budget_response.results.first.resource_name
puts "   ✅ #{budget_resource}"

# Step 2: Create campaign (PAUSED)
puts "2️⃣  Creating campaign '#{CAMPAIGN_NAME}' (PAUSED)..."
campaign_operation = client.operation.create_resource.campaign do |c|
  c.name                        = CAMPAIGN_NAME
  c.advertising_channel_type    = :SEARCH
  c.status                      = :PAUSED
  c.campaign_budget             = budget_resource
  c.network_settings = client.resource.network_settings do |ns|
    ns.target_google_search         = true
    ns.target_search_network        = true
    ns.target_content_network       = false
    ns.target_partner_search_network = false
  end
  c.start_date = Time.now.strftime("%Y-%m-%d")
end

campaign_response = client.service.campaign.mutate_campaigns(
  customer_id: customer_id,
  operations:  [campaign_operation]
)
campaign_resource = campaign_response.results.first.resource_name
puts "   ✅ #{campaign_resource}"

# Step 3: Geo-target to DFW DMA
puts "3️⃣  Adding DFW geo-targeting (DMA #{DFW_GEO_ID})..."
geo_operation = client.operation.create_resource.campaign_criterion do |cc|
  cc.campaign = campaign_resource
  cc.location = client.resource.location_info do |loc|
    loc.geo_target_constant = client.path.geo_target_constant(DFW_GEO_ID)
  end
end

client.service.campaign_criterion.mutate_campaign_criteria(
  customer_id: customer_id,
  operations:  [geo_operation]
)
puts "   ✅ DFW geo-fence applied"

# Step 4: Create ad group
puts "4️⃣  Creating ad group '#{AD_GROUP_NAME}'..."
ad_group_operation = client.operation.create_resource.ad_group do |ag|
  ag.name       = AD_GROUP_NAME
  ag.campaign   = campaign_resource
  ag.status     = :PAUSED
  ag.type       = :SEARCH_STANDARD
  ag.cpc_bid_micros = 5_000_000  # $5 max CPC
end

ad_group_response = client.service.ad_group.mutate_ad_groups(
  customer_id: customer_id,
  operations:  [ad_group_operation]
)
ad_group_resource = ad_group_response.results.first.resource_name
puts "   ✅ #{ad_group_resource}"

# Step 5: Add keywords
puts "5️⃣  Adding #{KEYWORDS.length} keywords..."
keyword_operations = KEYWORDS.map do |kw|
  client.operation.create_resource.ad_group_criterion do |agc|
    agc.ad_group = ad_group_resource
    agc.keyword  = client.resource.keyword_info do |ki|
      ki.text       = kw
      ki.match_type = :PHRASE
    end
  end
end

client.service.ad_group_criterion.mutate_ad_group_criteria(
  customer_id: customer_id,
  operations:  keyword_operations
)
puts "   ✅ #{KEYWORDS.length} keywords added (phrase match)"

# Step 6: Create responsive search ad
puts "6️⃣  Creating responsive search ad..."
ad_operation = client.operation.create_resource.ad_group_ad do |aga|
  aga.ad_group = ad_group_resource
  aga.status   = :PAUSED
  aga.ad = client.resource.ad do |ad|
    ad.final_urls << "https://setupclaw.com"  # Update with your actual URL
    ad.responsive_search_ad = client.resource.responsive_search_ad_info do |rsa|
      HEADLINES.each do |h|
        rsa.headlines << client.resource.ad_text_asset { |t| t.text = h }
      end
      DESCRIPTIONS.each do |d|
        rsa.descriptions << client.resource.ad_text_asset { |t| t.text = d }
      end
    end
  end
end

client.service.ad_group_ad.mutate_ad_group_ads(
  customer_id: customer_id,
  operations:  [ad_operation]
)
puts "   ✅ Responsive search ad created"

puts <<~DONE

  ══════════════════════════════════════════════
  ✅ Campaign created successfully!

  Campaign:  #{CAMPAIGN_NAME}
  Status:    PAUSED (nothing will spend yet)
  Geo:       Dallas-Ft. Worth DMA
  Budget:    $#{DAILY_BUDGET / 100}/day
  Keywords:  #{KEYWORDS.length} (phrase match)
  Max CPC:   $5.00

  👉 To go live:
     1. Review in Google Ads UI
     2. Update the final URL to your landing page
     3. Enable the campaign and ad group
  ══════════════════════════════════════════════
DONE
