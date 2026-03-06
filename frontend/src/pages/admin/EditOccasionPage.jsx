import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
  active: true,
  meta_title: '',
  meta_description: '',
  product_ids: [],
}

function occasionToForm(occasion) {
  return {
    name: occasion.name ?? '',
    description: occasion.description ?? '',
    active: occasion.active ?? true,
    meta_title: occasion.meta_title ?? '',
    meta_description: occasion.meta_description ?? '',
    slug: occasion.slug ?? '',
    product_ids: occasion.product_ids ?? [],
  }
}

export default function EditOccasionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchWithAuth } = useAuth()
  const [occasion, setOccasion] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [images, setImages] = useState([
    { file: null, preview: null, existingUrl: null },
    { file: null, preview: null, existingUrl: null },
    { file: null, preview: null, existingUrl: null },
  ])

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const res = await fetchWithAuth(`/api/v1/admin/occasions/${id}`)
        if (!res.ok) throw new Error('Occasion not found')
        const data = await res.json()
        setOccasion(data)
        setForm(occasionToForm(data))
        setImages([
          { file: null, preview: null, existingUrl: data.featured_image_url || null },
          { file: null, preview: null, existingUrl: data.gallery_image_urls?.[0] || null },
          { file: null, preview: null, existingUrl: data.gallery_image_urls?.[1] || null },
        ])
      } catch (err) {
        setError(err.message || 'Occasion not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, fetchWithAuth])

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
      setError('Occasion name is required.')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('description', form.description?.trim() || '')
      fd.append('active', form.active ? 'true' : 'false')
      fd.append('meta_title', form.meta_title?.trim() || '')
      fd.append('meta_description', form.meta_description?.trim() || '')
      if (images[0]?.file) fd.append('featured_image', images[0].file)
      images.slice(1).forEach((slot) => {
        if (slot?.file) fd.append('gallery_images[]', slot.file)
      })
      ;(form.product_ids ?? []).forEach((pid) => fd.append('product_ids[]', pid))

      const token = localStorage.getItem('petals_jwt')
      const res = await fetch(`/api/v1/admin/occasions/${id}`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        navigate('/admin/occasions')
      } else {
        setError(data.errors?.join(', ') || data.error || 'Failed to update occasion.')
      }
    } catch (err) {
      setError(err.message || 'Failed to update occasion.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this occasion? This action cannot be undone.')) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetchWithAuth(`/api/v1/admin/occasions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        navigate('/admin/occasions')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.errors?.join(', ') || data.error || 'Failed to delete occasion.')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete occasion.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] p-8">
        <div className="animate-pulse space-y-6 max-w-6xl mx-auto">
          <div className="h-4 bg-stone-200 rounded w-48" />
          <div className="h-8 bg-stone-200 rounded w-72" />
          <div className="h-10 bg-stone-200 rounded w-full max-w-md" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-96 bg-stone-200 rounded-xl" />
            <div className="h-96 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !occasion) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-stone-600 mb-4">{error}</p>
          <Link to="/admin/occasions" className="text-[#E8365D] font-medium hover:underline">
            &larr; Back to occasions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-6">
          <Link to="/admin/occasions" className="hover:text-[#E8365D] transition-colors">
            Occasions
          </Link>
          <span className="mx-2 text-stone-300">&rsaquo;</span>
          <span className="text-stone-800">{occasion?.name ?? 'Edit'}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Edit Occasion</h1>
            <p className="text-stone-500 mt-1">Update occasion details and product curation.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/admin/occasions"
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
              {saving ? 'Saving...' : 'Save Changes'}
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
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* General Info */}
            {activeTab === 'general' && (
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-stone-800 mb-5">Basic Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={form.name ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Birthday, Anniversary"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <textarea
                      value={form.description ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Describe this occasion..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media */}
            {activeTab === 'media' && (
              <MediaTab
                images={images}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                label="Featured Image"
              />
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <ProductPicker
                selectedProductIds={form.product_ids ?? []}
                onSelectionChange={(ids) => setForm((f) => ({ ...f, product_ids: ids }))}
                fetchWithAuth={fetchWithAuth}
              />
            )}

            {/* SEO */}
            {activeTab === 'seo' && <SeoTab form={form} setForm={setForm} slugSource={form.name} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-stone-800 mb-4">Status</h3>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: true }))}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    form.active
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                      : 'bg-stone-50 text-stone-600 border-2 border-transparent'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: false }))}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    !form.active
                      ? 'bg-stone-200 text-stone-700 border-2 border-stone-400'
                      : 'bg-stone-50 text-stone-600 border-2 border-transparent'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Expert Tip</h3>
              <p className="text-sm text-amber-700">
                Curate 3–5 products per occasion for best conversion. Too many options can overwhelm customers.
              </p>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                Deleting this occasion will remove it from the storefront. Associated products will not be deleted.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Occasion'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
