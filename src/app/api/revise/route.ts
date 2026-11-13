import { planEdits } from "@/lib/ingest/revise";
import { costUsd } from "@/lib/billing/costs";
import { Menu } from "@/lib/menu/schema";
import { clientIp, takeRevise } from "@/lib/ratelimit";

export const maxDuration = 120;

/** Plain-English menu edits → an edit plan. The browser previews it, then applies it in code. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const menu = Menu.safeParse(body?.menu);
  const request = typeof body?.request === "string" ? body.request.trim() : "";
  if (!menu.success) return Response.json({ error: "Menu has problems. Refresh and try again." }, { status: 400 });
  if (!request) return Response.json({ error: "Tell it what to change." }, { status: 400 });
  if (menu.data.items.length > 600) return Response.json({ error: "Menu is too big for one change request." }, { status: 413 });

  const wait = takeRevise(clientIp(req));
  if (wait) return Response.json({ error: `Too many changes this hour. Try again in ${Math.ceil(wait / 60)} min.` }, { status: 429 });

  try {
    const { plan, usage } = await planEdits(menu.data, request);
    console.log("[revise]", { ops: plan.ops.length, ...usage, costUsd: costUsd(usage.model, usage.input, usage.output, usage.cacheRead) });
    return Response.json({ plan });
  } catch (e) {
    console.error("[revise] failed", e);
    return Response.json({ error: e instanceof Error ? e.message : "Something broke. Try again." }, { status: 500 });
  }
}
