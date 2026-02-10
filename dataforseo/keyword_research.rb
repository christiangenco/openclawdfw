#!/usr/bin/env ruby

require 'csv'
require './dataforseo'

# =============================================================================
# OpenClaw DFW Keyword Research
# =============================================================================
# Three phases:
#   1. High-Intent (Google Ads candidates)
#   2. Content / SEO (blog post topics)
#   3. Lead Magnet (gated content ideas)
# =============================================================================

KEYWORDS = {
  # ---- PHASE 1: HIGH-INTENT (Google Ads) ----

  "1-product-aware" => [
    "openclaw",
    "openclaw ai",
    "openclaw setup",
    "setup openclaw",
    "openclaw for business",
    "openclaw consultant",
    "openclaw dallas",
    "openclaw dfw",
    "openclaw pricing",
    "openclaw review",
    "openclaw install",
  ],

  "1-high-intent-ai-assistant" => [
    "ai executive assistant",
    "ai assistant for business",
    "hire ai assistant",
    "ai personal assistant for work",
    "ai email assistant",
    "ai calendar assistant",
    "ai assistant setup service",
    "ai assistant for ceo",
    "ai assistant for executives",
    "ai powered executive assistant",
    "ai secretary",
    "ai chief of staff",
    "automated executive assistant",
    "ai business assistant",
    "ai office assistant",
    "ai scheduling assistant",
    "ai assistant that reads email",
    "ai that manages my inbox",
    "ai that schedules meetings",
  ],

  "1-dfw-geo" => [
    "ai consultant dallas",
    "ai automation dallas",
    "ai assistant dallas",
    "ai for business dallas",
    "ai consultant fort worth",
    "business automation dfw",
    "ai services dallas",
    "ai setup dallas",
    "ai consultant dfw",
    "ai implementation dallas",
    "ai agency dallas",
    "dallas ai company",
    "ai solutions dallas tx",
    "ai consulting fort worth",
    "ai automation fort worth",
    "managed ai services dallas",
  ],

  "1-pain-point" => [
    "automate email management",
    "ai email triage",
    "ai meeting scheduling",
    "ai inbox management",
    "virtual assistant alternative",
    "ai vs virtual assistant",
    "replace virtual assistant with ai",
    "too many emails",
    "email overload solution",
    "inbox zero ai",
    "ai email sorting",
    "ai email drafting",
    "automated email responses business",
    "ai follow up emails",
    "ai meeting prep",
    "automate calendar management",
  ],

  "1-industry-specific" => [
    "ai for law firms",
    "ai assistant for lawyers",
    "ai for real estate agents",
    "ai for insurance agency",
    "ai for mortgage company",
    "law firm automation",
    "legal ai assistant",
    "legal ai assistant dallas",
    "ai for personal injury lawyers",
    "ai for law firm management",
    "real estate ai assistant",
    "real estate automation ai",
    "insurance agency automation",
    "mortgage automation ai",
    "ai for small business owners",
    "ai for managing partner",
    "ai for business owner",
    "ai staffing agency",
    "ai employee",
    "ai worker",
  ],

  # ---- PHASE 2: CONTENT / SEO ----

  "2-educational" => [
    "what is openclaw",
    "what is an ai executive assistant",
    "can ai manage my email",
    "ai assistant for small business owners",
    "how does ai executive assistant work",
    "what can ai assistant do",
    "ai assistant capabilities",
    "ai automation explained",
    "ai for business explained",
    "open source ai assistant",
    "self hosted ai assistant",
    "on premise ai assistant",
    "private ai assistant",
  ],

  "2-how-to" => [
    "how to automate email with ai",
    "how to use ai in my business",
    "how to set up ai assistant",
    "ai automation for beginners",
    "how to save time with ai",
    "how to automate my inbox",
    "how to use ai at work",
    "how to implement ai in small business",
    "getting started with ai business",
    "ai workflow automation",
    "how to automate business tasks with ai",
    "how to delegate to ai",
  ],

  "2-comparison" => [
    "best ai assistant for business 2025",
    "best ai assistant for business 2026",
    "ai assistant comparison",
    "openclaw alternatives",
    "ai personal assistant vs virtual assistant",
    "chatgpt vs ai executive assistant",
    "openclaw vs chatgpt",
    "best ai for email management",
    "best ai for scheduling",
    "ai assistant tools for business",
    "top ai assistants for executives",
    "claude ai vs chatgpt for business",
    "ai assistant for business comparison",
  ],

  "2-security-objections" => [
    "is ai assistant safe",
    "ai assistant security",
    "ai reading my email safe",
    "ai data privacy business",
    "ai security for business",
    "is it safe to give ai access to email",
    "ai assistant data protection",
    "on premise ai vs cloud ai security",
    "self hosted ai security",
    "ai compliance business",
    "ai hipaa compliance",
    "ai for business security risks",
  ],

  # ---- PHASE 3: LEAD MAGNET ----

  "3-lead-magnet-ideas" => [
    "ai tools for business owners",
    "best ai tools 2025",
    "best ai tools 2026",
    "ai productivity tips",
    "ai use cases for small business",
    "tasks to automate with ai",
    "ai executive assistant use cases",
    "ai for ceo",
    "ai for founders",
    "ai implementation checklist",
    "ai readiness assessment",
    "ai roi calculator",
    "ai automation ideas for business",
    "ai time saving tips",
    "things ai can do for business",
    "ai business workflow ideas",
    "business tasks to give to ai",
    "ai assistant prompt templates",
    "how to talk to ai assistant",
    "ai onboarding checklist",
    "ai productivity hacks",
    "business ai checklist",
  ],
}

# Flatten all keywords
all_keywords = KEYWORDS.values.flatten.uniq
puts "Total unique keywords: #{all_keywords.length}"
puts ""

