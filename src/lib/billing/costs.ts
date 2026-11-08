/**
 * Per-million-token list prices (USD), Anthropic first-party API, as of 2026-10.
 * Used to log our cost per menu so we can watch gross margin. Update when prices change.
 */
export const MODEL_PRICES: Record<string, { input: number; output: number; cacheRead: number }> = {
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
  "claude-opus-4-8": { input: 5, output: 25, cacheRead: 0.5 },
};

export function costUsd(model: string, input: number, output: number, cacheRead = 0): number {
  const base = Object.keys(MODEL_PRICES).find((k) => model.startsWith(k));
  const p = base ? MODEL_PRICES[base] : MODEL_PRICES["claude-opus-5-5"];
  return (input * p.input + output * p.output + cacheRead * p.cacheRead) / 1_000_000;
}
