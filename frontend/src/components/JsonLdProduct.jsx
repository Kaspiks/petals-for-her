import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

/**
 * JSON-LD Product schema for product pages.
 * Uses per-product SEO overrides (meta_title, meta_description) when set.
 */
export default function JsonLdProduct({ product }) {
  const cfg = useSeoConfig()

  if (!product?.name) return null

  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`
  const productName = product.meta_title || product.name
  const productDescription =
    product.meta_description ||
    product.description ||
    `${product.name} – silk bouquet from ${cfg.seo_org_name || 'Petals for Her'}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    url: productUrl,
    image: product.image_url ? [product.image_url] : undefined,
    ...(cfg.seo_org_name && { brand: { '@type': 'Brand', name: cfg.seo_org_name } }),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability:
        product.stock_status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: productUrl,
    },
    ...(product.collection?.name && {
      category: product.collection.name,
    }),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
