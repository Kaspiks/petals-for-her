import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ProductForm from '../../components/admin/ProductForm'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  collection_id: '',
  collection_type: '',
  primary_fragrance_option_id: '',
  scent_intensity: 'moderate',
  include_scent_refill: false,
  silk_material_type: '',
  vase_option_id: '',
  stock_status: 'in_stock',
  ribbon_material_id: '',
  gift_wrapping_included: true,
  ribbon_color_id: '',
  sku: '',
  meta_title: '',
  meta_description: '',
  occasion_ids: [],
  active: true,
}

function productToForm(product) {
  return {
    ...emptyForm,
    name: product.name ?? '',
    description: product.description ?? '',
    price: String(product.price ?? ''),
    collection_id: product.collection?.id ? String(product.collection.id) : '',
    collection_type: product.collection_type ?? '',
    primary_fragrance_option_id: product.primary_fragrance_option_id ? String(product.primary_fragrance_option_id) : '',
    scent_intensity: product.scent_intensity ?? 'moderate',
    include_scent_refill: product.include_scent_refill ?? false,
    silk_material_type: product.silk_material_type ?? '',
    vase_option_id: product.vase_option_id ? String(product.vase_option_id) : '',
    stock_status: product.stock_status ?? 'in_stock',
    ribbon_material_id: product.ribbon_material_id ? String(product.ribbon_material_id) : '',
    gift_wrapping_included: product.gift_wrapping_included ?? true,
    ribbon_color_id: product.ribbon_color_id ? String(product.ribbon_color_id) : '',
    sku: product.sku ?? '',
    meta_title: product.meta_title ?? '',
    meta_description: product.meta_description ?? '',
    image_url: product.image_url,
    occasion_ids: product.occasion_ids ?? [],
    active: product.active ?? true,
  }
}

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchWithAuth } = useAuth()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [collections, setCollections] = useState([])
  const [occasions, setOccasions] = useState([])
  const [classifications, setClassifications] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        const [productRes, collectionsRes, classificationsRes, occasionsRes] = await Promise.all([
          fetchWithAuth(`/api/v1/admin/products/${id}`),
          fetch('/api/v1/collections'),
          fetchWithAuth('/api/v1/admin/classifications?codes=vase_type,ribbon_material,ribbon_color,primary_fragrance'),
          fetchWithAuth('/api/v1/admin/occasions?per_page=999'),
        ])
        if (!productRes.ok) throw new Error('Product not found')
        const productData = await productRes.json()
        setProduct(productData)
        setForm(productToForm(productData))
        setImages([
          { file: null, preview: null, existingUrl: productData.image_url || null },
          { file: null, preview: null, existingUrl: productData.gallery_image_urls?.[0] || null },
          { file: null, preview: null, existingUrl: productData.gallery_image_urls?.[1] || null },
        ])
        if (collectionsRes.ok) setCollections(await collectionsRes.json())
        if (classificationsRes.ok) {
          const data = await classificationsRes.json()
          const map = {}
          data.forEach((c) => { map[c.code] = c })
          setClassifications(map)
        }
        if (occasionsRes.ok) {
          const data = await occasionsRes.json()
          setOccasions(data.data ?? [])
        }
      } catch {
        setError('Product not found')
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
      setError('Product name is required.')
      return
    }
    if (!form.collection_id) {
      setError('Please select a collection.')
      return
    }
    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) {
      setError('Please enter a valid price.')
      return
    }

    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        description: form.description?.trim() || '',
        price,
        collection_id: parseInt(form.collection_id, 10),
        collection_type: form.collection_type?.trim() || form.name.trim(),
        primary_fragrance_option_id: form.primary_fragrance_option_id || null,
        scent_intensity: form.scent_intensity,
        include_scent_refill: form.include_scent_refill,
        silk_material_type: form.silk_material_type?.trim() || null,
        vase_option_id: form.vase_option_id || null,
        stock_status: form.stock_status,
        ribbon_material_id: form.ribbon_material_id || null,
        gift_wrapping_included: form.gift_wrapping_included,
        ribbon_color_id: form.ribbon_color_id || null,
        sku: form.sku?.trim() || null,
        meta_title: form.meta_title?.trim() || '',
        meta_description: form.meta_description?.trim() || '',
        active: form.active,
      }

      const fd = new FormData()
      Object.entries(body).forEach(([k, v]) => {
        if (v != null && v !== '') fd.append(k, v)
      })
      ;(form.occasion_ids ?? []).forEach((oid) => fd.append('occasion_ids[]', oid))

      if (images[0]?.file) fd.append('image', images[0].file)
      images.slice(1).forEach((slot) => {
        if (slot?.file) fd.append('gallery_images[]', slot.file)
      })

      const token = localStorage.getItem('petals_jwt')
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        navigate(`/admin/products`)
      } else {
        setError(data.errors?.join(', ') || 'Failed to update product.')
      }
    } finally {
      setSaving(false)
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

  if (error && !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-stone-600 mb-4">{error}</p>
          <Link to="/admin/products" className="text-[#E8365D] font-medium hover:underline">
            &larr; Back to products
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
          <Link to="/admin/products" className="hover:text-[#E8365D] transition-colors">Products</Link>
          <span className="mx-2 text-stone-300">&rsaquo;</span>
          <span className="text-stone-800">Edit Product</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Edit Product: {product?.name}</h1>
            <p className="text-stone-500 mt-1">Curate your next beautiful floral masterpiece.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to={`/admin/products/${id}`}
              className="px-5 py-2.5 border border-[#E8365D] text-[#E8365D] rounded-lg font-medium hover:bg-[#E8365D]/5 transition-colors"
            >
              Discard
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 bg-[#E8365D] text-white rounded-lg font-medium hover:bg-[#D42E52] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <ProductForm
          form={form}
          setForm={setForm}
          collections={collections}
          occasions={occasions}
          classifications={classifications}
          images={images}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
          mode="edit"
        />
      </div>

      {/* Floating save button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 bg-[#E8365D] text-white rounded-xl font-medium shadow-lg shadow-[#E8365D]/25 hover:bg-[#D42E52] disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
