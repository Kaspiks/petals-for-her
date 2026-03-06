import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

function ContactUsPage() {
  const { user } = useAuth()
  const hasPrefilled = useRef(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !hasPrefilled.current) {
      hasPrefilled.current = true
      setFormData((prev) => ({
        ...prev,
        name: user.full_name ?? '',
        email: user.email ?? '',
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setErrorMessage('')
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/v1/contact_messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_message: formData }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        hasPrefilled.current = false
      } else {
        setStatus('error')
        setErrorMessage(data.errors?.[0] || data.errors?.join(' ') || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF9F7]">
        {/* Two-column layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column - Contact info */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800">
                Get in Touch
              </h1>
              <p className="mt-4 text-stone-600 leading-relaxed">
                We invite you to experience the timeless beauty of our scented silk flowers.
                Reach out for bespoke arrangements or private inquiries.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Email</p>
                    <a href="mailto:concierge@petalsforher.com" className="text-stone-800 font-medium hover:text-[#4F6D65] transition">
                      concierge@petalsforher.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Phone</p>
                    <a href="tel:+15551234567" className="text-stone-800 font-medium hover:text-[#4F6D65] transition">
                      +371 25167332
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Boutique</p>
                    <p className="text-stone-800">
                      Filler address<br />
                      <span className="text-stone-500 text-sm">City, INDEX</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Studio image */}
              <div className="mt-10 relative aspect-square max-w-sm overflow-hidden rounded-lg">
                <img
                  src="/hero-bouquet.png"
                  alt="Petals for Her studio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-4">
                  <p className="text-white text-sm font-medium">
                    Hand-scenting each petal in our Riga studio.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Contact form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4F6D65]/50 focus:border-[#4F6D65]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4F6D65]/50 focus:border-[#4F6D65]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4F6D65]/50 focus:border-[#4F6D65]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Share your floral dreams with us..."
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4F6D65]/50 focus:border-[#4F6D65] resize-none"
                  />
                </div>
                {status === 'success' && (
                  <p className="text-green-700 text-sm">Thank you! Your message has been sent.</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#4F6D65] text-white font-medium rounded-lg hover:bg-[#3d5a52] transition uppercase text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Private Scent Consultation section */}
        <section className="border-t border-stone-200 bg-white py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center gap-2 mb-4">
              <span className="text-stone-400 text-xl">☆</span>
              <span className="text-stone-400 text-xl">☆</span>
              <span className="text-stone-400 text-xl">☆</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 italic">
              Private Scent Consultation
            </h2>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Not sure which fragrance suits your home? Book a private 20-minute session with our
              lead artisan to discover your signature scent profile.
            </p>
            <a
              href="#"
              className="inline-block mt-6 text-[#B8860B] font-medium underline hover:no-underline transition uppercase text-sm tracking-wide"
            >
              Book A Session
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ContactUsPage
