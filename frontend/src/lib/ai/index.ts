/**
 * AI Layout Engine - Main pipeline and exports
 * Production-ready AI layout engine for Petals for Her
 */

import { callClaudeWithSchema } from "./claude";
import { buildLayoutPlanPrompt, buildSEOPrompt, buildOptimizeSEOPrompt } from "./prompts";
import {
  LayoutPlanSchema,
  PaletteSchema,
  SectionsSchema,
  GeneratedPageSchema,
  SEOSchema,
  SEOOptimizationSchema,
} from "./schemas";
import type { GeneratedPage, PageType } from "./types";
import { generateLayoutPlan } from "./layout-engine";
import { generatePalette } from "./palette-engine";
import { generateLayoutFromPlan } from "./layout-engine";

export * from "./types";
export * from "./schemas";
export * from "./layout-engine";
export * from "./palette-engine";
export * from "./screenshot-engine";
export * from "./proposals-engine";

/** Full-page pipeline: prompt → layout plan → palette → sections → SEO */
export async function generatePageFromPrompt(
  prompt: string,
  options?: {
    pageType?: PageType;
    brandContext?: string;
  }
): Promise<{ page: GeneratedPage }> {
  // 1. Layout plan
  const planResult = await generateLayoutPlan(prompt, {
    pageType: options?.pageType || "landing",
    brandContext: options?.brandContext,
  });

  // 2. Palette
  const paletteResult = await generatePalette(
    options?.pageType || "landing",
    options?.brandContext
  );

  // 3. Convert plan to sections (pass user prompt for context and variety)
  const sectionsResult = await generateLayoutFromPlan(planResult.layoutPlan, {
    palette: paletteResult.palette,
    userPrompt: prompt,
  });

  // 4. SEO
  const seoResult = await callClaudeWithSchema(
    buildSEOPrompt(),
    `Page context: ${prompt}\nTitle suggestion: ${planResult.layoutPlan[0]?.purpose || "Landing"}`,
    SEOSchema
  );

  // 5. Build final page
  const slug = (prompt || "new-page")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const page: GeneratedPage = {
    title: seoResult.seo.title,
    slug: slug || "new-page",
    palette: paletteResult.palette,
    sections: sectionsResult.sections,
    seo: seoResult.seo,
  };

  const validated = GeneratedPageSchema.parse({ page });
  return validated;
}

/** Extract text content from Puck data for SEO context */
export function extractTextFromPuckData(puckData: { content?: unknown[] }): string {
  const parts: string[] = [];
  const blocks = puckData?.content || [];
  for (const block of blocks) {
    const props = (block as { props?: Record<string, unknown> })?.props || {};
    for (const val of Object.values(props)) {
      if (typeof val === "string" && val.length > 3) {
        parts.push(val);
      }
    }
  }
  return parts.join("\n\n").slice(0, 4000);
}

/** Optimize SEO for a journal post - returns improved meta + suggestions + opinion */
export async function optimizeSEOForPost(context: {
  title: string;
  meta_title?: string;
  meta_description?: string;
  bodyText: string;
}): Promise<{
  meta_title: string;
  meta_description: string;
  suggestions: string[];
  opinion: string;
}> {
  const userMessage = [
    `Title: ${context.title || "(none)"}`,
    `Current meta_title: ${context.meta_title || "(none)"}`,
    `Current meta_description: ${context.meta_description || "(none)"}`,
    "",
    "Body content:",
    context.bodyText || "(no content yet)",
  ].join("\n");

  const result = await callClaudeWithSchema(
    buildOptimizeSEOPrompt(),
    userMessage,
    SEOOptimizationSchema,
    { temperature: 0.5 }
  );
  return result;
}

/** Calculate SEO score 0-100 for a journal post */
export function calculateSEOScore(context: {
  title: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  wordCount: number;
}): number {
  let score = 0;
  const { title, meta_title = "", meta_description = "", slug = "", wordCount } = context;

  // Title (20 pts)
  if (title?.trim()) score += 20;

  // Meta title (20 pts): 0 empty, 10 if 30-70 chars, 20 if 50-60
  const mtLen = meta_title.trim().length;
  if (mtLen >= 50 && mtLen <= 60) score += 20;
  else if (mtLen >= 30 && mtLen <= 70) score += 10;
  else if (mtLen > 0) score += 5;

  // Meta description (20 pts): 0 empty, 10 if 100-200, 20 if 150-160
  const mdLen = meta_description.trim().length;
  if (mdLen >= 150 && mdLen <= 160) score += 20;
  else if (mdLen >= 100 && mdLen <= 200) score += 10;
  else if (mdLen > 0) score += 5;

  // Slug (20 pts)
  if (slug?.trim() && /^[a-z0-9-]+$/.test(slug)) score += 20;
  else if (slug?.trim()) score += 10;

  // Content (20 pts)
  if (wordCount >= 400) score += 20;
  else if (wordCount >= 200) score += 15;
  else if (wordCount >= 100) score += 10;
  else if (wordCount >= 50) score += 5;

  return Math.min(100, score);
}

/** Convert generated page sections to Puck data format */
export function pageToPuckData(page: GeneratedPage): {
  content: unknown[];
  root: { props: Record<string, unknown> };
  zones?: Record<string, unknown[]>;
} {
  const content = page.sections.map((s) => ({
    type: s.type,
    props: { ...s.props, id: s.id },
  }));

  return {
    content,
    root: {
      props: {
        palette: page.palette,
      },
    },
    zones: {}, // Required by Puck Data model
  };
}
