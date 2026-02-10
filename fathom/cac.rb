#!/usr/bin/env ruby
# Calculate Customer Acquisition Cost by campaign

require_relative 'client'
require_relative 'config'
require 'yaml'
require 'date'
require 'optparse'

SPEND_FILE = File.expand_path('../spend.yml', __FILE__)

options = {
  date_from: (Date.today - 30).to_s,
  date_to: Date.today.to_s
}

OptionParser.new do |opts|
  opts.banner = "Usage: ruby cac.rb [site_id] [options]"

  opts.on("--from DATE", "Start date (YYYY-MM-DD), default: 30 days ago") do |d|
    options[:date_from] = d
  end

  opts.on("--to DATE", "End date (YYYY-MM-DD), default: today") do |d|
    options[:date_to] = d
  end

  opts.on("--event NAME", "Filter by specific event name") do |e|
    options[:event_name] = e
  end

  opts.on("--event-id ID", "Query a specific event ID directly") do |e|
    options[:event_id] = e
  end
end.parse!

site_id = ARGV[0] || SITE_ID

# Load spend data
def load_spend(from, to)
  return {} unless File.exist?(SPEND_FILE)

  data = YAML.load_file(SPEND_FILE) || {}
  return {} unless data['campaigns']

  from_date = Date.parse(from)
  to_date = Date.parse(to)

  result = {}

  data['campaigns'].each do |campaign, info|
    entries = info['entries'].select do |e|
      d = Date.parse(e['date'])
      d >= from_date && d <= to_date
    end

    result[campaign] = entries.sum { |e| e['amount'] }
  end

  result
end

client = Fathom::Client.new
spend_by_campaign = load_spend(options[:date_from], options[:date_to])

if spend_by_campaign.empty?
  puts "No spend data found for this period."
  puts "Use 'ruby spend.rb add --campaign NAME --source google --amount 100' to add spend."
  puts ""
end

# Get events
events = []
if options[:event_id]
  events = [{ 'id' => options[:event_id], 'name' => options[:event_id] }]
else
  begin
    events_response = client.get('events', site_id: site_id)
    events = events_response['data'] || []
  rescue => e
    if e.message.include?("permission") || e.message.include?("404")
      puts "Cannot list events (API token may lack 'Events - Read' permission)."
      puts ""
      puts "Options:"
      puts "1. Add 'Events - Read' permission to your API token"
      puts "2. Get the event ID from your Fathom dashboard and use: --event-id EVENTID"
      exit 1
    else
      raise
    end
  end
end

if events.empty?
  puts "No events found for site #{site_id}."
  puts "Set up conversion events in your Fathom dashboard first."
  exit 1
end

if options[:event_name]
  events = events.select { |e| e['name'] == options[:event_name] }
end

puts ""
puts "Customer Acquisition Cost Report"
puts "Period: #{options[:date_from]} to #{options[:date_to]}"
puts "=" * 70

events.each do |event|
  puts "\nEvent: #{event['name']}"
  puts "-" * 50

  params = {
    entity: 'event',
    entity_id: event['id'],
    aggregates: 'conversions,unique_conversions,value',
    field_grouping: 'utm_campaign',
    date_from: "#{options[:date_from]} 00:00:00",
    date_to: "#{options[:date_to]} 23:59:59",
    sort_by: 'conversions:desc',
    limit: 50
  }

  begin
    response = client.get('aggregations', params)

    if response.empty?
      puts "  No conversions found"
      next
    end

    puts ""
    puts "  #{'Campaign'.ljust(25)} #{'Conv'.rjust(6)} #{'Spend'.rjust(10)} #{'CAC'.rjust(10)}"
    puts "  " + "-" * 55

    total_conversions = 0
    total_spend = 0

    response.each do |row|
      campaign = row['utm_campaign'] || '(direct)'
      conversions = row['conversions'].to_i
      unique = row['unique_conversions'].to_i

      spend = spend_by_campaign[campaign] || 0
      cac = conversions > 0 && spend > 0 ? spend / conversions.to_f : nil

      total_conversions += conversions
      total_spend += spend

      cac_str = cac ? "$#{format('%.2f', cac)}" : (spend > 0 ? 'N/A' : 'No spend')

      puts "  #{campaign.ljust(25)} #{conversions.to_s.rjust(6)} " \
           "#{spend > 0 ? "$#{format('%.2f', spend).rjust(9)}" : '-'.rjust(10)} " \
           "#{cac_str.rjust(10)}"
    end

    # Show campaigns with spend but no conversions
    spend_by_campaign.each do |campaign, spend|
      next if response.any? { |r| r['utm_campaign'] == campaign }
      next if spend <= 0

      total_spend += spend
      puts "  #{campaign.ljust(25)} #{'0'.rjust(6)} " \
           "$#{format('%.2f', spend).rjust(9)} " \
           "{'No conv'.rjust(10)}"
    end

    puts "  " + "-" * 55
    overall_cac = total_conversions > 0 && total_spend > 0 ? total_spend / total_conversions.to_f : nil
    overall_cac_str = overall_cac ? "$#{format('%.2f', overall_cac)}" : 'N/A'

    puts "  #{'TOTAL'.ljust(25)} #{total_conversions.to_s.rjust(6)} " \
         "#{total_spend > 0 ? "$#{format('%.2f', total_spend).rjust(9)}" : '-'.rjust(10)} " \
         "#{overall_cac_str.rjust(10)}"

  rescue => e
    puts "  Error: #{e.message}"
  end
end

puts "\n"
puts "Tip: Make sure your utm_campaign values in ads match campaign names in spend.yml"
