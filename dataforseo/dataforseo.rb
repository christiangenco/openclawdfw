require 'net/http'
require 'json'
require 'digest'
require 'fileutils'
require 'dotenv/load'
require 'time'

class DataForSEO
  # Load environment variables
  Dotenv.load
  
  # Constants
  CACHE_DIR = '_dataforseo'
  USERNAME = ENV['DATAFORSEO_USERNAME']
  PASSWORD = ENV['DATAFORSEO_PASSWORD']
  
  # Ensure cache directory exists
  FileUtils.mkdir_p(CACHE_DIR)
  
  def self.get_domain_metrics(domain)
    # Clean up domain - remove protocol and path
    clean_domain = domain.gsub(/https?:\/\//, '').gsub(/\/.*$/, '')
    
    # Create cache key
    cache_key = Digest::MD5.hexdigest("domain_metrics:#{clean_domain}")
    cache_file = File.join(CACHE_DIR, "#{cache_key}.json")
    
    # Check cache first
    if File.exist?(cache_file)
      cached_data = JSON.parse(File.read(cache_file))
      # Return cached data if it's less than 30 days old
      if Time.now - Time.parse(cached_data['fetched_at']) < 30 * 24 * 60 * 60
        # Extract data from cached response
        data = cached_data['response']
        if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result'] && data['tasks'][0]['result'][0]
          result = data['tasks'][0]['result'][0]
          if result['items'] && result['items'][0] && result['items'][0]['metrics'] && result['items'][0]['metrics']['organic']
            etv = result['items'][0]['metrics']['organic']['etv'] || 0
            return {
              'etv' => etv,
              'cached' => true
            }
          end
        end
      end
    end
    
    # Make API request
    uri = URI('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live')
    
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(USERNAME, PASSWORD)
    request['Content-Type'] = 'application/json'
    
    payload = [{
      "target": clean_domain,
      "language_code": "en",
      "location_code": 2840  # United States
    }]
    
    request.body = payload.to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    if response.code == '200'
      data = JSON.parse(response.body)
      
      # Cache the entire response
      cache_data = {
        'domain' => clean_domain,
        'response' => data,
        'fetched_at' => Time.now.to_s
      }
      File.write(cache_file, JSON.pretty_generate(cache_data))
      
      if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result'] && data['tasks'][0]['result'][0]
        result = data['tasks'][0]['result'][0]
        
        if result['items'] && result['items'][0] && result['items'][0]['metrics'] && result['items'][0]['metrics']['organic']
          etv = result['items'][0]['metrics']['organic']['etv'] || 0
          
          # Add delay to avoid rate limiting after successful API call
          sleep(0.5)
          
          return {
            'etv' => etv,
            'cached' => false
          }
        end
      end
    else
      raise "API Error: #{response.code} - #{response.body}"
    end
    
    # Return zero if no data found
    { 'etv' => 0, 'cached' => false }
    
  rescue StandardError => e
    raise "Error fetching data for #{domain}: #{e.message}"
  end
  
  def self.get_keyword_metrics(keyword)
    # Create cache key
    cache_key = Digest::MD5.hexdigest("keyword_metrics:#{keyword}")
    cache_file = File.join(CACHE_DIR, "#{cache_key}.json")
    
    # Check cache first
    if File.exist?(cache_file)
      cached_data = JSON.parse(File.read(cache_file))
      # Return cached data if it's less than 30 days old
      if Time.now - Time.parse(cached_data['fetched_at']) < 30 * 24 * 60 * 60
        # Extract data from cached response
        data = cached_data['response']
        if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result'] && data['tasks'][0]['result'][0]
          keyword_data = data['tasks'][0]['result'][0]
          if keyword_data && keyword_data['keyword'] == keyword
            volume = keyword_data['search_volume'] || 0
            difficulty = keyword_data['competition_index'] || 0
            cpc = keyword_data['cpc'] || 0
            
            return {
              'volume' => volume,
              'difficulty' => difficulty,
              'cpc' => cpc,
              'cached' => true
            }
          end
        end
      end
    end
    
    # Make API request
    uri = URI('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live')
    
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(USERNAME, PASSWORD)
    request['Content-Type'] = 'application/json'
    
    payload = [{
      "keywords": [keyword],
      "language_code": "en",
      "location_code": 2840  # United States
    }]
    
    request.body = payload.to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    if response.code == '200'
      data = JSON.parse(response.body)
      
      # Cache the entire response
      cache_data = {
        'keyword' => keyword,
        'response' => data,
        'fetched_at' => Time.now.to_s
      }
      File.write(cache_file, JSON.pretty_generate(cache_data))
      
      if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result'] && data['tasks'][0]['result'][0]
        # Result is a single object, not an array to search through
        keyword_data = data['tasks'][0]['result'][0]
        
        if keyword_data && keyword_data['keyword'] == keyword
          volume = keyword_data['search_volume'] || 0
          difficulty = keyword_data['competition_index'] || 0
          cpc = keyword_data['cpc'] || 0
          
          # Add delay to avoid rate limiting after successful API call
          sleep(0.5)
          
          return {
            'volume' => volume,
            'difficulty' => difficulty,
            'cpc' => cpc,
            'cached' => false
          }
        end
      end
    else
      raise "API Error: #{response.code} - #{response.body}"
    end
    
    # Return zero if no data found
    { 'volume' => 0, 'difficulty' => 0, 'cpc' => 0, 'cached' => false }
    
  rescue StandardError => e
    raise "Error fetching data for keyword '#{keyword}': #{e.message}"
  end
  
  def self.get_keywords_batch_metrics(keywords)
    # Get search volume and CPC data
    volume_data = get_keywords_volume_batch(keywords)
    
    # Get organic difficulty data
    difficulty_data = get_keywords_difficulty_batch(keywords)
    
    # Merge the results
    results = {}
    keywords.each do |keyword|
      results[keyword] = {
        'volume' => volume_data[keyword]&.[]('volume') || 0,
        'difficulty' => difficulty_data[keyword]&.[]('difficulty') || 0,
        'cpc' => volume_data[keyword]&.[]('cpc') || 0,
        'cached' => volume_data[keyword]&.[]('cached') && difficulty_data[keyword]&.[]('cached')
      }
    end
    
    results
  end
  
  def self.get_keywords_volume_batch(keywords)
    # Create cache key for the batch
    cache_key = Digest::MD5.hexdigest("keywords_volume_batch:#{keywords.sort.join(',')}")
    cache_file = File.join(CACHE_DIR, "#{cache_key}.json")
    
    # Check cache first
    if File.exist?(cache_file)
      cached_data = JSON.parse(File.read(cache_file))
      # Return cached data if it's less than 30 days old
      if Time.now - Time.parse(cached_data['fetched_at']) < 30 * 24 * 60 * 60
        # Extract data from cached response
        return extract_volume_from_response(cached_data['response'], true)
      end
    end
    
    # Make API request
    uri = URI('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live')
    
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(USERNAME, PASSWORD)
    request['Content-Type'] = 'application/json'
    
    payload = [{
      "keywords": keywords,
      "language_code": "en",
      "location_code": 2840  # United States
    }]
    
    request.body = payload.to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    if response.code == '200'
      data = JSON.parse(response.body)
      
      # Cache the entire response
      cache_data = {
        'keywords' => keywords,
        'response' => data,
        'fetched_at' => Time.now.to_s
      }
      File.write(cache_file, JSON.pretty_generate(cache_data))
      
      # Add delay to avoid rate limiting after successful API call
      sleep(2)
      
      return extract_volume_from_response(data, false)
    else
      raise "API Error: #{response.code} - #{response.body}"
    end
    
  rescue StandardError => e
    raise "Error fetching volume data for keywords: #{e.message}"
  end
  
  def self.get_keywords_difficulty_batch(keywords)
    # Create cache key for the batch
    cache_key = Digest::MD5.hexdigest("keywords_difficulty_batch:#{keywords.sort.join(',')}")
    cache_file = File.join(CACHE_DIR, "#{cache_key}.json")
    
    # Check cache first
    if File.exist?(cache_file)
      cached_data = JSON.parse(File.read(cache_file))
      # Return cached data if it's less than 30 days old
      if Time.now - Time.parse(cached_data['fetched_at']) < 30 * 24 * 60 * 60
        # Extract data from cached response
        return extract_difficulty_from_response(cached_data['response'], true)
      end
    end
    
    # Make API request for organic keyword difficulty
    uri = URI('https://api.dataforseo.com/v3/dataforseo_labs/google/bulk_keyword_difficulty/live')
    
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(USERNAME, PASSWORD)
    request['Content-Type'] = 'application/json'
    
    payload = [{
      "keywords": keywords,
      "language_code": "en",
      "location_code": 2840  # United States
    }]
    
    request.body = payload.to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    if response.code == '200'
      data = JSON.parse(response.body)
      
      # Cache the entire response
      cache_data = {
        'keywords' => keywords,
        'response' => data,
        'fetched_at' => Time.now.to_s
      }
      File.write(cache_file, JSON.pretty_generate(cache_data))
      
      # Add delay to avoid rate limiting after successful API call
      sleep(2)
      
      return extract_difficulty_from_response(data, false)
    else
      raise "API Error: #{response.code} - #{response.body}"
    end
    
  rescue StandardError => e
    raise "Error fetching difficulty data for keywords: #{e.message}"
  end
  
  def self.extract_volume_from_response(data, cached)
    results = {}
    
    if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result']
      # Check if we got an error (like rate limit)
      if data['tasks'][0]['status_code'] != 20000
        raise "API Error: #{data['tasks'][0]['status_message']}"
      end
      
      # Result is an array of keyword data
      data['tasks'][0]['result'].each do |keyword_data|
        keyword = keyword_data['keyword']
        volume = keyword_data['search_volume'] || 0
        cpc = keyword_data['cpc'] || 0
        
        results[keyword] = {
          'volume' => volume,
          'cpc' => cpc,
          'cached' => cached
        }
      end
    end
    
    results
  end
  
  def self.extract_difficulty_from_response(data, cached)
    results = {}
    
    if data['tasks'] && data['tasks'][0] && data['tasks'][0]['result']
      # Check if we got an error (like rate limit)
      if data['tasks'][0]['status_code'] != 20000
        raise "API Error: #{data['tasks'][0]['status_message']}"
      end
      
      # Result is an array of items with keyword difficulty
      if data['tasks'][0]['result'][0] && data['tasks'][0]['result'][0]['items']
        data['tasks'][0]['result'][0]['items'].each do |item|
          keyword = item['keyword']
          difficulty = item['keyword_difficulty'] || 0
          
          results[keyword] = {
            'difficulty' => difficulty,
            'cached' => cached
          }
        end
      end
    end
    
    results
  end
end