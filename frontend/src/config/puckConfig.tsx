import React from "react";
import type { Config } from "@puckeditor/core";
import { ProductGridClient } from "../components/editor/ProductGridClient";

const BRAND = {
  blush: "#D4A5A5",
  blushLight: "#E8C9C9",
  blushDark: "#B88A8A",
  accent: "#E8365D",
  bg: "#FAF9F7",
  text: "#1c1917",
};

/** Reusable color field - picker + hex input */
function colorField(label: string, defaultValue: string) {
  return {
    type: "custom" as const,
    label,
    render: ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
      const raw = value || defaultValue || "";
      const hex = raw.startsWith("#") ? raw : raw ? `#${raw}` : defaultValue;
      const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);
      const displayHex = isValidHex ? hex : defaultValue;
      return (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-stone-600">{label}</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={displayHex}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-8 rounded border border-stone-200 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={defaultValue}
              className="flex-1 px-2 py-1 text-sm rounded border border-stone-200 font-mono min-w-0"
            />
          </div>
        </div>
      );
    },
  };
}

const HeroImage: Config["components"][string] = {
  label: "Hero Image",
  fields: {
    imageUrl: { type: "text", label: "Image URL" },
    title: { type: "text", label: "Title" },
    subtitle: { type: "text", label: "Subtitle" },
    overlayOpacity: {
      type: "number",
      label: "Overlay Opacity (%)",
      min: 0,
      max: 100,
    },
    titleColor: colorField("Title Color", "#ffffff"),
    subtitleColor: colorField("Subtitle Color", "#ffffff"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 32 },
  },
  defaultProps: {
    imageUrl: "",
    title: "Your Story Title",
    subtitle: "A Petals for Her Story",
    overlayOpacity: 40,
    titleColor: "#ffffff",
    subtitleColor: "#ffffff",
    borderRadius: 8,
  },
  render: ({ imageUrl, title, subtitle, overlayOpacity, titleColor, subtitleColor, borderRadius }) => (
    <div
      className="relative w-full min-h-[400px] overflow-hidden"
      style={{ borderRadius: `${borderRadius ?? 8}px` }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5]" />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${(overlayOpacity || 40) / 100})` }}
      />
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[400px] p-8">
        <h1
          className="text-4xl md:text-5xl font-bold mb-2"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: titleColor || "#ffffff" }}
        >
          {title}
        </h1>
        <p className="text-lg opacity-90" style={{ color: subtitleColor || "#ffffff" }}>{subtitle}</p>
      </div>
    </div>
  ),
};

const TextBlock: Config["components"][string] = {
  label: "Text Block",
  fields: {
    content: { type: "textarea", label: "Content" },
    alignment: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    textColor: colorField("Text Color", "#44403c"),
    backgroundColor: colorField("Background", "transparent"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 24 },
  },
  defaultProps: {
    content: "Every petal tells a story of craftsmanship and devotion.",
    alignment: "left",
    textColor: "#44403c",
    backgroundColor: "",
    borderRadius: 0,
  },
  render: ({ content, alignment, textColor, backgroundColor, borderRadius }) => (
    <div
      className="py-6 px-4 max-w-3xl mx-auto leading-relaxed"
      style={{
        textAlign: alignment as React.CSSProperties["textAlign"],
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: textColor || "#44403c",
        backgroundColor: backgroundColor || "transparent",
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      }}
    >
      {(content || "").split("\n").map((line: string, i: number) => (
        <p key={i} className="mb-4 last:mb-0">
          {line}
        </p>
      ))}
    </div>
  ),
};

