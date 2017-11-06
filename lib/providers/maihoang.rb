# frozen_string_literal: true

module Providers
  class Maihoang
    URL = 'http://maihoang.com.vn/search'

    class << self
      def search(words)
        begin
          body = HTTP.get(URL, params: { cat: 0, key: words }).to_s
          parse(body)
        rescue TimeoutError
          []
        end
      end

      private

      def parse(html)
        html_doc = Nokogiri::HTML(html)
        html_doc.css('.wrapper-pro .pro-item').map do |html_product|
          ele = html_product.css('h2 a')
          name = ele.first.content
          url = ele.first['href']
          price = html_product.css('.pro-price').first.content.gsub(/[^\d]/, '').to_i
          {
            name: name,
            price: price,
            url: url,
            provider: 'maihoang'
          }
        end
      end
    end
  end
end
