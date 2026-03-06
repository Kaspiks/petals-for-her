import { Link, useNavigate } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="font-serif text-xl font-semibold text-white">Petals</span>
              <span className="font-sans text-lg font-medium text-stone-400">for Her</span>
            </a>
            <p className="text-sm text-stone-400 mb-4">
              Timeless beauty, captured in fragrance. Hyper-realistic silk bouquets with bespoke scents.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-stone-400 hover:text-white transition" aria-label="Share">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition" aria-label="Link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['SHOP', 'WISHLIST', 'GIFT CARD', 'FIND CARE', 'OUR STORY'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition">SHIPPING & RETURNS</a></li>
              <li><Link to="/contact_us" className="text-sm hover:text-white transition">CONTACT US</Link></li>
              <li><a href="#" className="text-sm hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="text-sm hover:text-white transition">ACCESSIBILITY</a></li>
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Boutique Location</h3>
            <p className="text-sm text-stone-400">
              Rand
              <br />
              Street
              <br />
              Num
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500">
            © 2026 Petals for Her. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy_policy" className="text-sm text-stone-500 hover:text-white transition">PRIVACY POLICY</Link>
            <Link to="/terms" className="text-sm text-stone-500 hover:text-white transition">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
