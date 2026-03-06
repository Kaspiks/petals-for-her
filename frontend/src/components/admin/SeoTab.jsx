const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-[#E8365D]/20 focus:border-[#E8365D] outline-none transition-colors'

function slugify(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function SeoTab({ form, setForm, slugSource }) {
  const slug = slugify(slugSource ?? form.name ?? '')

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <h2 className="text-base font-semibold text-stone-800 mb-1">SEO Settings</h2>
      <p className="text-xs text-stone-400 mb-5">Override the auto-generated title and description for search engines.</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Title</label>
          <input
            type="text"
            value={form.meta_title ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
            placeholder="Custom page title for search results"
            className={inputClass}
          />
          <p className="text-xs text-stone-400 mt-1 text-right">{(form.meta_title ?? '').length}/60 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Description</label>
          <textarea
            value={form.meta_description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
            placeholder="Custom description for search results"
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-stone-400 mt-1 text-right">{(form.meta_description ?? '').length}/160 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug ?? slug}
            readOnly
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-500 outline-none cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}
