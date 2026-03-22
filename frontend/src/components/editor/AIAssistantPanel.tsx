/**
 * AI Layout Engine - Sidebar assistant panel
 * Generate Page | Improve Layout | Generate Palette | Analyze Screenshot
 * Writing & SEO: Optimize for SEO (Claude)
 */

import { useState, useRef } from "react";
import {
  Sparkles,
  LayoutGrid,
  Palette,
  ImageIcon,
  Wand2,
  Loader2,
  Upload,
  X,
  Search,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  generatePageFromPrompt,
  pageToPuckData,
  generatePalette,
  improveLayout,
  applyLayoutActions,
  analyzeScreenshot,
  optimizeSEOForPost,
  extractTextFromPuckData,
} from "@/lib/ai";

const ACCENT = "#E8365D";

interface AIAssistantPanelProps {
  puckData: { content: unknown[]; root: { props: Record<string, unknown> } };
  onApply: (newData: { content: unknown[]; root: { props: Record<string, unknown> } }) => void;
  meta?: { title?: string; meta_title?: string; meta_description?: string };
  onMetaChange?: (updates: { meta_title?: string; meta_description?: string }) => void;
}

export default function AIAssistantPanel({
  puckData,
  onApply,
  meta,
  onMetaChange,
}: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [seoResult, setSeoResult] = useState<{
    meta_title: string;
    meta_description: string;
    suggestions: string[];
    opinion: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearState = () => {
    setError(null);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setSeoResult(null);
  };

  const handleOptimizeSEO = async () => {
    const bodyText = extractTextFromPuckData(puckData);
    if (!bodyText.trim() && !meta?.title) {
      setError("Add some content or a title first");
      return;
    }
    setLoading(true);
    clearState();
    try {
      const result = await optimizeSEOForPost({
        title: meta?.title || "",
        meta_title: meta?.meta_title,
        meta_description: meta?.meta_description,
        bodyText,
      });
      setSeoResult(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySEO = () => {
    if (seoResult && onMetaChange) {
      onMetaChange({
        meta_title: seoResult.meta_title,
        meta_description: seoResult.meta_description,
      });
      setSeoResult(null);
    }
  };

  const handleGeneratePage = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt");
      return;
    }
    setLoading(true);
    clearState();
    try {
      const { page } = await generatePageFromPrompt(prompt, {
        pageType: "landing",
      });
      const puckDataNew = pageToPuckData(page);
      onApply(puckDataNew);
      setPrompt("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveLayout = async () => {
    if (!prompt.trim()) {
      setError("Enter your improvement goal (e.g. 'make it feel more premium')");
      return;
    }
    setLoading(true);
    clearState();
    try {
      const { actions } = await improveLayout(puckData, prompt);
      const updated = applyLayoutActions(puckData, actions);
      onApply(updated);
      setPrompt("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePalette = async () => {
    setLoading(true);
    clearState();
    try {
      const { palette } = await generatePalette(
        "landing",
        prompt.trim() || "soft luxury romantic"
      );
      const updated = {
        ...puckData,
        root: {
          ...puckData.root,
          props: { ...(puckData.root?.props || {}), palette },
        },
      };
      onApply(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeScreenshot = async () => {
    if (!screenshotFile) {
      setError("Upload a screenshot first");
      return;
    }
    setLoading(true);
    clearState();
    try {
      const base64 = await fileToBase64(screenshotFile); // full data URL for media type detection
      const { layoutPlan } = await analyzeScreenshot(
        base64,
        prompt.trim() || undefined
      );
      // Convert layout plan to full page (plan → palette → sections)
      const { page } = await generatePageFromPrompt(
        `Create a page based on this layout plan: ${JSON.stringify(layoutPlan)}`,
        { pageType: "landing" }
      );
      const puckDataNew = pageToPuckData(page);
      onApply(puckDataNew);
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setPrompt("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  return (
    <div className="p-4 border-t border-stone-100">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
          Claude Assistant
        </h3>
      </div>

      {/* Writing & SEO */}
      <div className="mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          Writing & SEO
        </p>
        <Button
          variant="outline"
          onClick={handleOptimizeSEO}
          disabled={loading}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Optimize for SEO
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        </Button>
      </div>

      {/* SEO result */}
      {seoResult && (
        <div className="mb-4 p-3 rounded-lg border border-[#D4A5A5]/30 bg-[#FAF9F7]">
          <p className="text-xs font-medium text-stone-500 mb-2">Claude&apos;s opinion</p>
          <p className="text-sm text-stone-700 mb-3">{seoResult.opinion}</p>
          <p className="text-xs font-medium text-stone-500 mb-1">Suggestions</p>
          <ul className="text-sm text-stone-600 list-disc list-inside space-y-0.5 mb-3">
            {seoResult.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            {onMetaChange && (
              <Button
                size="sm"
                onClick={handleApplySEO}
                className="flex-1"
                style={{ backgroundColor: ACCENT }}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Apply
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setSeoResult(null)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 mt-4">
        Layout
      </p>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Create a Mother's Day landing page for satin bouquets"
        className="mb-3 min-h-[80px] text-sm"
        disabled={loading}
      />

      <div className="space-y-2">
        <Button
          onClick={handleGeneratePage}
          disabled={loading}
          className="w-full justify-start"
          style={{ backgroundColor: ACCENT }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Generate Page
        </Button>

        <Button
          variant="outline"
          onClick={handleImproveLayout}
          disabled={loading}
          className="w-full justify-start"
        >
          <LayoutGrid className="w-4 h-4" />
          Improve Layout
        </Button>

        <Button
          variant="outline"
          onClick={handleGeneratePalette}
          disabled={loading}
          className="w-full justify-start"
        >
          <Palette className="w-4 h-4" />
          Generate Palette
        </Button>
      </div>

      {/* Screenshot upload */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          Analyze Screenshot
        </p>
        {screenshotPreview ? (
          <div className="relative mb-2">
            <img
              src={screenshotPreview}
              alt="Screenshot"
              className="w-full h-24 object-cover rounded-lg border border-stone-200"
            />
            <button
              onClick={removeScreenshot}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-lg border border-dashed border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-600 text-sm flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload design reference
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={handleAnalyzeScreenshot}
          disabled={loading || !screenshotFile}
          className="w-full justify-start mt-2"
        >
          <ImageIcon className="w-4 h-4" />
          Analyze Screenshot
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Send full data URL so backend can extract media type (image/png, image/jpeg, etc.)
      resolve(result || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
