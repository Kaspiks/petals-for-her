# AI Layout Engine

Production-ready AI layout engine for Petals for Her. Uses Claude Haiku 4.5 for structured JSON output.

## Setup

1. Set `ANTHROPIC_API_KEY` in Rails (`.env` or credentials)
2. Run `npm install` (adds zod)
3. Ensure you're logged in as admin (JWT required for `/api/v1/admin/ai/complete`)

## Modes

| Mode | Function | Example Prompt |
|------|----------|----------------|
| Layout Plan | `generateLayoutPlan()` | "Create a Mother's Day landing page for satin bouquets" |
| Palette | `generatePalette()` | "Generate a soft luxury palette for an anniversary collection" |
| Layout Gen | `generateLayoutFromPlan()` | (internal - plan → sections) |
| Improve | `improveLayout()` | "Make this page feel more premium and romantic" |
| Screenshot | `analyzeScreenshot()` | "Analyze this design reference and create a layout plan" |

## Full Pipeline

```ts
import { generatePageFromPrompt, pageToPuckData } from "@/lib/ai";

const { page } = await generatePageFromPrompt(
  "Create a Mother's Day landing page for satin bouquets",
  { pageType: "landing" }
);

const puckData = pageToPuckData(page);
// Apply to Puck: setPuckData(puckData);
```

## Example Prompts

- **Generate Page**: "Create a Mother's Day landing page for satin bouquets"
- **Improve Layout**: "Make this page feel more premium and romantic"
- **Generate Palette**: "Generate a soft luxury palette for an anniversary collection"
- **Analyze Screenshot**: "Analyze this design reference and create a layout plan"

## Architecture

- **Validation**: All AI output passes Zod schemas before use
- **Retry**: Up to 2 retries if schema validation fails
- **Safe rendering**: Only validated JSON is applied to Puck
