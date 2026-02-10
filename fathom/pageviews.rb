#!/usr/bin/env ruby
# Get pageview stats grouped by UTM campaign

require_relative 'client'
require_relative 'config'
require 'optparse'
require 'date'

options = {
  date_from: (Date.today - 30).to_s,
  date_to: Date.today.to_s
}

OptionParser.new do |opts|
  opts.banner = "Usage: ruby pageviews.rb [site_id] [options]"

  opts.on("--from DATE", "Start date (YYYY-MM-DD), default: 30 days ago") do |d|
    options[:date_from] = d
  end

  opts.on("--to DATE", "End date (YYYY-MM-DD), default: today") do |d|
    options[:date_to] = d
  end

  opts.on("--by FIELD", "Group by field (default: utm_campaign)") do |f|
    options[:group_by] = f
  end
end.parse!

site_id = ARGV[0] || SITE_ID

client = Fathom::Client.new
group_by = options[:group_by] || 'utm_campaign'

puts "Pageviews by #{group_by} (#{options[:date_from]} to #{options[:date_to]})"
puts "=" * 60

params = {
  entity: 'pageview',
  entity_id: site_id,
  aggregates: 'pageviews,visits,uniques,bounce_rate,avg_duration',
  field_grouping: group_by,
  date_from: "#{options[:date_from]} 00:00:00",
  date_to: "#{options[:date_to]} 23:59:59",
  sort_by: 'pageviews:desc',
  limit: 50
}

begin
  response = client.get('aggregations', params)

  if response.empty?
    puts "No data found"
    exit
  end

  puts ""
  puts "#{'Value'.ljust(30)} #{'Views'.rjust(8)} #{'Visits'.rjust(8)} #{'Uniques'.rjust(8)} #{'Bounce'.rjust(8)}"
  puts "-" * 70

  response.each do |row|
    value = row[group_by] || '(none)'
    value = value[0..28] + '..' if value.length > 30

    pageviews = row['pageviews']
    visits = row['visits']
    uniques = row['uniques']
    bounce = row['bounce_rate'] ? "#{(row['bounce_rate'] * 100).round}%" : '-'

    puts "#{value.ljust(30)} #{pageviews.to_s.rjust(8)} #{visits.to_s.rjust(8)} " \
         "#{uniques.to_s.rjust(8)} #{bounce.rjust(8)}"
  end

rescue => e
  puts "Error: #{e.message}"
end
