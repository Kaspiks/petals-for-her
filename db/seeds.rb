# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.

# Order statuses for e-commerce
order_statuses = [
  { code: "pending", name: "Pending", is_final: false },
  { code: "paid", name: "Paid", is_final: false },
  { code: "shipped", name: "Shipped", is_final: true },
  { code: "delivered", name: "Delivered", is_final: true },
  { code: "cancelled", name: "Cancelled", is_final: true }
]

order_statuses.each do |attrs|
  OrderStatus.find_or_create_by!(code: attrs[:code]) do |os|
    os.name = attrs[:name]
    os.is_final = attrs[:is_final]
  end
end

# Sample collections and products (from landing page design)
blush_romance = Collection.find_or_create_by!(slug: "blush-romance") do |c|
  c.name = "Blush Romance"
  c.description = "2x Stem Collection Arrangement"
end

sage_garden = Collection.find_or_create_by!(slug: "sage-garden") do |c|
  c.name = "Sage Garden"
  c.description = "White Peony & Eucalyptus Collection"
end

green_elegance = Collection.find_or_create_by!(slug: "green-elegance") do |c|
  c.name = "Green Elegance"
  c.description = "Minimalist Ivory Orchid Lei"
end

[
  [blush_romance, "Blush Romance", "2x Stem Collection Arrangement", 120.00],
  [sage_garden, "Sage Garden", "White Peony & Eucalyptus Collection", 120.00],
  [green_elegance, "Green Elegance", "Minimalist Ivory Orchid Lei", 120.00]
].each do |collection, name, coll_type, price|
  Product.find_or_create_by!(collection: collection, name: name) do |p|
    p.description = "Hyper-realistic silk bouquet with bespoke scent"
    p.collection_type = coll_type
    p.price = price
    p.active = true
  end
end

# Sample occasions
[
  { name: "Anniversary", slug: "anniversary", description: "Celebrate years of love with timeless floral arrangements." },
  { name: "Birthday", slug: "birthday", description: "Make every birthday bloom with curated bouquets." },
  { name: "Wedding", slug: "wedding", description: "Elegant arrangements for the most special day." },
  { name: "Graduation", slug: "graduation", description: "Honor achievements with beautiful floral gifts." },
  { name: "Valentine's Day", slug: "valentines-day", description: "Express your love with romantic blooms." },
].each do |attrs|
  Occasion.find_or_create_by!(slug: attrs[:slug]) do |o|
    o.name = attrs[:name]
    o.description = attrs[:description]
    o.active = true
  end
end

# Development admin user (for testing dashboard)
if Rails.env.development? && User.count.zero?
  User.create!(
    email: "admin@petalsforher.com",
    password: "admin123",
    full_name: "Admin User",
    admin: true
  )
  puts "Created admin user: admin@petalsforher.com / admin123"
end

# Promote first user to admin for development (run after creating a user)
if (admin_user = User.first) && !admin_user.admin?
  admin_user.update!(admin: true)
  puts "Promoted #{admin_user.email} to admin" if Rails.env.development?
end

# Default store settings
defaults = {
  "store_name" => "Petals for Her",
  "contact_email" => "contact@petalsforher.com",
  "shipping_notice" => "Standard shipping 3-5 business days",
  "currency" => "USD",
  "seo_site_title" => "Petals for Her",
  "seo_title_suffix" => " – Petals for Her",
  "seo_default_description" => "Timeless beauty, captured in fragrance. Handcrafted silk bouquets with bespoke scents. Shop everlasting blooms and artisanal arrangements.",
  "seo_default_og_image" => "",
  "seo_org_name" => "Petals for Her",
  "seo_org_email" => "concierge@petalsforher.com",
  "seo_org_phone" => "",
  "seo_org_address" => "",
  "seo_org_logo_url" => "",
  "seo_org_description" => "Timeless beauty, captured in fragrance. Handcrafted silk bouquets with bespoke scents."
}
defaults.each do |key, value|
  StoreSetting.find_or_create_by!(key: key) do |s|
    s.value = value
  end
