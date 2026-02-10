#!/usr/bin/env ruby
# frozen_string_literal: true

# Calendly API v2 client for managing event types (booking links).
#
# Usage:
#   ruby calendly_api.rb list                              # List all event types
#   ruby calendly_api.rb list --active                     # List only active event types
#   ruby calendly_api.rb get <uuid>                        # Get a single event type
#   ruby calendly_api.rb create <name> [options]           # Create a new event type
#   ruby calendly_api.rb update <uuid> [options]           # Update an event type
#   ruby calendly_api.rb activate <uuid>                   # Activate an event type
#   ruby calendly_api.rb deactivate <uuid>                 # Deactivate (soft-delete)
#   ruby calendly_api.rb link <uuid>                       # Generate a single-use scheduling link
#   ruby calendly_api.rb me                                # Show current user info
#   ruby calendly_api.rb availability                      # Show availability schedules
#
# Create/Update options:
#   --duration <min>          Duration in minutes (default: 30)
#   --slug <slug>             URL slug (e.g. "openclaw-dfw")
#   --description <text>      Plain-text description
#   --color <hex>             Color hex (e.g. "#0099ff")
#   --location <kind>         Location kind: zoom_conference, google_conference, phone, etc.
#   --active                  Set active on create (default: inactive)
#   --secret                  Make it a secret/unlisted link
#
# API Limitations (Calendly v2):
#   - slug: auto-generated from name on create, cannot be changed via API
#   - delete: no delete endpoint; use "deactivate" to soft-delete
#   - availability: event types inherit your default availability schedule
#
# Requires CALENDLY_ACCESS_TOKEN in ../.env or environment.

require "net/http"
require "json"
require "uri"

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def load_token
  # Check environment first
  token = ENV["CALENDLY_ACCESS_TOKEN"]
  return token if token && !token.empty?

  # Fall back to .env file
  env_path = File.join(__dir__, "..", ".env")
  if File.exist?(env_path)
    File.readlines(env_path).each do |line|
      line = line.strip
      next if line.empty? || line.start_with?("#")
      key, value = line.split("=", 2)
      if key == "CALENDLY_ACCESS_TOKEN"
        token = value
        break
      end
    end
  end

  abort "Error: CALENDLY_ACCESS_TOKEN not found in environment or ../.env" unless token && !token.empty?
  token
end

TOKEN = load_token
BASE_URL = "https://api.calendly.com"

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def api_request(method, path, body: nil, params: {})
  uri = URI("#{BASE_URL}#{path}")
  uri.query = URI.encode_www_form(params) unless params.empty?

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = case method
            when :get    then Net::HTTP::Get.new(uri)
            when :post   then Net::HTTP::Post.new(uri)
            when :patch  then Net::HTTP::Patch.new(uri)
            when :delete then Net::HTTP::Delete.new(uri)
            end

  request["Authorization"] = "Bearer #{TOKEN}"
  request["Content-Type"] = "application/json"

  if body
    request.body = body.to_json
  end

  response = http.request(request)
  parsed = JSON.parse(response.body) rescue nil

  unless response.is_a?(Net::HTTPSuccess)
    msg = parsed ? JSON.pretty_generate(parsed) : response.body
    abort "API error (#{response.code}):\n#{msg}"
  end

  parsed
end

def get(path, params: {})  = api_request(:get, path, params: params)
def post(path, body)        = api_request(:post, path, body: body)
def patch(path, body)       = api_request(:patch, path, body: body)

# ---------------------------------------------------------------------------
# API methods
# ---------------------------------------------------------------------------

def current_user
  get("/users/me")["resource"]
end

def user_uri
  @user_uri ||= current_user["uri"]
end

def list_event_types(active_only: false)
  data = get("/event_types", params: { user: user_uri })
  types = data["collection"]
  types = types.select { |et| et["active"] } if active_only
  types
end

def get_event_type(uuid)
  get("/event_types/#{uuid}")["resource"]
end

