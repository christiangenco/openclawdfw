#!/usr/bin/env ruby
# Get conversions grouped by UTM campaign
# Requires: Events set up in Fathom dashboard + "Events - Read" API permission

require_relative 'client'
require_relative 'config'
require 'optparse'
require 'date'

options = {
  date_from: (Date.today - 30).to_s,
  date_to: Date.today.to_s
}

OptionParser.new do |opts|
  opts.banner = "Usage: ruby conversions.rb [site_id] [options]"

  opts.on("--from DATE", "Start date (YYYY-MM-DD), default: 30 days ago") do |d|
    options[:date_from] = d
  end

  opts.on("--to DATE", "End date (YYYY-MM-DD), default: today") do |d|
    options[:date_to] = d
  end

  opts.on("--campaign NAME", "Filter by specific campaign") do |c|
    options[:campaign] = c
  end

  opts.on("--source NAME", "Filter by utm_source (e.g., google, facebook)") do |s|
    options[:source] = s
  end

  opts.on("--event-id ID", "Query a specific event ID directly") do |e|
    options[:event_id] = e
  end
end.parse!

site_id = ARGV[0] || SITE_ID
client = Fathom::Client.new

# Try to get events list, or use provided event ID
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
      puts ""
      puts "To find event IDs: In Fathom dashboard, go to Events, click an event,"
      puts "and the ID is in the URL (e.g., app.usefathom.com/event/EVENTID)"
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

puts "Conversions by UTM Campaign (#{options[:date_from]} to #{options[:date_to]})"
puts "=" * 60

events_response['data'].each do |event|
  puts "\nEvent: #{event['name']}"
  puts "-" * 40

  params = {
    entity: 'event',
    entity_id: event['id'],
    aggregates: 'conversions,unique_conversions,value',
    field_grouping: 'utm_campaign,utm_source,utm_medium',
    date_from: "#{options[:date_from]} 00:00:00",
    date_to: "#{options[:date_to]} 23:59:59",
    sort_by: 'conversions:desc',
    limit: 50
  }

  # Add filters if specified
  filters = []
  if options[:campaign]
    filters << { property: 'utm_campaign', operator: 'is', value: options[:campaign] }
  end
  if options[:source]
    filters << { property: 'utm_source', operator: 'is', value: options[:source] }
  end
  params[:filters] = filters.to_json unless filters.empty?

  begin
    response = client.get('aggregations', params)

    if response.empty?
      puts "  No conversions found"
    else
      response.each do |row|
        campaign = row['utm_campaign'] || '(direct)'
        source = row['utm_source'] || '-'
        medium = row['utm_medium'] || '-'
        conversions = row['conversions']
        unique = row['unique_conversions']
        value = row['value'] || 0

        puts "  #{campaign.ljust(25)} #{source.ljust(12)} #{medium.ljust(10)} " \
             "Conv: #{conversions.to_s.rjust(4)}  Unique: #{unique.to_s.rjust(4)}  Value: $#{value}"
      end
    end
  rescue => e
    puts "  Error: #{e.message}"
  end
end
