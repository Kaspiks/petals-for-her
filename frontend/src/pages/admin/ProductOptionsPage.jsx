import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const CLASSIFICATION_CODES = ['vase_type', 'ribbon_material', 'ribbon_color', 'primary_fragrance']
const CODE_LABELS = {
  vase_type: 'Vase Options',
  ribbon_material: 'Ribbon Material',
  ribbon_color: 'Ribbon Color',
  primary_fragrance: 'Primary Fragrance',
}

export default function ProductOptionsPage() {
  const { fetchWithAuth } = useAuth()
  const [classifications, setClassifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(null)
  const [draft, setDraft] = useState({})

  useEffect(() => {
    async function fetchClassifications() {
      const res = await fetchWithAuth(`/api/v1/admin/classifications?codes=${CLASSIFICATION_CODES.join(',')}`)
      if (res.ok) {
        const data = await res.json()
        setClassifications(data)
      }
      setLoading(false)
    }
    fetchClassifications()
  }, [fetchWithAuth])

  async function addValue(classificationId, code) {
    const value = (draft[code]?.value || '').trim()
    if (!value) return
    setAdding(code)
    try {
      const body = { value }
      if (code === 'ribbon_color' && (draft[code]?.hex_code || '').trim()) {
        body.hex_code = (draft[code].hex_code || '').trim()
      }
      const res = await fetchWithAuth(`/api/v1/admin/classifications/${classificationId}/classification_values`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const added = await res.json()
        setClassifications((prev) =>
          prev.map((c) =>
            c.id === classificationId
              ? { ...c, values: [...(c.values || []), added] }
              : c
          )
        )
        setDraft((prev) => ({ ...prev, [code]: {} }))
      }
    } finally {
      setAdding(null)
    }
  }

  async function removeValue(classificationId, valueId) {
    if (!window.confirm('Remove this option?')) return
    const res = await fetchWithAuth(
      `/api/v1/admin/classifications/${classificationId}/classification_values/${valueId}`,
      { method: 'DELETE' }
    )
    if (res.ok) {
      setClassifications((prev) =>
        prev.map((c) =>
          c.id === classificationId
            ? { ...c, values: (c.values || []).filter((v) => v.id !== valueId) }
            : c
        )
      )
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
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">Product Options</h1>
      <p className="text-stone-500 mb-6">Manage vase options, ribbon materials, ribbon colors, and fragrance profiles. Add new options to use when creating products.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classifications.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              {CODE_LABELS[c.code] || c.name}
            </h2>
            <ul className="space-y-2 mb-4">
              {(c.values || []).map((v) => (
                <li key={v.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {c.code === 'ribbon_color' && v.hex_code && (
                      <span
                        className="w-5 h-5 rounded border border-stone-200"
                        style={{ backgroundColor: v.hex_code }}
                      />
                    )}
                    <span className="text-stone-700">{v.value}</span>
                  </div>
                  <button
                    onClick={() => removeValue(c.id, v.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {(!c.values || c.values.length === 0) && (
                <li className="text-sm text-stone-500 py-2">No options yet.</li>
              )}
            </ul>
            <div className="pt-4 border-t border-stone-100">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={draft[c.code]?.value ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [c.code]: { ...prev[c.code], value: e.target.value } }))}
                  onKeyDown={(e) => e.key === 'Enter' && addValue(c.id, c.code)}
                  placeholder={`Add ${CODE_LABELS[c.code]?.toLowerCase() || 'option'}...`}
                  className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30"
                />
                {c.code === 'ribbon_color' && (
                  <input
                    type="text"
                    value={draft[c.code]?.hex_code ?? ''}
                    onChange={(e) => setDraft((prev) => ({ ...prev, [c.code]: { ...prev[c.code], hex_code: e.target.value } }))}
                    placeholder="#hex"
                    className="w-24 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30"
                  />
                )}
                <button
                  onClick={() => addValue(c.id, c.code)}
                  disabled={adding === c.code || !(draft[c.code]?.value || '').trim()}
                  className="px-4 py-2 bg-[#D4A5A5] text-white rounded-lg text-sm font-medium hover:bg-[#B88A8A] disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
