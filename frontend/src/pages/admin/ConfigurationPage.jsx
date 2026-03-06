import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const STORE_FIELDS = [
  { key: 'store_name', label: 'Store Name', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'shipping_notice', label: 'Shipping Notice', type: 'text' },
  { key: 'currency', label: 'Currency', type: 'text' },
]

const SEO_META_FIELDS = [
  { key: 'seo_site_title', label: 'Site Title', type: 'text', hint: 'Shown in browser tab and search results (e.g. "Petals for Her")' },
  { key: 'seo_title_suffix', label: 'Title Suffix', type: 'text', hint: 'Appended to page titles (e.g. " – Petals for Her")' },
  { key: 'seo_default_description', label: 'Default Meta Description', type: 'textarea', hint: 'Used when a page has no specific description (~155 chars recommended)' },
  { key: 'seo_default_og_image', label: 'Default Social Image URL', type: 'text', hint: 'Full URL to the default image for Open Graph / Twitter cards' },
]

const SEO_ORG_FIELDS = [
  { key: 'seo_org_name', label: 'Organization Name', type: 'text' },
  { key: 'seo_org_description', label: 'Organization Description', type: 'textarea', hint: 'Short blurb for structured data' },
  { key: 'seo_org_email', label: 'Contact Email', type: 'email' },
  { key: 'seo_org_phone', label: 'Phone Number', type: 'text' },
  { key: 'seo_org_address', label: 'Address', type: 'text' },
  { key: 'seo_org_logo_url', label: 'Logo URL', type: 'text', hint: 'Full URL to your logo for search engine knowledge panels' },
]

const TABS = [
  { id: 'store', label: 'Store' },
  { id: 'seo', label: 'SEO & Meta' },
  { id: 'organization', label: 'Organization (JSON-LD)' },
]

function FieldGroup({ fields, form, setForm }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium text-stone-600 mb-1">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.key}
              value={form[field.key] ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5] resize-none"
            />
          ) : (
            <input
              id={field.key}
              type={field.type}
              value={form[field.key] ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
            />
          )}
          {field.hint && <p className="text-xs text-stone-400 mt-1">{field.hint}</p>}
        </div>
      ))}
    </div>
  )
}

export default function ConfigurationPage() {
  const { fetchWithAuth } = useAuth()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('store')

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetchWithAuth('/api/v1/admin/configuration')
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [fetchWithAuth])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetchWithAuth('/api/v1/admin/configuration', {
        method: 'PATCH',
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setForm(data)
        setMessage({ type: 'success', text: 'Configuration saved successfully.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save configuration.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save configuration.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">Configuration</h1>
      <p className="text-stone-500 mb-6">Manage store settings, SEO defaults, and structured data.</p>

      <div className="flex gap-1 mb-6 border-b border-stone-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#D4A5A5] text-[#D4A5A5]'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          {activeTab === 'store' && (
            <FieldGroup fields={STORE_FIELDS} form={form} setForm={setForm} />
          )}
          {activeTab === 'seo' && (
            <FieldGroup fields={SEO_META_FIELDS} form={form} setForm={setForm} />
          )}
          {activeTab === 'organization' && (
            <FieldGroup fields={SEO_ORG_FIELDS} form={form} setForm={setForm} />
          )}
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === 'success' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 px-6 py-2.5 bg-[#D4A5A5] text-white rounded-lg font-medium hover:bg-[#B88A8A] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  )
}
