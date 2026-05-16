import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'

export default function JsonLdBreadcrumb({ items }) {
  if (!items?.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path
        ? `${SITE_URL}${item.path.startsWith('/') ? item.path : `/${item.path}`}`
        : undefined,
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
