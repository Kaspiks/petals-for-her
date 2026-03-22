import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Puck } from "@puckeditor/core";
import { aiLayoutPlugin } from "../../config/aiLayoutPlugin";
import AIAssistantPanel from "../../components/editor/AIAssistantPanel";
import { calculateSEOScore } from "../../lib/ai";
import "@puckeditor/core/puck.css";
import { useAuth } from "../../contexts/AuthContext";
import puckConfig from "../../config/puckConfig";
import {
  Save,
  FileText,
  X,
  ChevronRight,
  Eye,
  Clock,
  Search as SearchIcon,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

const ACCENT = "#E8365D";

const EMPTY_PUCK_DATA = { content: [], root: { props: {} } };

interface PostMeta {
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  category_id: string;
  meta_title: string;
  meta_description: string;
  product_ids: number[];
}

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [puckData, setPuckData] = useState<any>(EMPTY_PUCK_DATA);
  const [meta, setMeta] = useState<PostMeta>({
    title: "",
    slug: "",
    status: "draft",
    featured: false,
    category_id: "",
    meta_title: "",
    meta_description: "",
    product_ids: [],
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [linkedProducts, setLinkedProducts] = useState<any[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [puckKey, setPuckKey] = useState(0); // Force Puck re-mount when AI applies new data
  const autoSaveTimer = useRef<any>(null);
  const latestPuckData = useRef<any>(EMPTY_PUCK_DATA);
  useEffect(() => {
    fetchCategories();
    if (isEdit) loadPost();
  }, [id]);

  const fetchCategories = async () => {
    const res = await fetchWithAuth(
      "/api/v1/admin/categories?category_type=journal&per_page=100"
    );
    if (res.ok) {
      const json = await res.json();
      setCategories(json.data || []);
    }
  };

  const loadPost = async () => {
    setLoading(true);
    const res = await fetchWithAuth(`/api/v1/admin/posts/${id}`);
    if (res.ok) {
      const post = await res.json();
      setPuckData(post.puck_data || EMPTY_PUCK_DATA);
      latestPuckData.current = post.puck_data || EMPTY_PUCK_DATA;
      setMeta({
        title: post.title || "",
        slug: post.slug || "",
        status: post.status || "draft",
        featured: post.featured || false,
        category_id: post.category?.id?.toString() || "",
        meta_title: post.meta_title || "",
        meta_description: post.meta_description || "",
        product_ids: post.product_ids || [],
      });
      setLinkedProducts(post.products || []);
    } else {
      navigate("/admin/journal");
    }
    setLoading(false);
  };

  const searchProducts = async (q: string) => {
    if (!q || q.length < 2) { setProducts([]); return; }
    const res = await fetchWithAuth(`/api/v1/admin/products?q=${encodeURIComponent(q)}&per_page=10`);
    if (res.ok) {
      const json = await res.json();
      setProducts(json.data || []);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => searchProducts(productSearch), 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const handleSave = async (status?: string) => {
    setSaving(true);
    setErrors([]);
    const saveStatus = status || meta.status;

    // Backend requires title; use fallback when empty
    const title = meta.title?.trim() || "Untitled";

    const body: any = {
      title,
      status: saveStatus,
      featured: meta.featured,
      category_id: meta.category_id || null,
      meta_title: meta.meta_title,
      meta_description: meta.meta_description,
      puck_data: latestPuckData.current,
      product_ids: meta.product_ids,
    };
    if (meta.slug) body.slug = meta.slug;

    const url = isEdit ? `/api/v1/admin/posts/${id}` : "/api/v1/admin/posts";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const post = await res.json();
      setLastSaved(new Date());
      if (!isEdit) {
        navigate(`/admin/journal/${post.id}/edit`, { replace: true });
      }
    } else {
      const json = await res.json().catch(() => ({}));
      setErrors(json.errors || ["Failed to save"]);
    }
    setSaving(false);
  };

  // Auto-save draft every 2 minutes
  useEffect(() => {
    if (!isEdit) return;
    autoSaveTimer.current = setInterval(() => {
      if (meta.status === "draft") {
        handleSave();
      }
    }, 120000);
    return () => clearInterval(autoSaveTimer.current);
  }, [isEdit, meta.status]);

  const addProduct = (product: any) => {
    if (meta.product_ids.includes(product.id)) return;
    setMeta((m) => ({ ...m, product_ids: [...m.product_ids, product.id] }));
    setLinkedProducts((p) => [...p, product]);
    setShowProductSearch(false);
    setProductSearch("");
  };

  const removeProduct = (productId: number) => {
    setMeta((m) => ({
      ...m,
      product_ids: m.product_ids.filter((pid) => pid !== productId),
    }));
    setLinkedProducts((p) => p.filter((pr) => pr.id !== productId));
  };

  const wordCount = (() => {
    const extractText = (val: unknown): string[] => {
      if (typeof val === "string") return [val];
      if (Array.isArray(val)) return val.flatMap(extractText);
      if (val && typeof val === "object") return Object.values(val).flatMap(extractText);
      return [];
    };
    const blocks = puckData?.content || [];
    const allText = blocks.flatMap((b: any) => extractText(b?.props || {}));
    const text = allText.join(" ");
    return text.split(/\s+/).filter(Boolean).length;
  })();
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const seoScore = calculateSEOScore({
    title: meta.title,
    meta_title: meta.meta_title,
    meta_description: meta.meta_description,
    slug: meta.slug,
    wordCount,
  });

  const timeSinceSave = lastSaved
    ? `${Math.round((Date.now() - lastSaved.getTime()) / 60000)} mins ago`
    : "Not saved yet";

  // Stable refs so meta field typing doesn't cause Puck to re-initialize (design blocks jumping)
  // Must be before any early return to satisfy Rules of Hooks
  const puckPlugins = useMemo(() => [aiLayoutPlugin()], []);
  const puckOverrides = useMemo(() => ({ header: () => null }), []);

  const handlePuckChange = (data: any) => {
    latestPuckData.current = data;
    setPuckData(data);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-64" />
          <div className="h-[600px] bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF9F7]">
      {/* Custom header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-stone-200 z-20">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-semibold text-stone-800">
              Petals <span style={{ color: ACCENT }}>Admin</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="text-stone-500 hover:text-stone-700">
              Dashboard
            </Link>
            <span className="font-medium" style={{ color: ACCENT }}>
              Editor
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {errors.length > 0 && (
            <span className="text-sm text-red-500">{errors[0]}</span>
          )}
          <button
            onClick={() => navigate("/admin/journal")}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm font-medium"
          >
            Discard
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 disabled:opacity-50"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Save as Draft
            </span>
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            <span className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Publish
            </span>
          </button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Puck editor (left sidebar + canvas) */}
        <div className="flex-1 overflow-auto">
          <Puck
            key={puckKey}
            config={puckConfig}
            data={puckData}
            onChange={handlePuckChange}
            plugins={puckPlugins}
            onPublish={() => handleSave("published")}
            overrides={puckOverrides}
          />
        </div>

        {/* Right sidebar: metadata + AI */}
        <aside className="w-80 border-l border-stone-200 bg-white overflow-y-auto flex-shrink-0">
          {/* Post Metadata */}
          <div className="p-4 border-b border-stone-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
              Post Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={meta.title}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, title: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Slug
                </label>
                <input
                  type="text"
                  value={meta.slug}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, slug: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                  placeholder="auto-generated-slug"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={meta.meta_title}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, meta_title: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                  placeholder="50-60 chars for search results"
                />
                <p className="text-xs text-stone-400 mt-0.5 text-right">{meta.meta_title.length}/60</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={meta.meta_description}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, meta_description: e.target.value }))
                  }
                  rows={2}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5] resize-none"
                  placeholder="150-160 chars for search snippets"
                />
                <p className="text-xs text-stone-400 mt-0.5 text-right">{meta.meta_description.length}/160</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={meta.category_id}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, category_id: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
                >
                  <option value="">No category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  Featured Story
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setMeta((m) => ({ ...m, featured: !m.featured }))
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    meta.featured ? "bg-[#E8365D]" : "bg-stone-200"
                  }`}
                  role="switch"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      meta.featured ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Shop the Story */}
          <div className="p-4 border-b border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Shop the Story
              </h3>
              <button
                onClick={() =>
                  setShowProductSearch(!showProductSearch)
                }
                className="text-xs font-medium"
                style={{ color: ACCENT }}
              >
                Edit
              </button>
            </div>
            {linkedProducts.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-stone-50"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5] flex-shrink-0 overflow-hidden">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    ${p.price?.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="text-stone-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {showProductSearch && (
              <div className="mt-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-200 text-sm"
                    placeholder="Search products..."
                    autoFocus
                  />
                </div>
                {products.length > 0 && (
                  <div className="mt-1 border border-stone-200 rounded-lg bg-white max-h-40 overflow-y-auto">
                    {products
                      .filter(
                        (p: any) => !meta.product_ids.includes(p.id)
                      )
                      .map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => addProduct(p)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3 text-stone-400" />
                          {p.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
            {linkedProducts.length === 0 && !showProductSearch && (
              <button
                onClick={() => setShowProductSearch(true)}
                className="w-full py-2 rounded-lg border border-dashed border-stone-300 text-sm text-stone-500 hover:border-stone-400 hover:text-stone-600"
              >
                + Link Product
              </button>
            )}
          </div>

          {/* Claude Assistant - Layout + Writing & SEO */}
          <AIAssistantPanel
            puckData={puckData}
            onApply={(newData) => {
              latestPuckData.current = newData;
              setPuckData(newData);
              setPuckKey((k) => k + 1);
            }}
            meta={meta}
            onMetaChange={(updates) =>
              setMeta((m) => ({ ...m, ...updates }))
            }
          />
        </aside>
      </div>

      {/* Status bar */}
      <footer className="flex items-center justify-between px-6 py-2 bg-white border-t border-stone-200 text-xs text-stone-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  meta.status === "published"
                    ? "#22c55e"
                    : meta.status === "scheduled"
                    ? "#f97316"
                    : "#fbbf24",
              }}
            />
            Draft Status: {meta.status === "draft" ? "Unpublished Changes" : meta.status}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last saved: {timeSinceSave}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{wordCount} Words</span>
          <span>{readingTime} min Read</span>
          <span
            className={`flex items-center gap-1 font-medium ${
              seoScore >= 80 ? "text-green-600" : seoScore >= 50 ? "text-amber-600" : "text-stone-500"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            SEO: {seoScore}/100
          </span>
        </div>
      </footer>
    </div>
  );
}
