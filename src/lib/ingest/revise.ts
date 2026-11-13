import "server-only";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { compactMenu, EditPlan } from "../menu/edit-ops";
import type { Menu } from "../menu/schema";
import { EFFORT, getClient, MODEL } from "./claude";

const SYSTEM = `You edit restaurant menus for POS import. The user asks for changes in plain English. You return a plan of edit operations; code applies them.

Rules:
- Use only IDs that appear in the menu JSON.
- For price changes across many items, use adjust_prices (code does the math). Never compute new prices yourself for bulk changes.
- Use set_price only for one-off prices the user states explicitly.
- Keep the plan minimal: only what the user asked for.
- If something is ambiguous or not possible with the available operations, do what's clear and explain the rest in "unclear".
- Don't invent items, prices, or options the user didn't ask for.`;

export async function planEdits(menu: Menu, request: string) {
  const stream = getClient().beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { effort: EFFORT, format: betaZodOutputFormat(EditPlan) },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `<menu>\n${JSON.stringify(compactMenu(menu))}\n</menu>` },
          { type: "text", text: `<request>\n${request.slice(0, 2000)}\n</request>` },
        ],
      },
    ],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("Couldn't make that change. Try rewording it.");
  if (!msg.parsed_output) throw new Error("Couldn't understand that. Try being more specific.");
  return {
    plan: EditPlan.parse(msg.parsed_output),
    usage: { input: msg.usage.input_tokens + (msg.usage.cache_creation_input_tokens ?? 0), output: msg.usage.output_tokens, cacheRead: msg.usage.cache_read_input_tokens ?? 0, model: msg.model },
  };
}
