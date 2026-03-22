/**
 * AI Layout Engine - Anthropic Claude client
 * Uses @anthropic-ai/sdk, ANTHROPIC_API_KEY from env
 * Enforces JSON-only responses with retry on validation failure
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { parseAIJson } from "./schemas";

const MODEL = "claude-haiku-4-5";
const MAX_RETRIES = 2;
const RETRY_MESSAGE =
  "The previous response did not match the required schema. Return valid JSON only, with no markdown or explanation.";

/** AI API base - Rails admin endpoint */
function getApiBase(): string {
  return "/api/v1/admin";
}

/** Call Claude via Rails backend (keeps API key server-side) */
async function callClaudeBackend(
  systemPrompt: string,
  userMessage: string,
  imageBase64?: string,
  temperature?: number
): Promise<string> {
  const token = localStorage.getItem("petals_jwt");
  const body: Record<string, unknown> = {
    system_prompt: systemPrompt,
    user_message: userMessage,
  };
  if (imageBase64) {
    body.image_base64 = imageBase64;
  }
  if (temperature != null && temperature >= 0 && temperature <= 1) {
    body.temperature = temperature;
  }

  const res = await fetch(`${getApiBase()}/ai/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `AI request failed: ${res.status}`);
  }

  const json = await res.json();
  return json.content || json.text || "";
}

/**
 * Call Claude and parse response as JSON.
 * Retries up to MAX_RETRIES times if schema validation fails.
 */
/** Temperature for creative tasks (layout, copy) - higher = more varied output. Use 0.8 for layout gen. */
const LAYOUT_TEMPERATURE = 0.8;

export async function callClaudeWithSchema<T>(
  systemPrompt: string,
  userMessage: string,
  schema: z.ZodType<T>,
  options?: { imageBase64?: string; temperature?: number }
): Promise<T> {
  let lastError: Error | null = null;
  let retryMessage = userMessage;
  const temp = options?.temperature ?? LAYOUT_TEMPERATURE;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const content = await callClaudeBackend(
        systemPrompt,
        retryMessage,
        options?.imageBase64,
        temp
      );
      const parsed = parseAIJson<unknown>(content);
      const result = schema.parse(parsed);
      return result;
    } catch (e) {
      lastError = e as Error;
      if (attempt < MAX_RETRIES && !(e instanceof z.ZodError)) {
        retryMessage = `${userMessage}\n\n${RETRY_MESSAGE}`;
      } else if (e instanceof z.ZodError) {
        retryMessage = `${userMessage}\n\n${RETRY_MESSAGE}`;
      } else {
        break;
      }
    }
  }

  throw lastError || new Error("AI validation failed");
}

/**
 * Raw Claude call - returns text. Use for non-JSON responses.
 */
export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { imageBase64?: string }
): Promise<string> {
  return callClaudeBackend(systemPrompt, userMessage, options?.imageBase64);
}
