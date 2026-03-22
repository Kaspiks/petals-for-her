import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { X, Save, Upload, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const ACCENT = '#E8365D'
const BG = '#FAF9F7'

interface Category {
  id: number
  name: string
  slug: string
  category_type: 'product' | 'journal'
  description?: string
  active: boolean
  visibility: 'public' | 'internal'
  parent_category_id?: number | null
  parent_category_name?: string | null
  items_count?: number
  hero_image_url?: string | null
}

interface ParentCategory {
  id: number
  name: string
  slug: string
  category_type: string
}

const emptyForm = {
  name: '',
  slug: '',
  category_type: 'product' as 'product' | 'journal',
  description: '',
  parent_category_id: '' as number | '',
  active: true,
  visibility: 'public' as 'public' | 'internal',
}

function categoryToForm(cat: Category) {
  return {
    name: cat.name ?? '',
    slug: cat.slug ?? '',
    category_type: (cat.category_type ?? 'product') as 'product' | 'journal',
    description: cat.description ?? '',
    parent_category_id: (cat.parent_category_id ?? '') as number | '',
    active: cat.active ?? true,
    visibility: (cat.visibility ?? 'public') as 'public' | 'internal',
  }
}

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchWithAuth } = useAuth()
  const isEditMode = Boolean(id && id !== 'new')

  const [category, setCategory] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadCategory = useCallback(async () => {
    if (!id || id === 'new') return
    try {
      const res = await fetchWithAuth(`/api/v1/admin/categories/${id}`)
      if (!res.ok) throw new Error('Category not found')
      const data = (await res.json()) as Category
      setCategory(data)
      setForm(categoryToForm(data))
      if (data.hero_image_url) setHeroPreview(data.hero_image_url)
    } catch {
      setError('Category not found')
    } finally {
      setLoading(false)
    }
  }, [id, fetchWithAuth])

  const loadParentCategories = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/v1/admin/categories?per_page=999')
      if (res.ok) {
        const json = await res.json()
        const list = (json.data ?? []) as ParentCategory[]
        setParentCategories(list.filter((c) => !id || String(c.id) !== id))
      }
    } catch {
      // ignore
    }
  }, [id, fetchWithAuth])

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false)
      loadParentCategories()
      return
    }
    loadCategory()
  }, [isEditMode, loadCategory])

  useEffect(() => {
    loadParentCategories()
  }, [loadParentCategories])

  const handleDiscard = () => {
    navigate('/admin/categories')
  }

  const handleHeroClick = () => {
    fileInputRef.current?.click()
  }

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setHeroFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setHeroPreview(reader.result as string)
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file.')
      return
    }
    setHeroFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setHeroPreview(reader.result as string)
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleHeroDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleHeroDragLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = async () => {
    setError(null)
    if (!form.name?.trim()) {
      setError('Category name is required.')
      return
    }

    setSaving(true)
    try {
      const hasImage = !!heroFile
      const useFormData = hasImage

      if (useFormData) {
        const fd = new FormData()
        fd.append('name', form.name.trim())
        fd.append('category_type', form.category_type)
        fd.append('description', form.description?.trim() || '')
        fd.append('active', String(form.active))
        fd.append('visibility', form.visibility)
        if (form.slug?.trim()) fd.append('slug', form.slug.trim())
        if (form.parent_category_id) fd.append('parent_category_id', String(form.parent_category_id))
        fd.append('hero_image', heroFile!)

        const token = localStorage.getItem('petals_jwt')
        const url = isEditMode
          ? `/api/v1/admin/categories/${id}`
          : '/api/v1/admin/categories'
        const method = isEditMode ? 'PATCH' : 'POST'
        const res = await fetch(url, {
          method,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          navigate('/admin/categories')
        } else {
          setError((data as { errors?: string[] }).errors?.join(', ') || 'Failed to save category.')
        }
      } else {
        const body = {
          name: form.name.trim(),
          category_type: form.category_type,
          description: form.description?.trim() || '',
          active: form.active,
          visibility: form.visibility,
          slug: form.slug?.trim() || undefined,
          parent_category_id: form.parent_category_id || null,
        }
        const url = isEditMode
          ? `/api/v1/admin/categories/${id}`
          : '/api/v1/admin/categories'
        const method = isEditMode ? 'PATCH' : 'POST'
        const res = await fetchWithAuth(url, {
          method,
          body: JSON.stringify(body),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          navigate('/admin/categories')
        } else {
          setError((data as { errors?: string[] }).errors?.join(', ') || 'Failed to save category.')
        }
      }
    } catch {
      setError('Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this category? This will affect all its products.')) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetchWithAuth(`/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        navigate('/admin/categories')
      } else {
        const data = await res.json().catch(() => ({}))
        setError((data as { errors?: string[] }).errors?.join(', ') || 'Failed to delete category.')
      }
    } catch {
      setError('Failed to delete category.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: BG }}>
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-4 bg-stone-200 rounded w-64" />
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 h-96 bg-stone-200 rounded-xl" />
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 bg-stone-200 rounded-xl" />
              <div className="h-32 bg-stone-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !category && isEditMode) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: BG }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-stone-600 mb-4">{error}</p>
          <Link
            to="/admin/categories"
            className="font-medium hover:underline"
            style={{ color: ACCENT }}
          >
            &larr; Back to categories
          </Link>
        </div>
      </div>
    )
  }

  const breadcrumbLabel = isEditMode ? 'Edit Category' : 'New Category'

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: BG }}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link
            to="/admin"
            className="hover:opacity-80 transition-colors"
            style={{ color: ACCENT }}
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <Link
            to="/admin/categories"
            className="hover:opacity-80 transition-colors"
            style={{ color: ACCENT }}
          >
            Categories
          </Link>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <span className="text-stone-800">{breadcrumbLabel}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-stone-900">{breadcrumbLabel}</h1>
          <div className="flex gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              <X className="w-4 h-4" />
              Discard
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - General Information */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic details about this category.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Category Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Seasonal Bouquets"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={form.category_type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category_type: e.target.value as 'product' | 'journal',
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{ borderColor: '#e7e5e4' }}
                  >
                    <option value="product">Product</option>
                    <option value="journal">Journal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Slug</label>
                  <div className="flex rounded-md border border-input shadow-sm overflow-hidden">
                    <span className="inline-flex items-center px-3 bg-stone-100 text-stone-500 text-sm border-r border-input">
                      /
                    </span>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="category-slug"
                      className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe this category..."
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={form.parent_category_id || ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        parent_category_id: e.target.value
                          ? (Number(e.target.value) as number | '')
                          : '',
                      }))
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{ borderColor: '#e7e5e4' }}
                  >
                    <option value="">None</option>
                    {parentCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category_type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Hero Image
                  </label>
                  <div
                    onClick={handleHeroClick}
                    onDrop={handleHeroDrop}
                    onDragOver={handleHeroDragOver}
                    onDragLeave={handleHeroDragLeave}
                    className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[140px] ${
                      isDragging ? 'border-[#E8365D] bg-[#E8365D]/5' : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroChange}
                      className="hidden"
                    />
                    {heroPreview ? (
                      <div className="w-full p-4">
                        <img
                          src={heroPreview}
                          alt="Hero preview"
                          className="max-h-48 w-full object-contain rounded-lg"
                        />
                        <p className="text-xs text-stone-500 mt-2 text-center">
                          Click or drop a new image to replace
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-stone-400 mb-2" />
                        <p className="text-sm font-medium text-stone-600">Drop your image here</p>
                        <p className="text-xs text-stone-500 mt-1">
                          or{' '}
                          <span className="underline" style={{ color: ACCENT }}>
                            click to browse files
                          </span>
                        </p>
                        <p className="text-xs text-stone-400 mt-2">
                          Recommended: 1920×600px
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-700">Active Status</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Set if category is live
                    </p>
                  </div>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700 mb-3">Visibility</p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={form.visibility === 'public'}
                        onChange={() => setForm((f) => ({ ...f, visibility: 'public' }))}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Public</p>
                        <p className="text-xs text-stone-500">
                          Visible to all customers
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={form.visibility === 'internal'}
                        onChange={() => setForm((f) => ({ ...f, visibility: 'internal' }))}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Internal</p>
                        <p className="text-xs text-stone-500">
                          Staff only access
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats - edit mode only */}
            {isEditMode && category && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-100">
                    <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-stone-800 mt-1">
                      {category.items_count ?? 0}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Live Products/Articles
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-600 font-medium">+0%</span>
                    <span className="text-stone-500">Monthly Growth</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone - edit mode only */}
            {isEditMode && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-red-800">Danger Zone</CardTitle>
                  <CardDescription className="text-red-700">
                    Deleting this category will affect all its products.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                  >
                    {deleting ? 'Deleting...' : 'Delete Category'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
