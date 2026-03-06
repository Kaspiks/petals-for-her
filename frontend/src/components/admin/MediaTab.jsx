import { useRef } from 'react'

export default function MediaTab({
  images = [],
  onImageChange,
  onImageRemove,
  label = 'Featured Image',
  maxSlots = 3,
}) {
  const fileInputRefs = useRef([])

  const slots = Array.from({ length: maxSlots }, (_, i) => images[i] || { file: null, preview: null, existingUrl: null })

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <h2 className="text-base font-semibold text-stone-800 mb-5">{label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {slots.map((slot, index) => {
          const hasImage = slot.preview || slot.existingUrl
          const isPrimary = index === 0

          return (
            <div key={index} className="relative group">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRefs.current[index]?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRefs.current[index]?.click()}
                className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#E8365D]/40 hover:bg-[#FFF0F0]/30 transition-colors overflow-hidden ${
                  hasImage ? 'border-stone-200' : 'border-stone-300'
                }`}
                style={{ minHeight: isPrimary ? 200 : 160 }}
              >
                <input
                  ref={(el) => { fileInputRefs.current[index] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onImageChange(index, e)}
                />
                {slot.preview ? (
                  <img src={slot.preview} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                ) : slot.existingUrl ? (
                  <img src={slot.existingUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                ) : isPrimary ? (
                  <>
                    <svg className="w-10 h-10 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-stone-600">Upload Primary Image</p>
                    <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 10MB</p>
                  </>
                ) : (
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>

              {hasImage && onImageRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onImageRemove(index)
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-stone-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