def create_event_type(name:, duration: 30, slug: nil, description: nil, color: nil,
                      location: nil, active: false, secret: false)
  body = {
    name: name,
    owner: user_uri,
    duration: duration.to_i,
    active: active,
    secret: secret
  }
  body[:slug] = slug if slug
  body[:description] = description if description
  body[:color] = color if color
  body[:locations] = [{ kind: location }] if location

  post("/event_types", body)["resource"]
end

def update_event_type(uuid, **attrs)
  body = {}
  body[:name]              = attrs[:name]        if attrs.key?(:name)
  body[:duration]          = attrs[:duration].to_i if attrs.key?(:duration)
  body[:description]       = attrs[:description] if attrs.key?(:description)
  body[:color]             = attrs[:color]       if attrs.key?(:color)
  body[:active]            = attrs[:active]      if attrs.key?(:active)
  body[:secret]            = attrs[:secret]      if attrs.key?(:secret)
  body[:locations]         = [{ kind: attrs[:location] }] if attrs.key?(:location)
  body[:slug]              = attrs[:slug]        if attrs.key?(:slug)

  abort "Nothing to update. Pass options like --name, --duration, --slug, etc." if body.empty?
  patch("/event_types/#{uuid}", body)["resource"]
end

def activate_event_type(uuid)
  patch("/event_types/#{uuid}", { active: true })["resource"]
end

def deactivate_event_type(uuid)
  patch("/event_types/#{uuid}", { active: false })["resource"]
end

def create_scheduling_link(event_type_uuid, max_event_count: 1)
  owner_uri = "#{BASE_URL}/event_types/#{event_type_uuid}"
  post("/scheduling_links", {
    max_event_count: max_event_count,
    owner: owner_uri,
    owner_type: "EventType"
  })["resource"]
end

def availability_schedules
  get("/user_availability_schedules", params: { user: user_uri })["collection"]
end

# ---------------------------------------------------------------------------
# Display helpers
# ---------------------------------------------------------------------------

def format_event_type(et, verbose: false)
  status = et["active"] ? "✅ active" : "⏸  inactive"
  secret = et["secret"] ? " 🔒" : ""
  lines = [
    "#{status}#{secret}  #{et['name']}",
    "    URL:      #{et['scheduling_url']}",
    "    UUID:     #{et['uri'].split('/').last}",
    "    Duration: #{et['duration']} min",
  ]
  if verbose
    lines << "    Slug:     #{et['slug']}"
    lines << "    Color:    #{et['color']}"
    lines << "    Desc:     #{et['description_plain'] || '(none)'}"
    locs = (et["locations"] || []).map { |l| l["kind"] }.join(", ")
    lines << "    Location: #{locs.empty? ? '(none)' : locs}"
    lines << "    Created:  #{et['created_at']}"
    lines << "    Updated:  #{et['updated_at']}"
  end
  lines.join("\n")
end

def format_availability(sched)
  lines = ["📅 #{sched['name']} (#{sched['timezone']})"]
  lines << "    Default: #{sched['default']}"
  sched["rules"].each do |rule|
    next if rule["intervals"].empty?
    intervals = rule["intervals"].map { |i| "#{i['from']}-#{i['to']}" }.join(", ")
    lines << "    #{rule['wday'].capitalize.ljust(10)} #{intervals}"
  end
  lines.join("\n")
end

# ---------------------------------------------------------------------------
# CLI argument parsing
# ---------------------------------------------------------------------------

def parse_options(args)
  opts = {}
  i = 0
  while i < args.length
    case args[i]
    when "--duration"     then opts[:duration]    = args[i += 1]
    when "--slug"         then opts[:slug]        = args[i += 1]
    when "--description"  then opts[:description] = args[i += 1]
    when "--color"        then opts[:color]       = args[i += 1]
    when "--location"     then opts[:location]    = args[i += 1]
    when "--name"         then opts[:name]        = args[i += 1]
    when "--active"       then opts[:active]      = true
    when "--inactive"     then opts[:active]      = false
    when "--secret"       then opts[:secret]      = true
    when "--no-secret"    then opts[:secret]      = false
    when "-v", "--verbose" then opts[:verbose]    = true
    end
    i += 1
  end
  opts
