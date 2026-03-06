function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4 font-sans">
            Our Signature Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-800 leading-tight mb-6">
            Timeless Beauty,{' '}
            <span className="italic text-[#D4A5A5]">Captured in</span>
            <br />
            <span className="italic text-[#D4A5A5]">Fragrance</span>
          </h1>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Experience the luxury of hyper-realistic silk bouquets infused with bespoke scents that never fade. 
            A permanent bloom for your most precious spaces.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#collections"
              className="inline-flex items-center px-6 py-3 bg-[#D4A5A5] text-white font-medium rounded transition hover:bg-[#B88A8A]"
            >
              Explore Collections
            </a>
            <a
              href="#scents"
              className="inline-flex items-center px-6 py-3 bg-white border border-stone-200 text-stone-700 font-medium rounded transition hover:border-stone-300"
            >
              Our Signature Scents
            </a>
          </div>
        </div>

        {/* Right – image & testimonial */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-[4/5] max-h-[600px] shadow-xl">
            <img
              src="/hero-bouquet.png"
              alt="Pink rose bouquet"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/40" />
          </div>
          {/* Testimonial card */}
          <div className="absolute -bottom-6 left-0 right-0 mx-4 sm:mx-0 sm:left-8 sm:right-auto bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <p className="font-serif italic text-stone-700 text-sm">
              &ldquo;The scent always takes me immediately back&rdquo;
            </p>
            <p className="text-xs text-stone-500 mt-1">— ELEANOR V.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
