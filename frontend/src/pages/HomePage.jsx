import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ScentedSecret from '../components/ScentedSecret'
import CuratedCollections from '../components/CuratedCollections'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/v1/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <ScentedSecret />
      <CuratedCollections products={products} />
      <Newsletter />
      <Footer />
    </>
  )
}

export default HomePage
