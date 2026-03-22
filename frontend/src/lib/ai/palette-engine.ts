/**
 * AI Layout Engine - Palette generation
 * MODE 2: Generate premium color palettes
 */

import { callClaudeWithSchema } from "./claude";
import { buildPalettePrompt } from "./prompts";
import { PaletteSchema } from "./schemas";
import type { Palette } from "./types";
import { BRAND_CONTEXT } from "./types";

/** MODE 2: Generate palette from page type and style */
export async function generatePalette(
  pageType: string,
  styleHint?: string
): Promise<{ palette: Palette }> {
  const userMessage = styleHint
    ? `Page type: ${pageType}\nStyle hint: ${styleHint}`
    : `Page type: ${pageType}\nBrand: ${BRAND_CONTEXT.name}, primary: ${BRAND_CONTEXT.primaryColor}`;

  const result = await callClaudeWithSchema(
    buildPalettePrompt(),
    userMessage,
    PaletteSchema
  );
  return result;
}
