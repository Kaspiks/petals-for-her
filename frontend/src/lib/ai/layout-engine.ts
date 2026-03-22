/**
 * AI Layout Engine - Layout planning and generation
 * MODE 1: Layout plan | MODE 3: Plan → Puck JSON | MODE 4: Improve layout
 */

import { callClaudeWithSchema } from "./claude";
import {
  buildLayoutPlanPrompt,
  buildLayoutGenerationPrompt,
  buildImproveLayoutPrompt,
} from "./prompts";
import {
  LayoutPlanSchema,
  SectionsSchema,
  LayoutActionsSchema,
} from "./schemas";
import type { LayoutPlanItem, Section, LayoutAction } from "./types";
import { BRAND_CONTEXT } from "./types";

/** MODE 1: Generate layout plan from user prompt */
export async function generateLayoutPlan(
  userPrompt: string,
  options?: { pageType?: string; brandContext?: string }
): Promise<{ layoutPlan: LayoutPlanItem[] }> {
  const context = options?.brandContext || BRAND_CONTEXT.style;
  const pageType = options?.pageType || "landing";

  const userMessage = `Page type: ${pageType}\nBrand context: ${context}\n\nUser prompt: ${userPrompt}`;
  const result = await callClaudeWithSchema(
    buildLayoutPlanPrompt(),
    userMessage,
    LayoutPlanSchema
  );
  return result;
}

/** MODE 3: Convert layout plan to Puck-compatible sections */
export async function generateLayoutFromPlan(
  layoutPlan: LayoutPlanItem[],
  options?: { palette?: Record<string, string>; userPrompt?: string }
): Promise<{ sections: Section[] }> {
  const planStr = JSON.stringify(layoutPlan, null, 2);
  let userMessage = `Layout plan:\n${planStr}`;
  if (options?.palette) {
    userMessage += `\n\nPreferred palette: ${JSON.stringify(options.palette)}`;
  }
  if (options?.userPrompt) {
    userMessage += `\n\nUser's original request (use this for context—vary copy, occasion, and tone accordingly): ${options.userPrompt}`;
  }

  const result = await callClaudeWithSchema(
    buildLayoutGenerationPrompt(),
    userMessage,
    SectionsSchema
  );
  return result;
}

/** MODE 4: Generate improvement actions for existing layout */
export async function improveLayout(
  currentPageJson: unknown,
  userGoal: string
): Promise<{ actions: LayoutAction[] }> {
  const pageStr =
    typeof currentPageJson === "string"
      ? currentPageJson
      : JSON.stringify(currentPageJson, null, 2);

  const userMessage = `Current page JSON:\n${pageStr}\n\nUser goal: ${userGoal}`;
  const result = await callClaudeWithSchema(
    buildImproveLayoutPrompt(),
    userMessage,
    LayoutActionsSchema
  );
  return result;
}

/** Apply improvement actions to Puck data - safe transformation */
export function applyLayoutActions(
  puckData: { content: unknown[]; root: { props: Record<string, unknown> } },
  actions: LayoutAction[]
): { content: unknown[]; root: { props: Record<string, unknown> } } {
  let content = [...(puckData.content || [])];
  let rootProps = { ...(puckData.root?.props || {}) };

  for (const action of actions) {
    switch (action.type) {
      case "add_section":
        if (action.section) {
          const block = {
            type: action.section.type,
            props: { ...action.section.props, id: action.section.id },
          };
          const idx = action.position?.index ?? content.length;
          content.splice(idx, 0, block);
        }
        break;

      case "remove_section":
        if (action.sectionId) {
          content = content.filter(
            (b: any) => b.props?.id !== action.sectionId
          );
        }
        break;

      case "move_section":
        if (action.sectionId && action.position?.index !== undefined) {
          const i = content.findIndex(
            (b: any) => b.props?.id === action.sectionId
          );
          if (i >= 0) {
            const [item] = content.splice(i, 1);
            content.splice(action.position.index, 0, item);
          }
        }
        break;

      case "update_props":
        if (action.sectionId && action.props) {
          content = content.map((b: any) =>
            b.props?.id === action.sectionId
              ? { ...b, props: { ...b.props, ...action.props } }
              : b
          );
        }
        break;

      case "update_palette":
        if (action.palette) {
          rootProps = { ...rootProps, palette: action.palette };
        }
        break;
    }
  }

  return {
    content,
    root: { props: rootProps },
    zones: puckData.zones || {},
  };
}
