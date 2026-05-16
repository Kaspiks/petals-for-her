import { Helmet } from 'react-helmet-async'
import { SITE_URL } from '../config/site'
import { useSeoConfig } from '../contexts/SeoConfigContext'

export default function JsonLdOrganization() {
  const cfg = useSeoConfig()

  const orgName = cfg.seo_org_name || cfg.seo_site_title || 'Petals for Her'
  const orgDescription = cfg.seo_org_description || cfg.seo_default_description || ''
  const logoUrl = cfg.seo_org_logo_url || `${SITE_URL}/hero-bouquet.png`

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    '@id': `${SITE_URL}#localbusiness`,
    name: orgName,
    description: orgDescription,
    url: SITE_URL,
    image: logoUrl,
    logo: logoUrl,
    telephone: cfg.seo_org_phone || '+371-25-555-100',
    email: cfg.seo_org_email || 'hello@petalsforher.com',
    priceRange: '€€',
    currenciesAccepted: 'EUR, USD',
    paymentAccepted: 'Credit Card, Debit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: cfg.seo_org_address || 'Brīvības iela 75',
      addressLocality: 'Riga',
      postalCode: 'LV-1011',
      addressRegion: 'Rīgas pilsēta',
      addressCountry: 'LV',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 56.9536,
      longitude: 24.1234,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '11:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/petalsforher',
      'https://www.facebook.com/petalsforher',
      'https://www.pinterest.com/petalsforher',
    ],
    areaServed: [
      { '@type': 'Country', name: 'Latvia' },
      { '@type': 'City', name: 'Riga' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: cfg.seo_org_email || 'hello@petalsforher.com',
      telephone: cfg.seo_org_phone || '+371-25-555-100',
      contactType: 'customer service',
      areaServed: 'LV',
      availableLanguage: ['English', 'Latvian', 'Russian'],
      url: `${SITE_URL}/contact_us`,
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: cfg.seo_site_title || orgName,
    url: SITE_URL,
    description: cfg.seo_default_description || orgDescription,
    publisher: { '@id': `${SITE_URL}#localbusiness` },
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
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  )
}
