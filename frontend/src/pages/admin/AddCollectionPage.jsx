import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MediaTab from '../../components/admin/MediaTab'
import SeoTab from '../../components/admin/SeoTab'
import ProductPicker from '../../components/admin/ProductPicker'

const ACCENT = '#E8365D'

const TABS = [
  {
    key: 'general',
    label: 'General Info',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    ),
  },
  {
    key: 'media',
    label: 'Media',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'products',
    label: 'Products',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    key: 'seo',
    label: 'SEO',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    ),
  },
]

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-[#E8365D]/20 focus:border-[#E8365D] outline-none transition-colors'

const emptyForm = {
  name: '',
  description: '',
  meta_title: '',
  meta_description: '',
  active: true,
}

export default function AddCollectionPage() {
  const { fetchWithAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [images, setImages] = useState([
    { file: null, preview: null, existingUrl: null },
    { file: null, preview: null, existingUrl: null },
    { file: null, preview: null, existingUrl: null },
  ])
  const [productIds, setProductIds] = useState([])

  function handleImageChange(index, e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImages((prev) =>
        prev.map((slot, i) => (i === index ? { ...slot, file, preview: reader.result } : slot))
      )
    }
    reader.readAsDataURL(file)
  }

  function handleImageRemove(index) {
    setImages((prev) =>
      prev.map((slot, i) => (i === index ? { file: null, preview: null, existingUrl: null } : slot))
    )
  }

  async function handleSubmit() {
    setError(null)
    if (!form.name?.trim()) {
      setError('Collection name is required.')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('description', form.description?.trim() || '')
      fd.append('active', form.active)
      fd.append('meta_title', form.meta_title?.trim() || '')
      fd.append('meta_description', form.meta_description?.trim() || '')
      if (images[0]?.file) fd.append('featured_image', images[0].file)
      images.slice(1).forEach((slot) => {
        if (slot?.file) fd.append('gallery_images[]', slot.file)
      })
      productIds.forEach((id) => fd.append('product_ids[]', id))

      const token = localStorage.getItem('petals_jwt')
      const res = await fetch('/api/v1/admin/collections', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        navigate('/admin/collections')
      } else {
        setError(data.errors?.join(', ') || 'Failed to create collection.')
      }
    } catch {
      setError('Failed to create collection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-6">
          <Link to="/admin/collections" className="hover:text-[#E8365D] transition-colors">
            Collections
          </Link>
          <span className="mx-2 text-stone-300">&rsaquo;</span>
          <span className="text-stone-800">New Collection</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Create New Collection</h1>
            <p className="text-stone-500 mt-1">Curate a new collection of products for your store.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/admin/collections"
              className="px-5 py-2.5 border border-[#E8365D] text-[#E8365D] rounded-lg font-medium hover:bg-[#E8365D]/5 transition-colors"
            >
              Discard
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-stone-200 mb-6">
              <nav className="flex gap-1 -mb-px">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-[#E8365D] text-[#E8365D]'
                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Summer Bouquets"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe this collection..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <MediaTab
                images={images}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                label="Featured Image"
              />
            )}

            {activeTab === 'products' && (
              <ProductPicker
                selectedProductIds={productIds}
                onSelectionChange={setProductIds}
                fetchWithAuth={fetchWithAuth}
              />
            )}

            {activeTab === 'seo' && (
              <SeoTab form={form} setForm={setForm} slugSource={form.name} />
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-stone-800 mb-4">Status</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: true }))}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    form.active ? 'text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                  style={form.active ? { backgroundColor: ACCENT } : {}}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: false }))}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !form.active ? 'text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                  style={!form.active ? { backgroundColor: ACCENT } : {}}
                >
                  Draft
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-amber-900 mb-2">Expert Tip</h3>
              <p className="text-sm text-amber-800">
                Collections help customers discover related products. Use clear, descriptive names and add a compelling
                featured image to make your collection stand out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
