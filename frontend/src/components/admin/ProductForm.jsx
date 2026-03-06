import { useState } from 'react'
import MediaTab from './MediaTab'
import SeoTab from './SeoTab'

const SCENT_INTENSITIES = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
]

const STOCK_STATUSES = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

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
    key: 'pricing',
    label: 'Pricing & Inventory',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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

export default function ProductForm({
  form,
  setForm,
  collections,
  classifications,
  occasions = [],
  images = [],
  onImageChange,
  onImageRemove,
  onSubmit,
  saving,
  error,
  mode = 'create',
}) {
  const [activeTab, setActiveTab] = useState('general')

  const vaseOptions = classifications?.vase_type?.values ?? []
  const fragrances = classifications?.primary_fragrance?.values ?? []

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          {error}
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info Tab */}
          {activeTab === 'general' && (
            <>
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-stone-800 mb-5">Basic Information</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Product Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Velvet Rose Bouquet"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">SKU</label>
                      <input
                        type="text"
                        value={form.sku}
                        onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                        placeholder="PFH-00000"
                        className={inputClass}
                      />
                      {mode === 'create' && (
                        <p className="text-xs text-stone-400 mt-1">Leave blank for auto-generated SKU</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the floral arrangement and the mood it sets..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                    <p className="text-xs text-stone-400 mt-1 text-right">{form.description?.length ?? 0}/500 characters</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-stone-800 mb-5">Classification</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Collection</label>
                    <select
                      value={form.collection_id}
                      onChange={(e) => setForm((f) => ({ ...f, collection_id: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">Select collection</option>
                      {collections?.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Collection Type</label>
                    <input
                      type="text"
                      value={form.collection_type}
                      onChange={(e) => setForm((f) => ({ ...f, collection_type: e.target.value }))}
                      placeholder="e.g. Signature Bouquet"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Silk Material Type</label>
                    <input
                      type="text"
                      value={form.silk_material_type}
                      onChange={(e) => setForm((f) => ({ ...f, silk_material_type: e.target.value }))}
                      placeholder="e.g. Mulberry Silk, Satin Blend"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <MediaTab
              images={images}
              onImageChange={onImageChange}
              onImageRemove={onImageRemove}
              label="Product Images"
            />
          )}

          {/* Pricing & Inventory Tab */}
          {activeTab === 'pricing' && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-stone-800 mb-5">Pricing & Inventory</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-medium">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        placeholder="0.00"
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Sale Price <span className="text-stone-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-medium">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.sale_price ?? ''}
                        onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))}
                        placeholder="0.00"
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Stock Status</label>
                  <select
                    value={form.stock_status}
                    onChange={(e) => setForm((f) => ({ ...f, stock_status: e.target.value }))}
                    className={inputClass}
                  >
                    {STOCK_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">Vase Options</label>
                  <div className="space-y-2.5">
                    {vaseOptions.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          String(form.vase_option_id) === String(opt.id)
                            ? 'border-[#E8365D] bg-[#E8365D]'
                            : 'border-stone-300 group-hover:border-stone-400'
                        }`}>
                          {String(form.vase_option_id) === String(opt.id) && (
                            <span className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </span>
                        <input
                          type="radio"
                          name="vase_option"
                          value={opt.id}
                          checked={String(form.vase_option_id) === String(opt.id)}
                          onChange={() => setForm((f) => ({ ...f, vase_option_id: opt.id }))}
                          className="sr-only"
                        />
                        <span className="text-sm text-stone-700">{opt.value}</span>
                      </label>
                    ))}
                    {vaseOptions.length === 0 && (
                      <p className="text-sm text-stone-500">No vase options. Add them in Product Options.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <SeoTab form={form} setForm={setForm} slugSource={form.name} />
          )}
        </div>

        {/* Right sidebar — always visible */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-semibold text-stone-800">Status</h3>
              <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">Visibility</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-800">{form.active ? 'Published' : 'Draft'}</p>
                <p className="text-xs text-stone-400 mt-0.5">Set to draft to hide from storefront.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.active}
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  form.active ? 'bg-[#E8365D]' : 'bg-stone-200'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  form.active ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Scent Profile */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="text-base font-semibold text-stone-800 mb-4">Scent Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Primary Fragrance</label>
                <div className="space-y-2">
                  {fragrances.map((f) => (
                    <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        String(form.primary_fragrance_option_id) === String(f.id)
                          ? 'border-[#E8365D] bg-[#E8365D]'
                          : 'border-stone-300 group-hover:border-stone-400'
                      }`}>
                        {String(form.primary_fragrance_option_id) === String(f.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <input
                        type="radio"
                        name="primary_fragrance"
                        value={f.id}
                        checked={String(form.primary_fragrance_option_id) === String(f.id)}
                        onChange={() => setForm((prev) => ({ ...prev, primary_fragrance_option_id: f.id }))}
                        className="sr-only"
                      />
                      <span className="text-sm text-stone-700">{f.value}</span>
                    </label>
                  ))}
                  {fragrances.length === 0 && (
                    <p className="text-sm text-stone-500">No fragrances available.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Scent Intensity</label>
                <div className="flex items-center justify-between text-[10px] font-medium tracking-wider text-stone-400 uppercase mb-1.5">
                  <span>Subtle</span>
                  <span>Strong</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={(() => {
                    const idx = SCENT_INTENSITIES.findIndex((s) => s.value === form.scent_intensity)
                    return idx >= 0 ? idx : 1
                  })()}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    scent_intensity: SCENT_INTENSITIES[parseInt(e.target.value, 10)]?.value ?? 'moderate',
                  }))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#E8365D]"
                />
                <p className="text-sm text-stone-600 mt-1.5 capitalize text-center">{form.scent_intensity}</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.include_scent_refill}
                  onChange={(e) => setForm((f) => ({ ...f, include_scent_refill: e.target.checked }))}
                  className="mt-0.5 rounded border-stone-300 text-[#E8365D] focus:ring-[#E8365D]"
                />
                <span className="text-sm text-stone-600">Include Scent Refill</span>
              </label>
            </div>
          </div>

          {/* Occasions */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="text-base font-semibold text-stone-800 mb-3">Occasions</h3>
            <p className="text-xs text-stone-400 mb-3">Select the occasions this product is suitable for.</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {occasions.length === 0 && (
                <p className="text-sm text-stone-500">No occasions available.</p>
              )}
              {occasions.map((occ) => {
                const selected = (form.occasion_ids ?? []).map(String).includes(String(occ.id))
                return (
                  <label key={occ.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        setForm((f) => {
                          const current = (f.occasion_ids ?? []).map(Number)
                          const next = selected
                            ? current.filter((id) => id !== occ.id)
                            : [...current, occ.id]
                          return { ...f, occasion_ids: next }
                        })
                      }}
                      className="rounded border-stone-300 text-[#E8365D] focus:ring-[#E8365D]"
                    />
                    <span className="text-sm text-stone-700">{occ.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Expert Tip */}
          <div className="bg-[#FFF0F0] border border-[#E8365D]/20 rounded-xl p-6">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#E8365D] mb-2">Expert Tip</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Use high-quality photos with natural lighting against a clean background. Product images at 1200×1200px work best for the storefront grid and detail views.
            </p>
          </div>

          {/* Danger Zone (edit mode only) */}
          {mode === 'edit' && (
            <div className="bg-[#FFF0F0] border border-red-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-stone-600 mb-4">Deleting the product is permanent and cannot be undone.</p>
              <button
                type="button"
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