# Process in batches of 100
results = {}
batch_size = 100
batches = all_keywords.each_slice(batch_size).to_a

batches.each_with_index do |batch, i|
  puts "Batch #{i + 1}/#{batches.length}: Fetching #{batch.length} keywords..."
  begin
    batch_results = DataForSEO.get_keywords_batch_metrics(batch)
    results.merge!(batch_results)
    cached = batch_results.values.first&.[]('cached') ? " (cached)" : ""
    puts "  ✓ Got data for #{batch_results.length} keywords#{cached}"
  rescue StandardError => e
    puts "  ✗ Error: #{e.message}"
  end
end

# Build output rows with category tags
rows = []
KEYWORDS.each do |category, keywords|
  phase = category.split("-").first
  phase_label = case phase
                when "1" then "High-Intent (Ads)"
                when "2" then "Content / SEO"
                when "3" then "Lead Magnet"
                end
  subcategory = category.sub(/^\d-/, "")

  keywords.each do |kw|
    data = results[kw]
    next unless data
    rows << {
      keyword: kw,
      phase: phase_label,
      subcategory: subcategory,
      volume: data['volume'],
      difficulty: data['difficulty'],
      cpc: data['cpc'].to_f.round(2),
    }
  end
end

# Write full CSV (all keywords, sorted by phase then volume desc)
output_path = "keyword_research_results.csv"
rows_sorted = rows.sort_by { |r| [-r[:volume]] }

CSV.open(output_path, "w") do |csv|
  csv << ["keyword", "phase", "subcategory", "volume", "difficulty", "cpc"]
  rows_sorted.each do |r|
    csv << [r[:keyword], r[:phase], r[:subcategory], r[:volume], r[:difficulty], r[:cpc]]
  end
end

puts ""
puts "=" * 80
puts "Wrote #{rows_sorted.length} rows to #{output_path}"
puts "=" * 80

# ---- SUMMARY REPORTS ----

puts ""
puts "=" * 80
puts "TOP 20 KEYWORDS BY SEARCH VOLUME"
puts "=" * 80
puts ""
puts "%-45s %8s %6s %8s  %s" % ["Keyword", "Volume", "Diff", "CPC", "Phase"]
puts "-" * 90
rows_sorted.first(20).each do |r|
  puts "%-45s %8d %6d $%6.2f  %s" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc], r[:phase]]
end

puts ""
puts "=" * 80
puts "TOP 20 GOOGLE ADS CANDIDATES (Phase 1, sorted by CPC × Volume)"
puts "=" * 80
puts ""
ads_candidates = rows.select { |r| r[:phase] == "High-Intent (Ads)" && r[:volume] > 0 }
  .sort_by { |r| -(r[:cpc] * r[:volume]) }
puts "%-45s %8s %6s %8s %10s" % ["Keyword", "Volume", "Diff", "CPC", "CPC×Vol"]
puts "-" * 90
ads_candidates.first(20).each do |r|
  puts "%-45s %8d %6d $%6.2f %10d" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc], (r[:cpc] * r[:volume]).round]
end

puts ""
puts "=" * 80
puts "BEST CONTENT OPPORTUNITIES (Phase 2, difficulty < 50, sorted by volume)"
puts "=" * 80
puts ""
content_opps = rows.select { |r| r[:phase] == "Content / SEO" && r[:difficulty] < 50 && r[:volume] > 0 }
  .sort_by { |r| -r[:volume] }
puts "%-45s %8s %6s %8s" % ["Keyword", "Volume", "Diff", "CPC"]
puts "-" * 75
content_opps.first(20).each do |r|
  puts "%-45s %8d %6d $%6.2f" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc]]
end

puts ""
puts "=" * 80
puts "LEAD MAGNET KEYWORDS (Phase 3, sorted by volume)"
puts "=" * 80
puts ""
lead_magnet = rows.select { |r| r[:phase] == "Lead Magnet" && r[:volume] > 0 }
  .sort_by { |r| -r[:volume] }
puts "%-45s %8s %6s %8s" % ["Keyword", "Volume", "Diff", "CPC"]
puts "-" * 75
lead_magnet.first(20).each do |r|
  puts "%-45s %8d %6d $%6.2f" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc]]
end

puts ""
puts "=" * 80
puts "DFW GEO KEYWORDS (local intent)"
puts "=" * 80
puts ""
geo = rows.select { |r| r[:subcategory] == "dfw-geo" }
  .sort_by { |r| -r[:volume] }
puts "%-45s %8s %6s %8s" % ["Keyword", "Volume", "Diff", "CPC"]
puts "-" * 75
geo.each do |r|
  puts "%-45s %8d %6d $%6.2f" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc]]
end

puts ""
puts "=" * 80
puts "INDUSTRY-SPECIFIC KEYWORDS (sorted by volume)"
puts "=" * 80
puts ""
industry = rows.select { |r| r[:subcategory] == "industry-specific" }
  .sort_by { |r| -r[:volume] }
puts "%-45s %8s %6s %8s" % ["Keyword", "Volume", "Diff", "CPC"]
puts "-" * 75
industry.each do |r|
  puts "%-45s %8d %6d $%6.2f" % [r[:keyword], r[:volume], r[:difficulty], r[:cpc]]
end

puts ""
puts "=" * 80
puts "ZERO-VOLUME KEYWORDS (niche / too new to register)"
puts "=" * 80
puts ""
zeros = rows.select { |r| r[:volume] == 0 }.sort_by { |r| r[:keyword] }
zeros.each { |r| puts "  #{r[:keyword]}  (#{r[:subcategory]})" }
puts "  Total: #{zeros.length} keywords with zero volume"

puts ""
puts "Full data: #{output_path}"
