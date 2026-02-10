require 'net/http'
require 'json'
require 'uri'
require 'dotenv'

Dotenv.load(File.expand_path('../../.env', __FILE__))

module Fathom
  class Client
    BASE_URL = 'https://api.usefathom.com/v1'

    def initialize(token: nil)
      @token = token || ENV['FATHOM_API_TOKEN']&.gsub(/^"|"$/, '')
      raise 'FATHOM_API_TOKEN not set' unless @token
    end

    def get(path, params = {})
      uri = URI("#{BASE_URL}/#{path}")
      uri.query = URI.encode_www_form(params) unless params.empty?
      request(Net::HTTP::Get.new(uri))
    end

    def post(path, body = {})
      uri = URI("#{BASE_URL}/#{path}")
      req = Net::HTTP::Post.new(uri)
      req.set_form_data(body)
      request(req)
    end

    private

    def request(req)
      uri = req.uri
      req['Authorization'] = "Bearer #{@token}"

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      case response
      when Net::HTTPSuccess
        JSON.parse(response.body)
      else
        raise "API Error #{response.code}: #{response.body}"
      end
    end
  end
end