end

def usage
  puts <<~HELP
    Calendly Event Type Manager

    Usage:
      ruby calendly_api.rb <command> [args] [options]

    Commands:
      list [--active] [-v]           List event types
      get <uuid> [-v]                Get a single event type
      create <name> [options]        Create a new event type
      update <uuid> [options]        Update an event type
      activate <uuid>                Activate an event type
      deactivate <uuid>              Deactivate an event type (soft-delete)
      link <uuid>                    Generate a single-use scheduling link
      me                             Show current user info
      availability                   Show availability schedules

    Options (for create/update):
      --name <name>              Event type name
      --duration <minutes>       Duration (default: 30)
      --slug <slug>              URL slug
      --description <text>       Plain-text description
      --color <hex>              Color (e.g. "#0099ff")
      --location <kind>          zoom_conference, google_conference, phone, etc.
      --active / --inactive      Set active status
      --secret / --no-secret     Set secret (unlisted) status
      -v, --verbose              Show full details

    Examples:
      ruby calendly_api.rb create "OpenClaw DFW Consultation" \\
        --duration 45 --slug openclaw-dfw \\
        --description "Book a consultation for OpenClaw deployment in DFW" \\
        --location zoom_conference --color "#0099ff" --active

      ruby calendly_api.rb update <uuid> --name "New Name" --duration 60
      ruby calendly_api.rb link <uuid>
  HELP
end

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

command = ARGV[0]

case command
when "me"
  user = current_user
  puts "👤 #{user['name']} (#{user['email']})"
  puts "   Timezone:      #{user['timezone']}"
  puts "   Scheduling:    #{user['scheduling_url']}"
  puts "   Organization:  #{user['current_organization']}"
  puts "   URI:           #{user['uri']}"

when "availability"
  schedules = availability_schedules
  schedules.each { |s| puts format_availability(s); puts }

when "list"
  opts = parse_options(ARGV[1..])
  types = list_event_types(active_only: opts[:active])
  if types.empty?
    puts "No event types found."
  else
    types.each { |et| puts format_event_type(et, verbose: opts[:verbose]); puts }
  end

when "get"
  uuid = ARGV[1] || abort("Usage: ruby calendly_api.rb get <uuid>")
  opts = parse_options(ARGV[2..])
  et = get_event_type(uuid)
  puts format_event_type(et, verbose: true)

when "create"
  name = ARGV[1] || abort("Usage: ruby calendly_api.rb create <name> [options]")
  opts = parse_options(ARGV[2..])
  et = create_event_type(
    name: name,
    duration: opts[:duration] || 30,
    slug: opts[:slug],
    description: opts[:description],
    color: opts[:color],
    location: opts[:location],
    active: opts.fetch(:active, false),
    secret: opts.fetch(:secret, false)
  )
  puts "✅ Created event type!"
  puts format_event_type(et, verbose: true)

when "update"
  uuid = ARGV[1] || abort("Usage: ruby calendly_api.rb update <uuid> [options]")
  opts = parse_options(ARGV[2..])
  opts.delete(:verbose)
  et = update_event_type(uuid, **opts)
  puts "✅ Updated event type!"
  puts format_event_type(et, verbose: true)

when "activate"
  uuid = ARGV[1] || abort("Usage: ruby calendly_api.rb activate <uuid>")
  et = activate_event_type(uuid)
  puts "✅ Activated: #{et['name']}"
  puts "   URL: #{et['scheduling_url']}"

when "deactivate"
  uuid = ARGV[1] || abort("Usage: ruby calendly_api.rb deactivate <uuid>")
  et = deactivate_event_type(uuid)
  puts "⏸  Deactivated: #{et['name']}"

when "link"
  uuid = ARGV[1] || abort("Usage: ruby calendly_api.rb link <uuid>")
  link = create_scheduling_link(uuid)
  puts "🔗 Single-use scheduling link:"
  puts "   #{link['booking_url']}"

when "help", "-h", "--help", nil
  usage

else
  abort "Unknown command: #{command}\nRun 'ruby calendly_api.rb help' for usage."
end
