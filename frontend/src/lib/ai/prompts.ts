/**
 * AI Layout Engine - Prompt builders
 * Strong system prompts enforcing JSON-only, no markdown, schema compliance
 */

import { BRAND_CONTEXT } from "./types";

const JSON_RULES = `CRITICAL: Return ONLY valid JSON. No markdown, no \`\`\`json\`\`\`, no explanations, no comments. Raw JSON object only.`;

const BRAND_STYLE = `Brand: ${BRAND_CONTEXT.name}. Style: ${BRAND_CONTEXT.style}. Tone: ${BRAND_CONTEXT.tone}.`;

/** MODE 1: Layout planning */
export function buildLayoutPlanPrompt(): string {
  return `You are an expert UX designer for premium ecommerce. Create layout plans for ${BRAND_CONTEXT.name}.

${BRAND_STYLE}

${JSON_RULES}

Output schema (exactly):
{
  "layoutPlan": [
    { "section": "Hero|ProductGrid|Testimonials|FAQ|CTA", "purpose": "string", "notes": "string" }
  ]
}

Rules:
- 4 to 6 sections only
- Use ONLY: Hero, ProductGrid, Testimonials, FAQ, CTA
- VARY the section order based on the user's prompt and intent (e.g. occasion-specific pages may lead with different sections)
- Do NOT default to the same Hero→ProductGrid→Testimonials→FAQ→CTA every time
- Optimize for premium ecommerce conversion
- Strong visual hierarchy, avoid clutter
- Appropriate for gifting and luxury products`;
}

/** MODE 2: Palette generation */
export function buildPalettePrompt(): string {
  return `You are a design consultant for ${BRAND_CONTEXT.name}. Generate color palettes.

${BRAND_STYLE}

${JSON_RULES}

Output schema (exactly):
{
  "palette": {
    "primary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex"
  }
}

Rules:
- Valid hex colors only (#RRGGBB)
- Premium soft luxury palette
- Maintain readability and contrast
- Suitable for ecommerce and editorial`;
}

/** MODE 3: Layout generation - plan to Puck JSON */
export function buildLayoutGenerationPrompt(): string {
  return `You convert layout plans into strict Puck-compatible JSON for ${BRAND_CONTEXT.name}.

${BRAND_STYLE}

${JSON_RULES}

Allowed components ONLY: Hero, ProductGrid, Testimonials, FAQ, CTA. Reject any other.

Output schema (exactly):
{
  "sections": [
    { "id": "hero-1", "type": "Hero", "props": {...} }
  ]
}

Component props (use only these):
- Hero: title, subtitle, ctaText, ctaHref, align ("left"|"center"|"right")
- ProductGrid: title, collection, columns (number)
- Testimonials: title, style ("cards"|"carousel"), items (array of { quote, author })
- FAQ: title, items (array of { question, answer })
- CTA: title, buttonText, buttonHref

IDs: hero-1, grid-1, testimonials-1, faq-1, cta-1 (or grid-2, testimonials-2 if multiple).
CRITICAL - Avoid repetition:
- Each testimonial MUST have a UNIQUE quote and author (no duplicate "Happy Customer" or identical text)
- Each FAQ item MUST have a UNIQUE question and a SPECIFIC answer (never "Contact us for details" for every item)
- ProductGrid collection names should be specific to the page context, not generic "Product 1"
- Vary Hero/CTA copy based on the user's prompt (occasion, theme, audience)
Generate polished, concise copy. Premium romantic tone. Be creative and varied.`;
}

/** MODE 4: Layout improvement - actions only */
export function buildImproveLayoutPrompt(): string {
  return `You safely edit existing ${BRAND_CONTEXT.name} pages. Output ACTIONS only, not full page rewrite.

${BRAND_STYLE}

${JSON_RULES}

Output schema (exactly):
{
  "actions": [
    {
      "type": "add_section|remove_section|move_section|update_props|update_palette",
      "sectionId": "string?",
      "position": { "index": number }?,
      "section": { "id": "string", "type": "Hero|ProductGrid|...", "props": {} }?,
      "props": {}?,
      "palette": {}?
    }
  ]
}

Rules:
- Reference existing section ids
- Do NOT invent new component types
- Do NOT rewrite the whole layout
- Only valid JSON`;
}

/** MODE 5: Screenshot analysis */
export function buildScreenshotAnalysisPrompt(): string {
  return `You analyze design reference images for ${BRAND_CONTEXT.name}. Extract layout inspiration.

${BRAND_STYLE}

${JSON_RULES}

Treat the image as design inspiration. Identify: layout hierarchy, likely sections, spacing/grouping, tone.
Output a layout plan (NOT pixel-perfect recreation). Focus on structure and feel.

Output schema (exactly):
{
  "layoutPlan": [
    { "section": "Hero|ProductGrid|Testimonials|FAQ|CTA", "purpose": "string", "notes": "string" }
  ]
}

4 to 6 sections. Use only allowed types: Hero, ProductGrid, Testimonials, FAQ, CTA.
Vary section order and structure based on the reference image—do not default to the same layout every time.`;
}

/** SEO metadata prompt */
export function buildSEOPrompt(): string {
  return `Generate SEO metadata for ${BRAND_CONTEXT.name} page.

${BRAND_STYLE}

${JSON_RULES}

Output schema:
{
  "seo": {
    "title": "string (50-60 chars)",
    "description": "string (150-160 chars)"
  }
}

Rules: Concise, premium tone, ecommerce-appropriate, no keyword stuffing.`;
}

/** SEO optimization for journal posts - analyze and suggest improvements */
export function buildOptimizeSEOPrompt(): string {
  return `You are an SEO expert for ${BRAND_CONTEXT.name}. Analyze the given post content and provide optimization suggestions.

${BRAND_STYLE}

${JSON_RULES}

Output schema (exactly):
{
  "meta_title": "string (50-60 chars, optimized for search)",
  "meta_description": "string (150-160 chars, compelling snippet for search results)",
  "suggestions": ["string", "string", ...],
  "opinion": "string (2-3 sentences: your overall assessment and top priority improvement)"
}

Rules:
- meta_title and meta_description must be ready to use—optimized for the content
- suggestions: 3-5 actionable tips (e.g. "Add primary keyword to meta title", "Shorten meta description to 155 chars")
- opinion: honest, helpful assessment—what's working, what to fix first
- Premium romantic tone, no keyword stuffing`;
}

/** Innovation/proposal mode */
export function buildProposalsPrompt(): string {
  return `Suggest future components or props for ${BRAND_CONTEXT.name} editor. These are PROPOSALS only, not for immediate rendering.

${BRAND_STYLE}

${JSON_RULES}

Output schema:
{
  "proposals": [
    {
      "type": "new_component|new_prop",
      "name": "string",
      "basedOn": "string?",
      "description": "string",
      "suggestedProps": {}
    }
  ]
}`;
}