const PullQuote: Config["components"][string] = {
  label: "Pull Quote",
  fields: {
    quote: { type: "textarea", label: "Quote" },
    attribution: { type: "text", label: "Attribution (optional)" },
    quoteColor: colorField("Quote Color", "#44403c"),
    attributionColor: colorField("Attribution Color", "#78716c"),
    borderColor: colorField("Border Color", "#D4A5A5"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 24 },
  },
  defaultProps: {
    quote: "Peonies represent the essence of spring romance.",
    attribution: "",
    quoteColor: "#44403c",
    attributionColor: "#78716c",
    borderColor: "#D4A5A5",
    borderRadius: 8,
  },
  render: ({ quote, attribution, quoteColor, attributionColor, borderColor, borderRadius }) => (
    <blockquote
      className="py-8 px-6 max-w-2xl mx-auto text-center border-l-4"
      style={{
        borderColor: borderColor || "#D4A5A5",
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      }}
    >
      <p
        className="text-2xl md:text-3xl italic mb-4"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: quoteColor || "#44403c" }}
      >
        "{quote}"
      </p>
      {attribution && (
        <cite className="text-sm not-italic" style={{ color: attributionColor || "#78716c" }}>— {attribution}</cite>
      )}
    </blockquote>
  ),
};

const ScentSpotlight: Config["components"][string] = {
  label: "Scent Spotlight",
  fields: {
    name: { type: "text", label: "Fragrance Name" },
    description: { type: "textarea", label: "Description" },
    imageUrl: { type: "text", label: "Image URL" },
    intensity: {
      type: "radio",
      label: "Intensity",
      options: [
        { label: "Subtle", value: "subtle" },
        { label: "Moderate", value: "moderate" },
        { label: "Strong", value: "strong" },
      ],
    },
  },
  defaultProps: {
    name: "Rose de Mai",
    description: "A delicate floral scent with notes of fresh morning dew.",
    imageUrl: "",
    intensity: "moderate",
  },
  render: ({ name, description, imageUrl, intensity }) => (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-white border border-stone-100 max-w-3xl mx-auto my-4">
      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5]">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h3
          className="text-2xl font-semibold text-stone-800 mb-2"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          {name}
        </h3>
        <p className="text-stone-600 mb-3">{description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-stone-500">Intensity:</span>
          <div className="flex gap-1">
            {["subtle", "moderate", "strong"].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    ["subtle", "moderate", "strong"].indexOf(level) <=
                    ["subtle", "moderate", "strong"].indexOf(intensity)
                      ? BRAND.blush
                      : "#e7e5e4",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

const ImageText: Config["components"][string] = {
  label: "Image + Text",
  fields: {
    imageUrl: { type: "text", label: "Image URL" },
    imageAlt: { type: "text", label: "Image Alt Text" },
    heading: { type: "text", label: "Heading" },
    content: { type: "textarea", label: "Content" },
    imagePosition: {
      type: "radio",
      label: "Image Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    headingColor: colorField("Heading Color", "#1c1917"),
    contentColor: colorField("Content Color", "#44403c"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 24 },
  },
  defaultProps: {
    imageUrl: "",
    imageAlt: "Flower arrangement",
    heading: "The Art of Arrangement",
    content: "Our artisans hand-select each bloom to create a harmonious composition.",
    imagePosition: "left",
    headingColor: "#1c1917",
    contentColor: "#44403c",
    borderRadius: 8,
  },
  render: ({ imageUrl, imageAlt, heading, content, imagePosition, headingColor, contentColor, borderRadius }) => (
    <div
      className={`flex flex-col md:flex-row gap-8 py-8 max-w-4xl mx-auto items-center ${
        imagePosition === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <div
        className="w-full md:w-1/2 aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5]"
        style={{ borderRadius: `${borderRadius ?? 8}px` }}
      >
        {imageUrl && (
          <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="w-full md:w-1/2">
        <h3
          className="text-3xl font-semibold mb-4"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: headingColor || "#1c1917" }}
        >
          {heading}
        </h3>
        <p className="leading-relaxed" style={{ color: contentColor || "#44403c" }}>{content}</p>
      </div>
    </div>
  ),
};

const ProductGallery: Config["components"][string] = {
  label: "Product Gallery",
  fields: {
    heading: { type: "text", label: "Section Heading" },
    columns: {
      type: "number",
      label: "Columns",
      min: 2,
      max: 4,
    },
    productIds: { type: "text", label: "Product IDs (comma separated)" },
  },
  defaultProps: {
    heading: "Shop the Collection",
    columns: 3,
    productIds: "",
  },
  render: ({ heading, columns }) => (
    <div className="py-8 max-w-5xl mx-auto">
      <h3
        className="text-3xl font-semibold text-stone-800 mb-6 text-center"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
      >
        {heading}
      </h3>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns || 3}, 1fr)` }}
      >
        {Array.from({ length: columns || 3 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5] flex items-center justify-center text-white/60 text-sm">
            Product {i + 1}
          </div>
        ))}
      </div>
    </div>
  ),
};

const FeaturedProducts: Config["components"][string] = {
  label: "Featured Products",
  fields: {
    heading: { type: "text", label: "Section Heading" },
    productIds: { type: "text", label: "Product IDs (comma separated)" },
  },
  defaultProps: {
    heading: "You May Also Love",
    productIds: "",
  },
  render: ({ heading }) => (
    <div className="py-8 max-w-5xl mx-auto">
      <h3
        className="text-2xl font-semibold text-stone-800 mb-6"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
      >
        {heading}
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-56">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-[#E8C9C9] to-[#D4A5A5] mb-3" />
            <p className="font-medium text-stone-800 text-sm">Product Name</p>
            <p className="text-[#D4A5A5] text-sm font-medium">$85.00</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

const CTABanner: Config["components"][string] = {
  label: "CTA Banner",
  fields: {
    heading: { type: "text", label: "Heading" },
    description: { type: "text", label: "Description" },
    buttonText: { type: "text", label: "Button Text" },
    buttonUrl: { type: "text", label: "Button URL" },
    variant: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Blush", value: "blush" },
        { label: "Dark", value: "dark" },
        { label: "White", value: "white" },
      ],
    },
    backgroundColor: colorField("Background Override", ""),
    buttonBgColor: colorField("Button Override", ""),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 32 },
  },
  defaultProps: {
    heading: "Discover Our Latest Collection",
    description: "Hand-crafted arrangements for every occasion.",
    buttonText: "Shop Now",
    buttonUrl: "/products",
    variant: "blush",
    backgroundColor: "",
    buttonBgColor: "",
    borderRadius: 12,
  },
  render: ({ heading, description, buttonText, variant, backgroundColor, buttonBgColor, borderRadius }) => {
    const styles: Record<string, { bg: string; text: string; btn: string; btnText: string }> = {
      blush: { bg: "#D4A5A5", text: "#ffffff", btn: "#ffffff", btnText: "#D4A5A5" },
      dark: { bg: "#292524", text: "#ffffff", btn: "#D4A5A5", btnText: "#ffffff" },
      white: { bg: "#ffffff", text: "#1c1917", btn: "#E8365D", btnText: "#ffffff" },
    };
    const s = styles[variant] || styles.blush;
    const bg = backgroundColor || s.bg;
    const btnBg = buttonBgColor || s.btn;
    return (
      <div
        className={`py-12 px-8 text-center my-4 ${variant === "white" ? "border border-stone-200" : ""}`}
        style={{
          backgroundColor: bg,
          color: s.text,
          borderRadius: `${borderRadius ?? 12}px`,
        }}
      >
        <h3
          className="text-3xl font-semibold mb-3"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          {heading}
        </h3>
        <p className="mb-6 opacity-90 max-w-xl mx-auto">{description}</p>
        <button
          className="px-8 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: btnBg, color: s.btnText }}
        >
          {buttonText}
        </button>
      </div>
    );
  },
};

// --- AI Layout Engine components (Hero, ProductGrid, Testimonials, FAQ, CTA) ---
const Hero: Config["components"][string] = {
  label: "Hero",
  fields: {
    title: { type: "text", label: "Title" },
    subtitle: { type: "text", label: "Subtitle" },
    ctaText: { type: "text", label: "CTA Text" },
    ctaHref: { type: "text", label: "CTA Link" },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    titleColor: colorField("Title Color", "#ffffff"),
    subtitleColor: colorField("Subtitle Color", "#ffffff"),
    ctaBgColor: colorField("Button Background", "#ffffff"),
    ctaTextColor: colorField("Button Text", "#D4A5A5"),
    gradientStart: colorField("Gradient Start", "#E8C9C9"),
    gradientEnd: colorField("Gradient End", "#B88A8A"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 32 },
  },
  defaultProps: {
    title: "Elegant Arrangements for Every Occasion",
    subtitle: "Hand-crafted satin bouquets that speak from the heart",
    ctaText: "Shop the Collection",
    ctaHref: "/collections",
    align: "center",
    titleColor: "#ffffff",
    subtitleColor: "#ffffff",
    ctaBgColor: "#ffffff",
    ctaTextColor: "#D4A5A5",
    gradientStart: "#E8C9C9",
    gradientEnd: "#B88A8A",
    borderRadius: 8,
  },
  render: ({ title, subtitle, ctaText, ctaHref, align, titleColor, subtitleColor, ctaBgColor, ctaTextColor, gradientStart, gradientEnd, borderRadius }) => (
    <div
      className="relative w-full min-h-[400px] overflow-hidden"
      style={{ borderRadius: `${borderRadius ?? 8}px` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${gradientStart || "#E8C9C9"}, ${BRAND.blush}, ${gradientEnd || "#B88A8A"})`,
        }}
      />
      <div className="relative z-10 flex flex-col justify-center h-full min-h-[400px] p-8" style={{ textAlign: (align as "left" | "center" | "right") || "center" }}>
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: titleColor || "#ffffff" }}>
          {title}
        </h1>
        <p className="text-xl opacity-95 mb-6 max-w-2xl mx-auto" style={{ color: subtitleColor || "#ffffff" }}>{subtitle}</p>
        {ctaText && (
          <a
            href={ctaHref || "#"}
            className="inline-flex px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-fit"
            style={{ backgroundColor: ctaBgColor || "#ffffff", color: ctaTextColor || "#D4A5A5" }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  ),
};

const ProductGrid: Config["components"][string] = {
  label: "Product Grid",
  fields: {
    title: { type: "text", label: "Title" },
    collection: { type: "text", label: "Collection slug" },
    columns: { type: "number", label: "Columns", min: 2, max: 4 },
  },
  defaultProps: {
    title: "Shop the Collection",
    collection: "",
    columns: 3,
  },
  render: ({ title, collection, columns }) => (
    <ProductGridClient title={title} collection={collection} columns={columns} />
  ),
};

const DEFAULT_TESTIMONIALS = [
  { quote: "A beautiful arrangement that exceeded expectations.", author: "Happy Customer" },
  { quote: "The quality and attention to detail were remarkable.", author: "Satisfied Client" },
  { quote: "Perfect for our anniversary—she loved it.", author: "Romantic Buyer" },
];

const Testimonials: Config["components"][string] = {
  label: "Testimonials",
  fields: {
    title: { type: "text", label: "Title" },
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Carousel", value: "carousel" },
      ],
    },
    items: {
      type: "array",
      label: "Testimonials",
      arrayFields: {
        quote: { type: "text", label: "Quote" },
        author: { type: "text", label: "Author" },
      },
      getItemSummary: (item) => (item as { quote?: string })?.quote?.slice(0, 40) || "Testimonial",
    },
    titleColor: colorField("Title Color", "#1c1917"),
    cardBgColor: colorField("Card Background", "#ffffff"),
    quoteColor: colorField("Quote Color", "#44403c"),
    authorColor: colorField("Author Color", "#78716c"),
    borderColor: colorField("Card Border", "#f5f5f4"),
    borderRadius: { type: "number", label: "Card Border Radius (px)", min: 0, max: 24 },
  },
  defaultProps: {
    title: "What Our Customers Say",
    style: "cards",
    items: DEFAULT_TESTIMONIALS,
    titleColor: "#1c1917",
    cardBgColor: "#ffffff",
    quoteColor: "#44403c",
    authorColor: "#78716c",
    borderColor: "#f5f5f4",
    borderRadius: 12,
  },
  render: ({ title, style, items, titleColor, cardBgColor, quoteColor, authorColor, borderColor, borderRadius }) => {
    const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_TESTIMONIALS;
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: titleColor || "#1c1917" }}>
          {title}
        </h2>
        <div className={`grid gap-6 ${style === "carousel" ? "grid-cols-1" : "md:grid-cols-2"}`}>
          {list.map((item, i) => (
            <div
              key={i}
              className="p-6 shadow-sm"
              style={{
                backgroundColor: cardBgColor || "#ffffff",
                borderColor: borderColor || "#f5f5f4",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: `${borderRadius ?? 12}px`,
              }}
            >
              <p className="italic mb-4" style={{ color: quoteColor || "#44403c" }}>"{typeof item === "object" && item && "quote" in item ? (item as { quote: string }).quote : String(item)}"</p>
              <p className="text-sm" style={{ color: authorColor || "#78716c" }}>— {typeof item === "object" && item && "author" in item ? (item as { author: string }).author : "Customer"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

const DEFAULT_FAQ_ITEMS = [
  { question: "How do I care for my bouquet?", answer: "Gently dust with a soft cloth. Avoid direct sunlight and moisture to preserve the satin." },
  { question: "What occasions do you deliver for?", answer: "We deliver for birthdays, anniversaries, Mother's Day, Valentine's, and any special moment." },
  { question: "Can I customize my order?", answer: "Yes! Contact us to discuss custom arrangements, colors, or special requests." },
];

const FAQ: Config["components"][string] = {
  label: "FAQ",
  fields: {
    title: { type: "text", label: "Title" },
    items: {
      type: "array",
      label: "FAQ Items",
      arrayFields: {
        question: { type: "text", label: "Question" },
        answer: { type: "textarea", label: "Answer" },
      },
      getItemSummary: (item) => (item as { question?: string })?.question?.slice(0, 40) || "FAQ",
    },
    titleColor: colorField("Title Color", "#1c1917"),
    questionColor: colorField("Question Color", "#1c1917"),
    answerColor: colorField("Answer Color", "#44403c"),
    borderColor: colorField("Divider Color", "#f5f5f4"),
  },
  defaultProps: {
    title: "Frequently Asked Questions",
    items: DEFAULT_FAQ_ITEMS,
    titleColor: "#1c1917",
    questionColor: "#1c1917",
    answerColor: "#44403c",
    borderColor: "#f5f5f4",
  },
  render: ({ title, items, titleColor, questionColor, answerColor, borderColor }) => {
    const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_FAQ_ITEMS;
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: titleColor || "#1c1917" }}>
          {title}
        </h2>
        <div className="space-y-4">
          {list.map((item, i) => {
            const q = typeof item === "object" && item && "question" in item ? (item as { question: string }).question : String(item);
            const a = typeof item === "object" && item && "answer" in item ? (item as { answer: string }).answer : "Contact us for details.";
            return (
              <div key={i} className="py-4 border-b" style={{ borderColor: borderColor || "#f5f5f4" }}>
                <p className="font-medium" style={{ color: questionColor || "#1c1917" }}>{q}</p>
                <p className="text-sm mt-1" style={{ color: answerColor || "#44403c" }}>{a}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

const CTA: Config["components"][string] = {
  label: "CTA",
  fields: {
    title: { type: "text", label: "Title" },
    buttonText: { type: "text", label: "Button Text" },
    buttonHref: { type: "text", label: "Button Link" },
    backgroundColor: colorField("Background", "#D4A5A5"),
    titleColor: colorField("Title Color", "#ffffff"),
    buttonBgColor: colorField("Button Background", "#ffffff"),
    buttonTextColor: colorField("Button Text", "#D4A5A5"),
    borderRadius: { type: "number", label: "Border Radius (px)", min: 0, max: 32 },
  },
  defaultProps: {
    title: "Ready to Send Something Beautiful?",
    buttonText: "Shop Now",
    buttonHref: "/collections",
    backgroundColor: "#D4A5A5",
    titleColor: "#ffffff",
    buttonBgColor: "#ffffff",
    buttonTextColor: "#D4A5A5",
    borderRadius: 12,
  },
  render: ({ title, buttonText, buttonHref, backgroundColor, titleColor, buttonBgColor, buttonTextColor, borderRadius }) => (
    <div
      className="py-16 px-8 text-center my-8"
      style={{
        backgroundColor: backgroundColor || "#D4A5A5",
        borderRadius: `${borderRadius ?? 12}px`,
      }}
    >
      <h3 className="text-3xl font-semibold mb-4" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', color: titleColor || "#ffffff" }}>
        {title}
      </h3>
      <a
        href={buttonHref || "#"}
        className="inline-flex px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        style={{ backgroundColor: buttonBgColor || "#ffffff", color: buttonTextColor || "#D4A5A5" }}
      >
        {buttonText}
      </a>
    </div>
  ),
};

const VideoBlock: Config["components"][string] = {
  label: "Video Block",
  fields: {
    url: { type: "text", label: "Video URL (YouTube or Vimeo)" },
    caption: { type: "text", label: "Caption (optional)" },
  },
  defaultProps: {
    url: "",
    caption: "",
  },
  render: ({ url, caption }) => {
    let embedUrl = "";
    if (url) {
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return (
      <div className="py-6 max-w-3xl mx-auto">
        {embedUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              title="Video"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
            Paste a YouTube or Vimeo URL
          </div>
        )}
        {caption && (
          <p className="text-center text-sm text-stone-500 mt-3 italic">{caption}</p>
        )}
      </div>
    );
  },
};

export const puckConfig: Config = {
  root: {
    defaultProps: {
      palette: undefined,
    },
    render: ({ children, palette, ...rest }: Record<string, unknown> & { children: React.ReactNode }) => {
      const p = palette as Record<string, string> | undefined;
      return (
        <div
          style={
            p
              ? {
                  backgroundColor: p.background || "#FAF9F7",
                  color: p.text || "#1c1917",
                  minHeight: "100%",
                  ["--color-primary" as string]: p.primary,
                  ["--color-accent" as string]: p.accent,
                  ["--color-surface" as string]: p.surface,
                } as React.CSSProperties
              : { minHeight: "100%" }
          }
        >
          {children}
        </div>
      );
    },
  },
  components: {
    Hero,
    HeroImage,
    TextBlock,
    PullQuote,
    ScentSpotlight,
    ImageText,
    ProductGrid,
    ProductGallery,
    FeaturedProducts,
    Testimonials,
    FAQ,
    CTA,
    CTABanner,
    VideoBlock,
  },
  categories: {
    content: {
      components: ["TextBlock", "PullQuote", "ImageText"],
      title: "Content",
    },
    media: {
      components: ["HeroImage", "VideoBlock", "ProductGallery"],
      title: "Media",
    },
    commerce: {
      components: ["FeaturedProducts", "ScentSpotlight"],
      title: "Commerce",
    },
    layout: {
      components: ["Hero", "CTA", "CTABanner", "ProductGrid", "Testimonials", "FAQ"],
      title: "Layout",
    },
  },
};

export default puckConfig;
