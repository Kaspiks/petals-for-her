import { createContext, useContext, useState, useEffect } from 'react'

const SeoConfigContext = createContext(null)

const DEFAULTS = {
  seo_site_title: 'Petals for Her',
  seo_title_suffix: ' – Petals for Her',
  seo_default_description:
    'Timeless beauty, captured in fragrance. Handcrafted silk bouquets with bespoke scents. Shop everlasting blooms and artisanal arrangements.',
  seo_default_og_image: '',
  seo_org_name: 'Petals for Her',
  seo_org_email: '',
  seo_org_phone: '',
  seo_org_address: '',
  seo_org_logo_url: '',
  seo_org_description: '',
}

export function SeoConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/v1/seo_config')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        setConfig((prev) => ({ ...prev, ...data }))
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <SeoConfigContext.Provider value={{ ...config, loaded }}>
      {children}
    </SeoConfigContext.Provider>
  )
}

export function useSeoConfig() {
  const ctx = useContext(SeoConfigContext)
  if (!ctx) throw new Error('useSeoConfig must be used within SeoConfigProvider')
  return ctx
}