end

# Classifications for product options (vase, ribbon material, ribbon color)
vase_type = Classification.find_or_create_by!(code: "vase_type") do |c|
  c.name = "Vase Options"
end
[
  { value: "Clear Glass Cylinder", sort_order: 1 },
  { value: "Ceramic White Matte", sort_order: 2 },
  { value: "No Vase (Stems Only)", sort_order: 3 }
].each do |attrs|
  vase_type.classification_values.find_or_create_by!(value: attrs[:value]) do |v|
    v.sort_order = attrs[:sort_order]
    v.active = true
  end
end

ribbon_material = Classification.find_or_create_by!(code: "ribbon_material") do |c|
  c.name = "Ribbon Material"
end
[
  { value: "Satin", sort_order: 1 },
  { value: "Organza", sort_order: 2 },
  { value: "Linen", sort_order: 3 }
].each do |attrs|
  ribbon_material.classification_values.find_or_create_by!(value: attrs[:value]) do |v|
    v.sort_order = attrs[:sort_order]
    v.active = true
  end
end

primary_fragrance = Classification.find_or_create_by!(code: "primary_fragrance") do |c|
  c.name = "Primary Fragrance"
end
[
  { value: "Velvet Rose", sort_order: 1 },
  { value: "Jasmine Mist", sort_order: 2 },
  { value: "Lavender Dream", sort_order: 3 },
  { value: "Peony Blush", sort_order: 4 }
].each do |attrs|
  primary_fragrance.classification_values.find_or_create_by!(value: attrs[:value]) do |v|
    v.sort_order = attrs[:sort_order]
    v.active = true
  end
end

ribbon_color = Classification.find_or_create_by!(code: "ribbon_color") do |c|
  c.name = "Ribbon Color"
end
[
  { value: "Light Pink", hex_code: "#E8C9C9", sort_order: 1 },
  { value: "Light Yellow", hex_code: "#F5E6A3", sort_order: 2 },
  { value: "Light Green", hex_code: "#B8D4A8", sort_order: 3 },
  { value: "Pink", hex_code: "#D4A5A5", sort_order: 4 },
  { value: "Red", hex_code: "#C75050", sort_order: 5 },
  { value: "Black", hex_code: "#2D2D2D", sort_order: 6 }
].each do |attrs|
  ribbon_color.classification_values.find_or_create_by!(value: attrs[:value]) do |v|
    v.hex_code = attrs[:hex_code]
    v.sort_order = attrs[:sort_order]
    v.active = true
  end
end

# Sample orders for dashboard (development)
if Order.count.zero? && Product.any? && OrderStatus.any?
  pending_status = OrderStatus.find_by!(code: "pending")
  paid_status = OrderStatus.find_by!(code: "paid")
  shipped_status = OrderStatus.find_by!(code: "shipped")
  products = Product.all.to_a

  [
    ["Eleanor Rigby", "eleanor@example.com", "123 Main St", paid_status, [1, 1]],
    ["Sarah Mitchell", "sarah@example.com", "456 Oak Ave", shipped_status, [2, 1]],
    ["James Lee", "james@example.com", "789 Pine Rd", shipped_status, [0]],
    ["Emma Wilson", "emma@example.com", "321 Elm St", pending_status, [1, 1]],
    ["Olivia Brown", "olivia@example.com", "654 Cedar Ln", paid_status, [2, 2]]
  ].each_with_index do |(name, email, addr, status, product_indices), _i|
    order = Order.create!(
      customer_name: name,
      email: email,
      shipping_address: addr,
      total: 0,
      order_status: status
    )
    total = 0
    product_indices.each do |idx|
      product = products[idx % products.size]
      qty = [1, 2].sample
      unit_price = product.price
      OrderItem.create!(order: order, product: product, quantity: qty, unit_price: unit_price)
      total += qty * unit_price
    end
    order.update!(total: total)
  end
end
