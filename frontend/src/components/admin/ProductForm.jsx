import { useRef } from 'react'

const SCENT_INTENSITIES = [
  { value: 'subtle', label: 'Subtle' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strong', label: 'Strong' },
]

const STOCK_STATUSES = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

export default function ProductForm({
  form,
  setForm,
  collections,
  classifications,
  imageFile,
  imagePreview,
  onImageChange,
  onSubmit,
  saving,
  error,
  mode = 'create',
}) {
  const fileInputRef = useRef(null)
  const vaseOptions = classifications?.vase_type?.values ?? []
  const ribbonMaterials = classifications?.ribbon_material?.values ?? []
  const ribbonColors = classifications?.ribbon_color?.values ?? []
  const fragrances = classifications?.primary_fragrance?.values ?? []

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Imagery */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Product Imagery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#D4A5A5] hover:bg-stone-50/50 transition-colors overflow-hidden"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : form.image_url ? (
                  <img src={form.image_url} alt={form.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-12 h-12 text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-stone-500 text-center px-2">Drag & drop or click to upload</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Velvet Rose Bouquet"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the floral arrangement and the mood it sets..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                />
                <p className="text-xs text-stone-400 mt-1 text-right">{form.description?.length ?? 0}/500 characters</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                    placeholder="PFH-00000"
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                  />
                  <p className="text-xs text-stone-400 mt-1">{mode === 'create' ? 'Leave blank for auto-generated SKU' : ''}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Collection</label>
                <select
                  value={form.collection_id}
                  onChange={(e) => setForm((f) => ({ ...f, collection_id: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                >
                  <option value="">Select collection</option>
                  {collections?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Specifics */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Product Specifics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Silk Material Type</label>
                <input
                  type="text"
                  value={form.silk_material_type}
                  onChange={(e) => setForm((f) => ({ ...f, silk_material_type: e.target.value }))}
                  placeholder="e.g. Mulberry Silk, Satin Blend"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-3">Vase Options</label>
                <div className="space-y-2">
                  {vaseOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="vase_option"
                        value={opt.id}
                        checked={String(form.vase_option_id) === String(opt.id)}
                        onChange={() => setForm((f) => ({ ...f, vase_option_id: opt.id }))}
                        className="text-[#D4A5A5] focus:ring-[#D4A5A5]"
                      />
                      <span className="text-stone-700">{opt.value}</span>
                    </label>
                  ))}
                  {vaseOptions.length === 0 && (
                    <p className="text-sm text-stone-500">No vase options. Add them in Product Options.</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Stock Status</label>
                <select
                  value={form.stock_status}
                  onChange={(e) => setForm((f) => ({ ...f, stock_status: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                >
                  {STOCK_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Scent Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Scent Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Primary Fragrance</label>
                <select
                  value={form.primary_fragrance_option_id}
                  onChange={(e) => setForm((f) => ({ ...f, primary_fragrance_option_id: e.target.value || '' }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                >
                  <option value="">Select a scent profile</option>
                  {fragrances.map((f) => (
                    <option key={f.id} value={f.id}>{f.value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Scent Intensity</label>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>SUBTLE</span>
                  <span>STRONG</span>
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
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#D4A5A5]"
                />
                <p className="text-sm text-stone-600 mt-1 capitalize">{form.scent_intensity}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.include_scent_refill}
                  onChange={(e) => setForm((f) => ({ ...f, include_scent_refill: e.target.checked }))}
                  className="mt-1 rounded border-stone-300 text-[#D4A5A5] focus:ring-[#D4A5A5]"
                />
                <span className="text-sm text-stone-600">Include Scent Refill — Adds a 10ml vial of the selected fragrance oil to the package.</span>
              </label>
            </div>
          </div>

          {/* Ribbon & Packaging */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Ribbon & Packaging</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Ribbon Material</label>
                <select
                  value={form.ribbon_material_id}
                  onChange={(e) => setForm((f) => ({ ...f, ribbon_material_id: e.target.value || '' }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                >
                  <option value="">Select material</option>
                  {ribbonMaterials.map((m) => (
                    <option key={m.id} value={m.id}>{m.value}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-stone-600">Gift Wrapping Included</span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setForm((f) => ({ ...f, gift_wrapping_included: f.gift_wrapping_included ? false : true }))}
                  onKeyDown={(e) => e.key === 'Enter' && setForm((f) => ({ ...f, gift_wrapping_included: f.gift_wrapping_included ? false : true }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.gift_wrapping_included ? 'bg-[#D4A5A5]' : 'bg-stone-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.gift_wrapping_included ? 'left-6' : 'left-1'}`} />
                </div>
              </label>
              <p className="text-xs text-stone-500">Add signature Petals box & tissue</p>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Ribbon Color Selection</label>
                <div className="flex flex-wrap gap-2">
                  {ribbonColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, ribbon_color_id: String(form.ribbon_color_id) === String(c.id) ? '' : c.id }))}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        String(form.ribbon_color_id) === String(c.id)
                          ? 'border-amber-400 ring-2 ring-amber-200'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex_code || '#e5e7eb' }}
                      title={c.value}
                    />
                  ))}
                  {ribbonColors.length === 0 && (
                    <p className="text-sm text-stone-500">No ribbon colors. Add them in Product Options.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {mode === 'create' && (
            <div className="bg-[#2D4A3E] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/80 mb-4">Check the style guide for photo requirements to ensure consistent aesthetics across the storefront.</p>
              <button type="button" className="text-sm font-medium text-[#D4A5A5] hover:text-[#E8C9C9]">
                VIEW STYLE GUIDE →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
