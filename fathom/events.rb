#!/usr/bin/env ruby
# List all events for a site
# Requires: "Events - Read" API permission

require_relative 'client'
require_relative 'config'

site_id = ARGV[0] || SITE_ID
client = Fathom::Client.new

puts "Events for site #{site_id}:"
puts "-" * 50

begin
  events_response = client.get('events', site_id: site_id)

  if events_response['data'].empty?
    puts "No events found. Set up conversion events in your Fathom dashboard."
  else
    events_response['data'].each do |event|
      puts "ID: #{event['id'].ljust(10)} Name: #{event['name']}"
    end
  end
rescue => e
  if e.message.include?("permission") || e.message.include?("404")
    puts "Cannot list events."
    puts ""
    puts "Your API token may need 'Events - Read' permission."
    puts "Update your token at: https://app.usefathom.com/api"
  else
    raise
  end
end
