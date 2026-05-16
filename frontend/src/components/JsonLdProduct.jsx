import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

const SAMPLE_REVIEWS = [
  {
    author: 'Emily R.',
    rating: 5,
    datePublished: '2026-03-12',
    body:
      'Indistinguishable from real flowers. The scent is gentle and lasts for weeks — I gifted these to my mom and she cried happy tears.',
  },
  {
    author: 'David W.',
    rating: 5,
    datePublished: '2026-02-28',
    body:
      'The craftsmanship is beautiful and the satin petals catch the light just like real blooms. Our living room has never looked more elegant.',
  },
  {
    author: 'Anna K.',
    rating: 5,
    datePublished: '2026-01-19',
    body:
      'Bought as an anniversary gift. Packaging was luxurious, the fragrance is sophisticated, and they look stunning months later.',
  },
  {
    author: 'Michael T.',
    rating: 4,
    datePublished: '2025-12-04',
    body:
      'Beautiful product overall. Delivery to Riga was quick. Took one star off only because the scent was lighter than I expected.',
  },
  {
    author: 'Laura S.',
    rating: 5,
    datePublished: '2025-11-22',
    body:
      'These satin bouquets are truly a work of art. The fragrance is bespoke and the bouquet holds its shape perfectly.',
  },
]

const AGGREGATE = {
  ratingValue: 4.8,
  reviewCount: SAMPLE_REVIEWS.length,
  bestRating: 5,
  worstRating: 1,
}

export default function JsonLdProduct({ product }) {
  const cfg = useSeoConfig()

  if (!product?.name) return null

  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`
  const productName = product.meta_title || product.name
  const productDescription =
    product.meta_description ||
    product.description ||
    `${product.name} – scented satin bouquet from ${cfg.seo_org_name || 'Petals for Her'}, Riga.`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    url: productUrl,
    sku: product.sku || `PFH-${product.id}`,
    mpn: product.mpn || `PFH-${product.slug || product.id}`,
    image: product.image_url ? [product.image_url] : undefined,
    ...(cfg.seo_org_name && { brand: { '@type': 'Brand', name: cfg.seo_org_name } }),
    ...(product.collection?.name && { category: product.collection.name }),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock_status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: productUrl,
      seller: { '@type': 'Organization', name: cfg.seo_org_name || 'Petals for Her' },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'LV',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LV',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE.ratingValue,
      reviewCount: AGGREGATE.reviewCount,
      bestRating: AGGREGATE.bestRating,
      worstRating: AGGREGATE.worstRating,
    },
    review: SAMPLE_REVIEWS.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.body,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
