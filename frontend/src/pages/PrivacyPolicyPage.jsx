import Header from '../components/Header'
import Footer from '../components/Footer'

function FloralDivider() {
  return (
    <div className="flex justify-center py-6">
      <svg className="w-6 h-6 text-stone-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
      </svg>
    </div>
  )
}

function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-stone-800 text-center">
            Privacy Policy
          </h1>
          <p className="text-stone-500 text-sm text-center mt-2">Last Updated: February 27, 2026</p>
          <div className="w-16 h-0.5 bg-[#D4A5A5] mx-auto mt-4 mb-12" />

          <div className="space-y-8 text-stone-600">
            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Information We Collect</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                We collect your name, contact information, shipping address, and browsing behavior when you
                create an account, place an order, or interact with our boutique. This helps us provide
                a personalized experience with our artisan-crafted, scented silk flowers.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">How We Use Your Data</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Your data is used for order fulfillment, sending updates, managing your account, and
                delivering our newsletter with seasonal collection previews. We never sell your
                information to third parties.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Scent Preference Privacy</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Your scent preferences are stored securely to personalize recommendations for our
                everlasting blooms. This data is used solely to enhance your shopping experience.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Security Measures</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                We protect your information with SSL encryption and industry-standard security
                practices to ensure your data remains safe.
              </p>
            </div>

            <FloralDivider />

            <div className="rounded-xl bg-[#F5E6E6] p-6 sm:p-8">
              <h2 className="font-sans text-lg font-semibold text-stone-800">Contact Our Privacy Officer</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Have questions about our privacy practices? We&apos;re here to help.
              </p>
              <a
                href="mailto:privacy@petalsforher.com"
                className="inline-flex items-center gap-2 mt-4 text-[#8B3E7A] font-medium hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                privacy@petalsforher.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default PrivacyPolicyPage
