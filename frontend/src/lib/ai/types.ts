/**
 * AI Layout Engine - Type definitions
 * Premium satin bouquet ecommerce brand - romantic, elegant, soft luxury
 */

/** Allowed Puck component types for safe rendering */
export type AllowedSectionType = "Hero" | "ProductGrid" | "Testimonials" | "FAQ" | "CTA";

/** Layout plan item from MODE 1 */
export interface LayoutPlanItem {
  section: AllowedSectionType;
  purpose: string;
  notes: string;
}

/** Color palette from MODE 2 */
export interface Palette {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

/** Section from MODE 3 - Puck-compatible */
export interface Section {
  id: string;
  type: AllowedSectionType;
  props: Record<string, unknown>;
}

/** Action types for MODE 4 - layout improvement */
export type ActionType =
  | "add_section"
  | "remove_section"
  | "move_section"
  | "update_props"
  | "update_palette";

export interface LayoutAction {
  type: ActionType;
  sectionId?: string;
  position?: { index?: number };
  section?: Section;
  props?: Record<string, unknown>;
  palette?: Partial<Palette>;
}

/** Innovation/proposal mode - suggests future components */
export type ProposalType = "new_component" | "new_prop";

export interface Proposal {
  type: ProposalType;
  name: string;
  basedOn?: string;
  description: string;
  suggestedProps?: Record<string, unknown>;
}

/** Full generated page from pipeline */
export interface GeneratedPage {
  title: string;
  slug: string;
  palette: Palette;
  sections: Section[];
  seo: {
    title: string;
    description: string;
  };
}

/** Page types for context */
export type PageType =
  | "occasion"
  | "collection"
  | "blog"
  | "landing"
  | "product";

/** Brand context for prompts */
export const BRAND_CONTEXT = {
  name: "Petals for Her",
  style: "premium, romantic, elegant, satin bouquet luxury, soft feminine modern ecommerce",
  primaryColor: "#D4A5A5",
  tone: "tasteful, not childish; soft luxury; premium feminine",
} as const;
