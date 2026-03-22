# frozen_string_literal: true

require "cgi"

class SitemapController < ApplicationController
  def index
    @base_url = base_url
    @products = Product.active.includes(:collection).order(updated_at: :desc)
    @posts = Post.published.published_order
    @occasions = Occasion.active.order(:name)
    xml = build_xml
    render xml: xml, content_type: "application/xml"
  end

  private

  def base_url
    host = ENV.fetch("APP_HOST", request.host)
    # Behind Docker/Caddy, request.scheme can be "http"; public URLs must be https.
    scheme = if ENV["APP_HOST"].present?
      "https"
    else
      request.scheme
    end
    "#{scheme}://#{host}"
  end

  def build_xml
    <<~XML
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        #{url_tag(@base_url, nil, "1.0", "daily")}
        #{url_tag("#{@base_url}/products", nil, "0.9", "weekly")}
        #{url_tag("#{@base_url}/collections", nil, "0.85", "weekly")}
        #{url_tag("#{@base_url}/occasions", nil, "0.85", "weekly")}
        #{@occasions.map { |o| url_tag("#{@base_url}/occasions/#{o.slug}", o.updated_at, "0.75", "weekly") }.join}
        #{url_tag("#{@base_url}/journal", nil, "0.85", "weekly")}
        #{url_tag("#{@base_url}/bloom", nil, "0.6", "monthly")}
        #{url_tag("#{@base_url}/contact_us", nil, "0.8", "monthly")}
        #{url_tag("#{@base_url}/privacy_policy", nil, "0.5", "yearly")}
        #{url_tag("#{@base_url}/terms", nil, "0.5", "yearly")}
        #{@posts.map { |post| url_tag("#{@base_url}/journal/#{post.slug}", post.updated_at, "0.75", "weekly") }.join}
        #{@products.map { |p| url_tag("#{@base_url}/product/#{p.respond_to?(:slug) && p.slug.present? ? p.slug : p.id}", p.updated_at, "0.8", "weekly") }.join}
      </urlset>
    XML
  end

  def url_tag(loc, updated_at, priority, changefreq)
    lastmod = updated_at ? updated_at.utc.strftime("%Y-%m-%d") : nil
    lastmod_tag = lastmod ? "<lastmod>#{lastmod}</lastmod>" : ""
    "<url><loc>#{CGI.escapeHTML(loc)}</loc>#{lastmod_tag}<priority>#{priority}</priority><changefreq>#{changefreq}</changefreq></url>"
  end
end
