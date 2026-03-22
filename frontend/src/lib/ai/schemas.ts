/**
 * AI Layout Engine - Zod schemas for strict validation
 * All AI output must pass these before rendering
 */

import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color");

/** MODE 1: Layout plan */
export const LayoutPlanItemSchema = z.object({
  section: z.enum(["Hero", "ProductGrid", "Testimonials", "FAQ", "CTA"]),
  purpose: z.string(),
  notes: z.string(),
});

export const LayoutPlanSchema = z.object({
  layoutPlan: z.array(LayoutPlanItemSchema).min(4).max(6),
});

/** MODE 2: Palette */
export const PaletteSchema = z.object({
  palette: z.object({
    primary: hexColor,
    accent: hexColor,
    background: hexColor,
    surface: hexColor,
    text: hexColor,
  }),
});

/** MODE 3: Sections - Puck-compatible */
export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(["Hero", "ProductGrid", "Testimonials", "FAQ", "CTA"]),
  props: z.record(z.unknown()),
});

export const SectionsSchema = z.object({
  sections: z.array(SectionSchema),
});

/** MODE 4: Layout improvement actions */
export const LayoutActionSchema = z.object({
  type: z.enum([
    "add_section",
    "remove_section",
    "move_section",
    "update_props",
    "update_palette",
  ]),
  sectionId: z.string().optional(),
  position: z.object({ index: z.number().optional() }).optional(),
  section: SectionSchema.optional(),
  props: z.record(z.unknown()).optional(),
  palette: z
    .object({
      primary: hexColor.optional(),
      accent: hexColor.optional(),
      background: hexColor.optional(),
      surface: hexColor.optional(),
      text: hexColor.optional(),
    })
    .optional(),
});

export const LayoutActionsSchema = z.object({
  actions: z.array(LayoutActionSchema),
});

/** MODE 5: Screenshot analysis - outputs layout plan */
export const ScreenshotAnalysisSchema = LayoutPlanSchema;

/** Innovation/proposal mode */
export const ProposalSchema = z.object({
  type: z.enum(["new_component", "new_prop"]),
  name: z.string(),
  basedOn: z.string().optional(),
  description: z.string(),
  suggestedProps: z.record(z.unknown()).optional(),
});

export const ProposalsSchema = z.object({
  proposals: z.array(ProposalSchema),
});

/** SEO metadata */
export const SEOSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

/** SEO optimization for posts - suggestions + improved meta */
export const SEOOptimizationSchema = z.object({
  meta_title: z.string(),
  meta_description: z.string(),
  suggestions: z.array(z.string()),
  opinion: z.string(),
});

/** Full page object from pipeline */
export const GeneratedPageSchema = z.object({
  page: z.object({
    title: z.string(),
    slug: z.string(),
    palette: PaletteSchema.shape.palette,
    sections: z.array(SectionSchema),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

/** Typed validation error */
export class AIValidationError extends Error {
  constructor(
    message: string,
    public readonly schema: string,
    public readonly raw?: string
  ) {
    super(message);
    this.name = "AIValidationError";
  }
}

/** Parse JSON safely, strip markdown code blocks if present */
export function parseAIJson<T>(raw: string): T {
  let cleaned = raw.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    throw new AIValidationError(
      `Invalid JSON: ${(e as Error).message}`,
      "parse",
      raw
    );
  }
}
