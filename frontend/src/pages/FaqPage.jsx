import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import JsonLdFAQ from '../components/JsonLdFAQ'

const ACCENT = '#E8365D'

const FAQS = [
  {
    question: 'How long do scented satin bouquets last?',
    answer:
      'Petals for Her scented satin bouquets are designed to last a lifetime visually. The bespoke fragrance infusion typically holds its full intensity for 8–12 months and remains lightly noticeable for up to two years, depending on room conditions. Unlike fresh flowers, they do not wilt, drop petals, or require water.',
  },
  {
    question: 'How are the bouquets scented?',
    answer:
      'Each bouquet is hand-finished in our Riga studio using a proprietary, food-grade fragrance infusion that bonds to the satin fibres without staining or stiffening the petals. The scent is released gradually at room temperature — no diffusers, sprays, or refills are required.',
  },
  {
    question: 'Do you deliver across Latvia?',
    answer:
      'Yes. We offer free next-day delivery anywhere in Latvia for orders placed before 14:00 local time. Riga orders before 12:00 can be scheduled for same-day delivery at no extra charge. International delivery to the EU is available with a 3–5 business day window.',
  },
  {
    question: 'Are the flowers safe for people with allergies or pets?',
    answer:
      'Yes. Our satin bouquets contain no pollen, no real plant material, and use hypoallergenic, pet-safe fragrance compounds. They are a popular choice for households with cats, dogs, and children, as well as for people with seasonal flower allergies.',
  },
  {
    question: 'Can I return a bouquet if it is not what I expected?',
    answer:
      'Absolutely. We offer a 14-day free returns policy for any non-personalised bouquet, provided it is returned in its original packaging. Personalised or custom-fragrance arrangements are eligible for store credit. Return shipping within Latvia is free of charge.',
  },
  {
    question: 'How do I care for my scented satin bouquet?',
    answer:
      'Display your bouquet away from direct sunlight to preserve the fabric colours and from heat sources to maintain the fragrance. Dust gently with a soft brush every few weeks. Avoid spraying perfume or cleaning products directly on the petals. With minimal care, your bouquet stays beautiful for years.',
  },
  {
    question: 'Can I order a custom fragrance or colour palette?',
    answer:
      'Yes. We offer bespoke fragrance blending and custom palettes for weddings, anniversaries, and corporate gifting. Contact our atelier via the contact form and our florist will work with you on a one-to-one consultation. Lead time for custom orders is typically 7–10 days.',
  },
  {
    question: 'Where is your atelier located?',
    answer:
      'Our atelier and showroom is in central Riga, Latvia, at Brīvības iela 75. You are welcome to visit Monday–Friday 10:00–19:00 or Saturday 11:00–17:00. We recommend booking ahead for fragrance consultations to ensure a florist is available.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#E8365D] transition">
          {question}
        </h3>
        <svg
          className={`w-5 h-5 text-stone-400 shrink-0 mt-1 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 pr-8">
          <p className="text-stone-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <SEO
        title="Scented satin bouquets FAQ — Petals for Her, Riga"
        description="Answers to common questions about Petals for Her scented satin bouquets — fragrance longevity, delivery across Latvia, care, returns, and bespoke orders."
        canonicalPath="/faq"
      />
      <JsonLdFAQ items={FAQS} />
      <Header />

      <main>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            Frequently Asked Questions
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900 mb-5">
            Scented satin bouquets — your questions answered
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed mb-12">
            Everything you need to know about ordering, scenting, caring for, and gifting a
            Petals for Her bouquet in Riga and across Latvia. 
          </p>

          <img
            src="/bouquet.jpg"
            alt="Scented satin bouquets handcrafted by Petals for Her in Riga, Latvia"
            className="w-full rounded-2xl object-cover mb-12"
          />

          <div>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-stone-200 bg-[#FAF9F7] p-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">
              Still have questions?
            </h2>
            <p className="text-stone-500 mb-6">
              Our florists in Riga are happy to help with bespoke fragrance consultations,
              wedding orders, and corporate gifting.
            </p>
            <Link
              to="/contact_us"
              className="inline-block px-7 py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Contact the atelier
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
