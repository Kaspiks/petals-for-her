import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

export default function JsonLdArticle({ post }) {
  const cfg = useSeoConfig()

  if (!post?.title) return null

  const url = `${SITE_URL}/journal/${post.slug}`
  const orgName = cfg.seo_org_name || 'Petals for Her'
  const logoUrl = cfg.seo_org_logo_url || `${SITE_URL}/hero-bouquet.png`
  const heroImage = post.hero_image_url || logoUrl
  const wordCount = post.word_count || undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.meta_description || post.title,
    image: [heroImage],
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || orgName,
      url: `${SITE_URL}/journal`,
    },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    ...(post.category?.name && { articleSection: post.category.name }),
    ...(wordCount && { wordCount }),
    inLanguage: 'en',
    url,
    isPartOf: { '@id': `${SITE_URL}#website` },
    about: {
      '@type': 'Thing',
      name: 'Scented satin bouquets',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
