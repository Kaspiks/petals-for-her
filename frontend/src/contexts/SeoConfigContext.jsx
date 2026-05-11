import { createContext, useContext, useState, useEffect } from 'react'

const SeoConfigContext = createContext(null)

const DEFAULTS = {
  seo_site_title: 'Petals for Her',
  seo_title_suffix: ' – Petals for Her',
  seo_default_description:
    'Scented satin bouquets for her in Riga—handcrafted with lasting fragrance. Everlasting blooms delivered across Latvia.',
  seo_default_og_image: '',
  seo_org_name: 'Petals for Her',
  seo_org_email: '',
  seo_org_phone: '',
  seo_org_address: 'Riga, Latvia',
  seo_org_logo_url: '',
  seo_org_description: 'Scented satin bouquets for her in Riga—lasting fragrance and hyper-realistic everlasting blooms.',
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
