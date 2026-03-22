/**
 * Product Grid - fetches and displays products from a collection by slug.
 * Used by Puck ProductGrid component.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  scent_profile?: string;
}

interface ProductGridClientProps {
  title?: string;
  collection?: string;
  columns?: number;
}

export function ProductGridClient({ title, collection, columns }: ProductGridClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slug = (collection || "").trim();
    if (!slug) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch(`/api/v1/collections/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProducts(data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [collection]);

  const cols = Math.min(Math.max(columns || 3, 2), 4);
  const hasProducts = products.length > 0;

  return (
    <div className="py-12 max-w-5xl mx-auto">
      <h2
        className="text-3xl font-semibold text-stone-800 mb-8 text-center"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
      >
        {title || "Shop the Collection"}
      </h2>
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {loading ? (
          Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-stone-100 animate-pulse flex items-center justify-center"
            />
          ))
        ) : hasProducts ? (
          products.slice(0, cols * 2).map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5] mb-3">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/70">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-stone-800 group-hover:text-[#E8365D] transition text-sm">
                {product.name}
              </h3>
              <p className="text-[#E8365D] font-semibold text-sm mt-0.5">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))
        ) : (
          Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5] flex items-center justify-center text-white/70 text-sm"
            >
              Product {i + 1}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
