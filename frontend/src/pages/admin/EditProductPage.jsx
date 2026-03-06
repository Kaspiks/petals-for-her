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
    image_url: product.image_url,
  }
}

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchWithAuth } = useAuth()
  const [product, setProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [collections, setCollections] = useState([])
  const [classifications, setClassifications] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const [productRes, collectionsRes, classificationsRes] = await Promise.all([
          fetchWithAuth(`/api/v1/admin/products/${id}`),
          fetch('/api/v1/collections'),
          fetchWithAuth('/api/v1/admin/classifications?codes=vase_type,ribbon_material,ribbon_color,primary_fragrance'),
        ])
        if (!productRes.ok) throw new Error('Product not found')
        const productData = await productRes.json()
        setProduct(productData)
        setForm(productToForm(productData))
        if (collectionsRes.ok) setCollections(await collectionsRes.json())
        if (classificationsRes.ok) {
          const data = await classificationsRes.json()
          const map = {}
          data.forEach((c) => { map[c.code] = c })
          setClassifications(map)
        }
      } catch {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, fetchWithAuth])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
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
      }

      let res
      if (imageFile) {
        const fd = new FormData()
        Object.entries(body).forEach(([k, v]) => {
          if (v != null && v !== '') fd.append(k, v)
        })
        fd.append('image', imageFile)
        const token = localStorage.getItem('petals_jwt')
        res = await fetch(`/api/v1/admin/products/${id}`, {
          method: 'PATCH',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        })
      } else {
        res = await fetchWithAuth(`/api/v1/admin/products/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      }

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        navigate(`/admin/products/${id}`)
      } else {
        setError(data.errors?.join(', ') || 'Failed to update product.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-64" />
          <div className="h-96 bg-stone-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="p-8">
        <p className="text-stone-600 mb-4">{error}</p>
        <Link to="/admin/products" className="text-[#D4A5A5] font-medium hover:underline">
          ← Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <nav className="text-sm text-stone-500 mb-4">
        <Link to="/admin/products" className="hover:text-[#D4A5A5]">Products</Link>
        <span className="mx-2">›</span>
        <Link to={`/admin/products/${id}`} className="hover:text-[#D4A5A5]">{product?.name}</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-800">Edit</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-2">Edit Product</h1>
          <p className="text-stone-500 mt-1">Update your floral arrangement configuration.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/admin/products/${id}`}
            className="px-4 py-2 border border-stone-200 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-[#D4A5A5] text-white rounded-lg font-medium hover:bg-[#B88A8A] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        collections={collections}
        classifications={classifications}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        saving={saving}
        error={error}
        mode="edit"
      />
    </div>
  )
}
