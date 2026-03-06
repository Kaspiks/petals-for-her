import { useState } from 'react'
import { Link } from 'react-router-dom'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus(data.errors?.[0] || 'Something went wrong')
      }
    } catch {
      setStatus('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto relative overflow-hidden rounded-2xl bg-[#F5E6E6] p-8 sm:p-12">
        {/* Decorative floral outline */}
        <div className="absolute top-4 right-4 opacity-20">
          <svg className="w-24 h-24 text-[#D4A5A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z"/>
          </svg>
        </div>

        <div className="relative text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 mb-2">
            Join the Petals Circle
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mb-6">
            Receive early access to seasonal collections and chic tips for your everlasting blooms.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-700 transition"
            >
              Subscribe
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-3 text-sm text-green-700">Thank you for subscribing!</p>
          )}
          {status && status !== 'success' && (
            <p className="mt-3 text-sm text-red-600">{status}</p>
          )}

          <p className="mt-4 text-xs text-stone-500">
            By subscribing, you agree to our{' '}
            <Link to="/privacy_policy" className="text-[#8B3E7A] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
