import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

/**
 * JSON-LD structured data for the homepage: Organization + WebSite.
 * All values are admin-configurable via the SEO Configuration dashboard.
 */
export default function JsonLdOrganization() {
  const cfg = useSeoConfig()

  const orgName = cfg.seo_org_name || cfg.seo_site_title || 'Petals for Her'
  const orgDescription = cfg.seo_org_description || cfg.seo_default_description || ''

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    url: SITE_URL,
    description: orgDescription,
    ...(cfg.seo_org_logo_url && { logo: cfg.seo_org_logo_url }),
    ...(cfg.seo_org_email && {
      contactPoint: {
        '@type': 'ContactPoint',
        email: cfg.seo_org_email,
        contactType: 'customer service',
        url: `${SITE_URL}/contact_us`,
        ...(cfg.seo_org_phone && { telephone: cfg.seo_org_phone }),
      },
    }),
    ...(cfg.seo_org_address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: cfg.seo_org_address,
      },
    }),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: cfg.seo_site_title || orgName,
    url: SITE_URL,
    description: cfg.seo_default_description || orgDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  )
}
