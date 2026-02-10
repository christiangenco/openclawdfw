require "net/http"
require "uri"
require "nokogiri"
require "dotenv"

Dotenv.load(File.expand_path("../../.env", __FILE__))

class Namecheap
  API_URL = "https://api.namecheap.com/xml.response"

  def initialize(
    api_key: ENV.fetch("NAMECHEAP_API_KEY"),
    username: ENV.fetch("NAMECHEAP_USERNAME"),
    client_ip: ENV.fetch("NAMECHEAP_CLIENT_IP", nil)
  )
    @api_key = api_key
    @username = username
    @client_ip = client_ip || detect_ip
  end

  # Returns an array of hashes with domain info:
  #   { name:, expires:, is_expired:, auto_renew: }
  def domains
    results = []
    page = 1

    loop do
      doc = api_call("namecheap.domains.getList", {
        "Page" => page.to_s,
        "PageSize" => "100"
      })

      doc.css("DomainGetListResult Domain").each do |node|
        results << {
          name: node["Name"],
          expires: node["Expires"],
          is_expired: node["IsExpired"] == "true",
          auto_renew: node["AutoRenew"] == "true"
        }
      end

      paging = doc.at_css("Paging")
      total = paging.at_css("TotalItems").text.to_i
      page_size = paging.at_css("PageSize").text.to_i
      break if page * page_size >= total

      page += 1
    end

    results
  end

  # Returns an array of hashes with DNS host records:
  #   { host_id:, hostname:, type:, address:, mx_pref:, ttl:, is_active: }
  def dns_records(domain)
    parts = domain.split(".")
    sld = parts[0..-2].join(".")  # second-level domain
    tld = parts[-1]               # top-level domain

    doc = api_call("namecheap.domains.dns.getHosts", {
      "SLD" => sld,
      "TLD" => tld
    })

    doc.css("DomainDNSGetHostsResult host").map do |node|
      {
        host_id: node["HostId"],
        hostname: node["Name"],
        type: node["Type"],
        address: node["Address"],
        mx_pref: node["MXPref"],
        ttl: node["TTL"],
        is_active: node["IsActive"] == "true"
      }
    end
  end

  # Sets DNS host records for a domain. Pass an array of hashes:
  #   [{ hostname:, type:, address:, mx_pref: "10", ttl: "1800" }, ...]
  # NOTE: This REPLACES all records — you must include every record you want to keep.
  def set_dns_records(domain, records)
    parts = domain.split(".")
    sld = parts[0..-2].join(".")
    tld = parts[-1]

    params = { "SLD" => sld, "TLD" => tld }

    records.each_with_index do |record, i|
      n = i + 1
      params["HostName#{n}"] = record[:hostname] || "@"
      params["RecordType#{n}"] = record[:type] || "A"
      params["Address#{n}"] = record[:address]
      params["MXPref#{n}"] = record.fetch(:mx_pref, "10")
      params["TTL#{n}"] = record.fetch(:ttl, "1800")
    end

    api_call("namecheap.domains.dns.setHosts", params)
  end

  # Sets custom nameservers for a domain (e.g., for Cloudflare)
  def set_nameservers(domain, nameservers)
    parts = domain.split(".")
    sld = parts[0..-2].join(".")
    tld = parts[-1]

    api_call("namecheap.domains.dns.setCustom", {
      "SLD" => sld,
      "TLD" => tld,
      "Nameservers" => nameservers.join(",")
    })
  end

  private

  def detect_ip
    uri = URI("https://api.ipify.org")
    Net::HTTP.get(uri).strip
  end

  def api_call(command, extra_params = {})
    params = {
      "ApiUser" => @username,
      "ApiKey" => @api_key,
      "UserName" => @username,
      "ClientIp" => @client_ip,
      "Command" => command
    }.merge(extra_params)

    uri = URI(API_URL)
    uri.query = URI.encode_www_form(params)

    response = Net::HTTP.get_response(uri)

    unless response.is_a?(Net::HTTPSuccess)
      raise "HTTP #{response.code}: #{response.body}"
    end

    doc = Nokogiri::XML(response.body)

    # Check for API errors
    status = doc.at_css("ApiResponse")&.attr("Status")
    if status != "OK"
      errors = doc.css("Errors Error").map(&:text)
      raise "Namecheap API error: #{errors.join('; ')}"
    end

    doc
  end
end
