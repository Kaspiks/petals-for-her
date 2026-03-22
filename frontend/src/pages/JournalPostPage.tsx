import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import SEO from "../components/SEO";
import { puckConfig } from "../config/puckConfig";

interface Author {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  reading_time: number;
  word_count: number;
  meta_description?: string | null;
  puck_data: { content: unknown[]; root: Record<string, unknown> } | null;
  category: { id: number; name: string; slug: string } | null;
  author: Author;
  hero_image_url: string | null;
  products: Product[];
}

function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg className="w-7 h-7 text-[#E8365D]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-semibold text-[#E8365D]">Petals</span>
              <span className="font-sans text-xl font-medium text-stone-600">for Her</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Home</Link>
            <Link to="/products" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Products</Link>
            <Link to="/journal" className="text-sm font-medium text-[#E8365D] transition">Journal</Link>
            <Link to="/contact_us" className="text-sm font-medium text-stone-600 hover:text-[#E8365D] transition">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

function RelatedPostCard({ post }: { post: { id: number; title: string; slug: string; hero_image_url: string | null; category: { name: string } | null } }) {
  return (
    <Link to={`/journal/${post.slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {post.hero_image_url ? (
            <img
              src={post.hero_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5]">
              <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
              </svg>
            </div>
          )}
          {post.category && (
            <span
              className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: "#D4A5A5" }}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3
            className="font-semibold text-stone-800 group-hover:text-[#E8365D] transition line-clamp-2 text-sm"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function JournalPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    fetch(`/api/v1/posts/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) setError("Post not found");
          else setError("Failed to load post");
          setPost(null);
          return;
        }
        const data = await res.json();
        setPost(data);

        // Fetch related posts from same category
        if (data.category?.id) {
          const relRes = await fetch(
            `/api/v1/posts?category_id=${data.category.id}&per_page=4`
          );
          if (relRes.ok) {
            const relJson = await relRes.json();
            const related = (relJson.data || []).filter((p: Post) => p.id !== data.id).slice(0, 3);
            setRelatedPosts(related);
          }
        } else {
          setRelatedPosts([]);
        }
      })
      .catch(() => {
        setError("Failed to load post");
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
        <SimpleHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-stone-200 rounded w-24" />
            <div className="h-12 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
            <div className="h-96 bg-stone-200 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
        <SimpleHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-semibold text-stone-800 mb-4">{error || "Post not found"}</h1>
          <Link to="/journal" className="text-[#E8365D] hover:underline font-medium">
            ← Back to Journal
          </Link>
        </main>
      </div>
    );
  }

  const puckData = post.puck_data || { content: [], root: {} };
  const readingTime = post.reading_time ? `${post.reading_time} min read` : "";

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <SEO
        title={post.title}
        description={post.meta_description || post.title}
        canonicalPath={`/journal/${post.slug}`}
        image={post.hero_image_url || undefined}
      />
      <SimpleHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Link to="/journal" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#E8365D] transition text-sm font-medium mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Journal
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <article>
              {/* Post header */}
              <header className="mb-10">
                {post.category && (
                  <span
                    className="inline-block px-3 py-1 rounded text-sm font-medium text-white mb-4"
                    style={{ backgroundColor: "#D4A5A5" }}
                  >
                    {post.category.name}
                  </span>
                )}
                <h1
                  className="text-4xl sm:text-5xl font-semibold text-stone-800 mb-6 leading-tight"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {post.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A5A5]/30 flex items-center justify-center text-[#D4A5A5] font-semibold">
                    {post.author?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{post.author?.name || "Petals for Her"}</p>
                    <p className="text-sm text-stone-500">
                      {formatDate(post.published_at)}
                      {readingTime && ` · ${readingTime}`}
                    </p>
                  </div>
                </div>
              </header>

              {/* Puck content */}
              <div className="prose prose-stone max-w-none">
                {puckData.content && puckData.content.length > 0 ? (
                  <Render config={puckConfig} data={puckData} />
                ) : (
                  <p className="text-stone-500 italic">No content yet.</p>
                )}
              </div>
            </article>
          </div>

          {/* Shop the Story sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <h3
                className="text-xl font-semibold text-stone-800 mb-6"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                Shop the Story
              </h3>
              {post.products && post.products.length > 0 ? (
                <div className="space-y-4">
                  {post.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="flex gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{product.name}</p>
                        <p className="text-[#E8365D] font-semibold text-sm">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <span className="text-[#E8365D] font-medium text-sm">View →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm">No products linked to this post.</p>
              )}
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-stone-200">
            <h2
              className="text-2xl font-semibold text-stone-800 mb-8"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <RelatedPostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 pt-8">
          <Link to="/journal" className="text-[#E8365D] hover:underline font-medium">
            ← Back to Journal
          </Link>
        </div>
      </main>
    </div>
  );
}
