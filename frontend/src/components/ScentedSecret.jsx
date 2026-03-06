const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Artisanal Craftsmanship',
    description: 'Each piece is meticulously handcrafted with attention to detail, ensuring every petal and stem meets our exacting standards.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Bespoke Fragrances',
    description: 'Our unique fragrance infusions provide an aroma to every product that has a delightfully long-lasting scent.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Everlasting Bloom',
    description: 'Handmade to stay fresh for years. No watering, no wilting—just perpetual beauty in your space.',
  },
]

function ScentedSecret() {
  return (
    <section id="scents" className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800 mb-4">
          The Scented Secret
        </h2>
        <p className="text-stone-600 leading-relaxed">
          Our unique fragrance infusions provide an aroma to every product that has a delightfully long lasting aroma, 
          handmade to stay fresh for years.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-stone-200 text-[#D4A5A5] mb-4">
                {feature.icon}
              </div>
              <h3 className="font-sans font-semibold text-stone-800 mb-2">{feature.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScentedSecret
