#!/usr/bin/env ruby
# Generates a Google Ads API refresh token via OAuth2 desktop flow.
# Run once, then add the refresh token to .env as GOOGLE_ADS_REFRESH_TOKEN.

require "dotenv/load"
require "faraday"
require "json"
require "uri"
require "webrick"

CLIENT_ID     = ENV.fetch("GOOGLE_ADS_CLIENT_ID")     { abort "Missing GOOGLE_ADS_CLIENT_ID in .env" }
CLIENT_SECRET = ENV.fetch("GOOGLE_ADS_CLIENT_SECRET")  { abort "Missing GOOGLE_ADS_CLIENT_SECRET in .env" }

REDIRECT_URI = "http://localhost:8484/oauth/callback"
SCOPE        = "https://www.googleapis.com/auth/adwords"

# Step 1: Build auth URL and open browser
auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + URI.encode_www_form(
  client_id:     CLIENT_ID,
  redirect_uri:  REDIRECT_URI,
  response_type: "code",
  scope:         SCOPE,
  access_type:   "offline",
  prompt:        "consent"
)

puts "\n🔗 Open this URL in your browser:\n\n#{auth_url}\n\n"
system("xdg-open '#{auth_url}' 2>/dev/null || open '#{auth_url}' 2>/dev/null &")

# Step 2: Start a tiny local server to catch the redirect
auth_code = nil
server = WEBrick::HTTPServer.new(Port: 8484, Logger: WEBrick::Log.new("/dev/null"), AccessLog: [])

server.mount_proc "/oauth/callback" do |req, res|
  auth_code = req.query["code"]
  res.body = "<html><body><h1>✅ Authorization complete!</h1><p>You can close this tab.</p></body></html>"
  res.content_type = "text/html"
  Thread.new { sleep 1; server.shutdown }
end

trap("INT") { server.shutdown }
server.start

abort "❌ No authorization code received." unless auth_code

# Step 3: Exchange code for tokens
puts "Exchanging code for tokens..."
resp = Faraday.post("https://oauth2.googleapis.com/token") do |req|
  req.body = URI.encode_www_form(
    code:          auth_code,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri:  REDIRECT_URI,
    grant_type:    "authorization_code"
  )
end

tokens = JSON.parse(resp.body)

if tokens["refresh_token"]
  puts "\n✅ Success! Add this to your .env:\n\n"
  puts "GOOGLE_ADS_REFRESH_TOKEN=#{tokens["refresh_token"]}"
  puts "\n"
else
  puts "\n❌ Error getting refresh token:"
  puts JSON.pretty_generate(tokens)
end
