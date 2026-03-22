import { useState } from "react";
import {
  Sparkles,
  Type,
  FileText,
  Search,
  Palette,
  LayoutGrid,
  ALargeSmall,
  Eye,
  ChevronRight,
  Mic,
  Send,
  X,
  Check,
} from "lucide-react";
import { useGeminiChannel } from "../../../hooks/useGeminiChannel";
import { useGeminiLive } from "../../../hooks/useGeminiLive";

const ACCENT = "#E8365D";

interface GeminiAssistantPanelProps {
  puckData: any;
  onApply: (newData: any) => void;
  meta: any;
  onMetaChange: (updates: any) => void;
}

const WRITING_ACTIONS = [
  { id: "generate_headline", label: "Generate Headline", icon: Type },
  { id: "draft_paragraph", label: "Draft Paragraph", icon: FileText },
  { id: "optimize_seo", label: "Optimize for SEO", icon: Search },
];

const DESIGN_ACTIONS = [
  { id: "suggest_palette", label: "Suggest Color Palette", icon: Palette },
  { id: "optimize_layout", label: "Optimize Layout", icon: LayoutGrid },
  { id: "typography_pairings", label: "Typography Pairings", icon: ALargeSmall },
  { id: "accessibility_audit", label: "Accessibility Audit", icon: Eye },
];

function extractContext(puckData: any, meta: any): string {
  const parts: string[] = [];
  if (meta?.title) parts.push(`Title: ${meta.title}`);

  const blocks = puckData?.content || [];
  for (const block of blocks) {
    const props = block.props || {};
    for (const [key, val] of Object.entries(props)) {
      if (typeof val === "string" && val.length > 5 && key !== "id") {
        parts.push(val);
      }
    }
  }
  return parts.join("\n\n").slice(0, 3000);
}

export default function GeminiAssistantPanel({
  puckData,
  onApply,
  meta,
  onMetaChange,
}: GeminiAssistantPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const { sendPrompt, response, isStreaming, error, reset } = useGeminiChannel();
  const live = useGeminiLive();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);

  const currentResponse = voiceMode ? live.response : response;
  const currentStreaming = voiceMode ? live.isRecording : isStreaming;
  const currentError = voiceMode ? live.error : error;

  const handleAction = (actionId: string) => {
    setActiveAction(actionId);
    const context = extractContext(puckData, meta);
    sendPrompt(actionId, "", context);
  };

  const handleCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    setActiveAction("custom");
    const context = extractContext(puckData, meta);
    sendPrompt("custom", customPrompt, context);
    setCustomPrompt("");
  };

  const handleApply = () => {
    const resp = voiceMode ? live.response : response;
    if (!resp) return;

    if (activeAction === "generate_headline") {
      const firstLine = resp.split("\n").find((l: string) => l.trim())?.replace(/^\d+\.\s*/, "") || resp;
      onMetaChange({ title: firstLine.trim() });
    } else if (activeAction === "optimize_seo") {
      onMetaChange({ meta_description: resp.slice(0, 500) });
    } else {
      const newBlock = {
        type: "TextBlock",
        props: {
          id: `ai-${Date.now()}`,
          content: resp,
          alignment: "left",
        },
      };
      const updatedData = {
        ...puckData,
        content: [...(puckData?.content || []), newBlock],
      };
      onApply(updatedData);
    }

    if (voiceMode) {
      live.reset();
    } else {
      reset();
    }
    setActiveAction(null);
  };

  const handleDiscard = () => {
    if (voiceMode) {
      live.reset();
    } else {
      reset();
    }
    setActiveAction(null);
    setCustomPrompt("");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: ACCENT }}
        >
          Claude Assistant
        </h3>
      </div>

      {/* Writing & SEO */}
      <div className="mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          Writing & SEO
        </p>
        <div className="space-y-1.5">
          {WRITING_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={isStreaming}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <action.icon className="w-4 h-4 text-stone-400" />
                {action.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Design Assistance */}
      <div className="mb-4">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          Design Assistance
        </p>
        <div className="space-y-1.5">
          {DESIGN_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={isStreaming}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <action.icon className="w-4 h-4 text-stone-400" />
                {action.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Voice Mode */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Voice Mode
          </p>
          <button
            onClick={() => {
              if (voiceMode) {
                live.endSession();
                setVoiceMode(false);
              } else {
                live.startSession();
                setVoiceMode(true);
              }
            }}
            className={`text-xs font-medium px-2 py-1 rounded ${
              voiceMode
                ? "bg-red-50 text-red-600"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {voiceMode ? "End Session" : "Start Session"}
          </button>
        </div>
        {voiceMode && live.isSessionActive && (
          <button
            onClick={() => {
              if (live.isRecording) {
                live.stopRecording();
              } else {
                live.startRecording();
              }
            }}
            className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
              live.isRecording
                ? "border-red-300 bg-red-50 text-red-600 animate-pulse"
                : "border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
          >
            <Mic className="w-4 h-4" />
            {live.isRecording ? "Recording... (click to stop)" : "Hold to speak"}
          </button>
        )}
      </div>

      {/* Error display */}
      {currentError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {currentError}
        </div>
      )}

      {/* Streaming response preview */}
      {(currentResponse || currentStreaming) && (
        <div className="mb-4">
          <div className="rounded-lg border border-[#D4A5A5]/30 bg-[#FAF9F7] p-3">
            <p className="text-xs font-medium text-stone-500 mb-2">
              {currentStreaming ? "Generating..." : "AI Response"}
            </p>
            <div className="text-sm text-stone-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {currentResponse}
              {currentStreaming && (
                <span className="inline-block w-1.5 h-4 bg-[#E8365D] animate-pulse ml-0.5" />
              )}
            </div>
            {!currentStreaming && currentResponse && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply
                </button>
                <button
                  onClick={handleDiscard}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-sm font-medium hover:bg-stone-50"
                >
                  <X className="w-3.5 h-3.5" />
                  Discard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom prompt input */}
      <div className="relative">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCustomPrompt()}
          className="w-full pl-3 pr-20 py-2.5 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-[#D4A5A5]/30 focus:border-[#D4A5A5]"
          placeholder="Ask Claude anything..."
          disabled={isStreaming}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            className="p-1.5 rounded-md text-stone-400 hover:text-stone-600"
            title="Voice input (coming soon)"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={handleCustomPrompt}
            disabled={isStreaming || !customPrompt.trim()}
            className="p-1.5 rounded-md text-white disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
