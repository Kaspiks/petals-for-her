import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import Newsletter from "../components/Newsletter";

const PER_PAGE = 12;

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count?: number;
  hero_image_url?: string;
}

interface Author {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  word_count: number;
  reading_time: number;
  category: { id: number; name: string; slug: string } | null;
  author: Author;
  hero_image_url: string | null;
  meta_description: string | null;
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

function PostCard({ post }: { post: Post }) {
  const excerpt = post.meta_description || "";
  const readingTime = post.reading_time ? `${post.reading_time} min read` : "";

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
              <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
              </svg>
            </div>
          )}
          {post.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: "#D4A5A5" }}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3
            className="text-xl font-semibold text-stone-800 group-hover:text-[#E8365D] transition mb-2 line-clamp-2"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            {post.title}
          </h3>
          {excerpt && (
            <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-3" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{post.author?.name || "Petals for Her"}</span>
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
            {readingTime && (
              <>
                <span>·</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">1</button>
          {start > 2 && <span className="px-1 text-stone-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            p === currentPage ? "bg-[#E8365D] text-white shadow-sm" : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-stone-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function PublicJournalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const categoryId = searchParams.get("category_id") || "";

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/v1/categories");
    if (res.ok) {
      const json = await res.json();
      setCategories(json.data || []);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("per_page", String(PER_PAGE));
    if (categoryId) params.set("category_id", categoryId);

    const res = await fetch(`/api/v1/posts?${params}`);
    if (res.ok) {
      const json = await res.json();
      setPosts(json.data || []);
      setTotal(json.total || 0);
    } else {
      setPosts([]);
      setTotal(0);
    }
    setLoading(false);
  }, [currentPage, categoryId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <SEO
        title="The Petals Journal"
        description="Stories, inspiration, and tips from Petals for Her. Discover the art of everlasting blooms and timeless floral elegance."
        canonicalPath="/journal"
      />
      <SimpleHeader />

      <main>
        {/* Hero */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-800 mb-4"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              The Petals Journal
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Stories, inspiration, and tips for your everlasting blooms. Discover the art of timeless floral elegance.
            </p>
          </div>
        </section>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => updateParam("category_id", "")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !categoryId ? "bg-[#D4A5A5] text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category_id", String(cat.id))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    categoryId === String(cat.id) ? "bg-[#D4A5A5] text-white" : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Post grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 animate-pulse">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-100 rounded w-full" />
                    <div className="h-4 bg-stone-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <p className="text-lg">No posts yet. Check back soon for stories and inspiration.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => updateParam("page", String(p))} />
            </>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Newsletter />
        </section>
      </main>
    </div>
  );
}
