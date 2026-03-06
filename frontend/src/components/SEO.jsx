import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

/**
 * SEO meta tags and Open Graph / Twitter cards.
 * Reads defaults from admin-configurable SeoConfig context.
 * Pass page-specific overrides via props.
 */
export default function SEO({
  title,
  description,
  canonicalPath,
  image,
  noindex = false,
  type = 'website',
}) {
  const cfg = useSeoConfig()

  const siteName = cfg.seo_site_title || 'Petals for Her'
  const suffix = cfg.seo_title_suffix || ''
  const defaultDescription = cfg.seo_default_description || ''
  const defaultOgImage = cfg.seo_default_og_image || ''

  const fullTitle = title ? `${title}${suffix}` : `${siteName}${suffix ? '' : ' – Timeless Beauty, Captured in Fragrance'}`
  const desc = description || defaultDescription
  const canonical = canonicalPath
    ? `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : SITE_URL
  const imgSrc = image || defaultOgImage
  const imageUrl = imgSrc
    ? (imgSrc.startsWith('http') ? imgSrc : `${SITE_URL}${imgSrc.startsWith('/') ? imgSrc : `/${imgSrc}`}`)
    : ''

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  )
}
