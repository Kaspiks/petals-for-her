import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const FIELDS = [
  { key: 'store_name', label: 'Store Name', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'shipping_notice', label: 'Shipping Notice', type: 'text' },
  { key: 'currency', label: 'Currency', type: 'text' },
]

export default function ConfigurationPage() {
  const { fetchWithAuth } = useAuth()
  const [settings, setSettings] = useState({})
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetchWithAuth('/api/v1/admin/configuration')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
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
        setSettings(data)
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
      <p className="text-stone-500 mb-6">Manage your store settings.</p>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-stone-600 mb-1">
                {field.label}
              </label>
              <input
                id={field.key}
                type={field.type}
                value={form[field.key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
              />
            </div>
          ))}
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
