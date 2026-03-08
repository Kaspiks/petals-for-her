import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <svg className="w-6 h-6 text-[#E8365D]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl font-semibold text-white">Petals</span>
                <span className="font-sans text-lg font-medium text-stone-400">for Her</span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              Crafting luxury floral moments since 2012. Each arrangement is a masterpiece of elegance, designed to celebrate life's most meaningful occasions.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-5 font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-stone-400 hover:text-white transition">Track Order</a></li>
              <li><a href="#" className="text-sm text-stone-400 hover:text-white transition">Delivery Info</a></li>
              <li><a href="#" className="text-sm text-stone-400 hover:text-white transition">Care Guide</a></li>
              <li><Link to="/contact_us" className="text-sm text-stone-400 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-5 font-semibold">Occasions</h3>
            <ul className="space-y-3">
              <li><Link to="/products?view=occasions" className="text-sm text-stone-400 hover:text-white transition">Anniversary</Link></li>
              <li><Link to="/products?view=occasions" className="text-sm text-stone-400 hover:text-white transition">Birthday</Link></li>
              <li><Link to="/products" className="text-sm text-stone-400 hover:text-white transition">New Arrivals</Link></li>
              <li><Link to="/products" className="text-sm text-stone-400 hover:text-white transition">Corporate Gifts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-5 font-semibold">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#E8365D] hover:text-white transition" aria-label="Favorites">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#E8365D] hover:text-white transition" aria-label="Love">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#E8365D] hover:text-white transition" aria-label="Share">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">
            © 2026 Petals for Her Luxury Florists. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy_policy" className="text-sm text-stone-500 hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-stone-500 hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
