#!/usr/bin/env ruby
# Manage ad spend tracking (stored locally in spend.yml)

require 'yaml'
require 'date'
require 'optparse'

SPEND_FILE = File.expand_path('../spend.yml', __FILE__)

def load_spend
  return {} unless File.exist?(SPEND_FILE)
  YAML.load_file(SPEND_FILE) || {}
end

def save_spend(data)
  File.write(SPEND_FILE, data.to_yaml)
end

def add_spend(campaign:, source:, amount:, date:, notes: nil)
  data = load_spend
  data['campaigns'] ||= {}
  data['campaigns'][campaign] ||= { 'entries' => [] }

  entry = {
    'date' => date,
    'source' => source,
    'amount' => amount.to_f,
    'notes' => notes
  }

  data['campaigns'][campaign]['entries'] << entry
  save_spend(data)
  puts "Added $#{amount} spend to '#{campaign}' (#{source}) on #{date}"
end

def list_spend(campaign: nil, from: nil, to: nil)
  data = load_spend

  if data['campaigns'].nil? || data['campaigns'].empty?
    puts "No spend data recorded yet."
    puts "Use: ruby spend.rb add --campaign NAME --source google --amount 100"
    return
  end

  from_date = from ? Date.parse(from) : Date.new(1970, 1, 1)
  to_date = to ? Date.parse(to) : Date.today

  puts "Ad Spend Summary"
  puts "=" * 60

  total_all = 0

  campaigns = campaign ? { campaign => data['campaigns'][campaign] } : data['campaigns']

  campaigns.each do |name, info|
    next unless info

    entries = info['entries'].select do |e|
      d = Date.parse(e['date'])
      d >= from_date && d <= to_date
    end

    next if entries.empty?

    total = entries.sum { |e| e['amount'] }
    total_all += total

    puts "\n#{name}"
    puts "-" * 40

    by_source = entries.group_by { |e| e['source'] }
    by_source.each do |source, source_entries|
      source_total = source_entries.sum { |e| e['amount'] }
      puts "  #{source.ljust(15)} $#{format('%.2f', source_total)}"
    end

    puts "  #{'Total'.ljust(15)} $#{format('%.2f', total)}"
  end

  puts "\n" + "=" * 60
  puts "TOTAL SPEND: $#{format('%.2f', total_all)}"
end

def export_for_cac(from: nil, to: nil)
  data = load_spend
  return {} if data['campaigns'].nil?

  from_date = from ? Date.parse(from) : Date.new(1970, 1, 1)
  to_date = to ? Date.parse(to) : Date.today

  result = {}

  data['campaigns'].each do |campaign, info|
    entries = info['entries'].select do |e|
      d = Date.parse(e['date'])
      d >= from_date && d <= to_date
    end

    by_source = entries.group_by { |e| e['source'] }
    by_source.each do |source, source_entries|
      key = "#{campaign}|#{source}"
      result[key] = source_entries.sum { |e| e['amount'] }
    end

    # Also aggregate by campaign only
    result[campaign] = entries.sum { |e| e['amount'] }
  end

  result
end

# CLI
command = ARGV.shift

case command
when 'add'
  options = {}
  OptionParser.new do |opts|
    opts.on("--campaign NAME", "Campaign name (should match utm_campaign)") { |v| options[:campaign] = v }
    opts.on("--source NAME", "Ad source (google, facebook, etc)") { |v| options[:source] = v }
    opts.on("--amount N", Float, "Amount spent") { |v| options[:amount] = v }
    opts.on("--date DATE", "Date (YYYY-MM-DD), default: today") { |v| options[:date] = v }
    opts.on("--notes TEXT", "Optional notes") { |v| options[:notes] = v }
  end.parse!

  unless options[:campaign] && options[:source] && options[:amount]
    puts "Usage: ruby spend.rb add --campaign NAME --source google --amount 100"
    exit 1
  end

  options[:date] ||= Date.today.to_s
  add_spend(**options)

when 'list'
  options = {}
  OptionParser.new do |opts|
    opts.on("--campaign NAME", "Filter by campaign") { |v| options[:campaign] = v }
    opts.on("--from DATE", "Start date") { |v| options[:from] = v }
    opts.on("--to DATE", "End date") { |v| options[:to] = v }
  end.parse!

  list_spend(**options)

when 'export'
  # Used internally by cac.rb
  options = {}
  OptionParser.new do |opts|
    opts.on("--from DATE", "Start date") { |v| options[:from] = v }
    opts.on("--to DATE", "End date") { |v| options[:to] = v }
  end.parse!

  puts export_for_cac(**options).to_json

else
  puts "Ad Spend Tracker"
  puts "================"
  puts ""
  puts "Commands:"
  puts "  ruby spend.rb add --campaign NAME --source google --amount 100"
  puts "  ruby spend.rb list [--campaign NAME] [--from DATE] [--to DATE]"
  puts ""
  puts "The --campaign value should match your utm_campaign parameter"
  puts "so CAC calculations can match spend to conversions."
end
