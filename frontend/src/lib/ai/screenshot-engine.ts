/**
 * AI Layout Engine - Screenshot/design reference analysis
 * MODE 5: Analyze image, output layout plan
 */

import { callClaudeWithSchema } from "./claude";
import { buildScreenshotAnalysisPrompt } from "./prompts";
import { ScreenshotAnalysisSchema } from "./schemas";
import type { LayoutPlanItem } from "./types";

/** MODE 5: Analyze screenshot, return layout plan */
export async function analyzeScreenshot(
  imageBase64: string,
  userContext?: string
): Promise<{ layoutPlan: LayoutPlanItem[] }> {
  const userMessage = userContext
    ? `Context: ${userContext}\n\nAnalyze the attached design reference image.`
    : "Analyze the attached design reference image and produce a layout plan.";

  const result = await callClaudeWithSchema(
    buildScreenshotAnalysisPrompt(),
    userMessage,
    ScreenshotAnalysisSchema,
    { imageBase64 }
  );
  return result;
}
