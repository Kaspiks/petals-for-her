/**
 * AI Layout Engine - Innovation/proposal mode
 * Suggests future components or props (not for immediate rendering)
 */

import { callClaudeWithSchema } from "./claude";
import { buildProposalsPrompt } from "./prompts";
import { ProposalsSchema } from "./schemas";
import type { Proposal } from "./types";

/** Get AI proposals for new components or props */
export async function getProposals(
  context: string
): Promise<{ proposals: Proposal[] }> {
  const userMessage = context || "Suggest improvements for the Petals for Her editor.";
  const result = await callClaudeWithSchema(
    buildProposalsPrompt(),
    userMessage,
    ProposalsSchema
  );
  return result;
}
