#!/usr/bin/env ruby
# List all Fathom sites and their IDs
# Note: Requires "Sites - Read" permission on your API token

require_relative 'client'

client = Fathom::Client.new

begin
  response = client.get('sites')

  puts "Your Fathom Sites:"
  puts "-" * 50

  response['data'].each do |site|
    puts "ID: #{site['id'].ljust(10)} Name: #{site['name']}"
  end
rescue => e
  if e.message.include?("permission")
    puts "Your API token doesn't have permission to list sites."
    puts "If you know your site ID, use it directly with other scripts."
    puts ""
    puts "Or create a new token at https://app.usefathom.com/api with 'Sites - Read' permission."
  else
    raise
  end
end
