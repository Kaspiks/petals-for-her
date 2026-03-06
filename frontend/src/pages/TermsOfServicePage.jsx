import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function FloralDivider() {
  return (
    <div className="flex justify-center py-6">
      <svg className="w-6 h-6 text-stone-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
      </svg>
    </div>
  )
}

function TermsOfServicePage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of use for Petals for Her. Read our terms before creating an account or making a purchase."
        canonicalPath="/terms"
      />
      <Header />
      <main className="min-h-screen bg-white">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-stone-800 text-center">
            Terms of Service
          </h1>
          <p className="text-stone-500 text-sm text-center mt-2">Last Updated: February 27, 2026</p>
          <div className="w-16 h-0.5 bg-[#D4A5A5] mx-auto mt-4 mb-12" />

          <div className="space-y-8 text-stone-600">
            <div>
              <p className="text-stone-600 leading-relaxed">
                Welcome to Petals for Her. By using our service, you agree to these terms.
                Please read them carefully before creating an account or making a purchase.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Use of Service</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Our boutique offers handcrafted scented silk flowers and everlasting blooms. By creating
                an account or making a purchase, you agree to use our service in accordance with these
                terms and in a manner that respects our community and artisans.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Orders &amp; Returns</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                All orders are subject to availability. Please refer to our Shipping &amp; Returns policy
                for information on delivery, refunds, and exchanges of our signature scents and collections.
              </p>
            </div>

            <FloralDivider />

            <div>
              <h2 className="font-sans text-lg font-semibold text-stone-800">Intellectual Property</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                The Petals for Her brand, designs, and content are protected. Unauthorized use of our
                materials is not permitted.
              </p>
            </div>

            <FloralDivider />

            <div className="rounded-xl bg-[#F5E6E6] p-6 sm:p-8">
              <h2 className="font-sans text-lg font-semibold text-stone-800">Contact Us</h2>
              <p className="mt-2 text-stone-600 leading-relaxed">
                Questions about these terms? Our team is here to assist you.
              </p>
              <a
                href="mailto:support@petalsforher.com"
                className="inline-flex items-center gap-2 mt-4 text-[#8B3E7A] font-medium hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@petalsforher.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default TermsOfServicePage
