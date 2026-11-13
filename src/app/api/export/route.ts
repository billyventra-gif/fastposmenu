import { canExport } from "@/lib/billing/entitlements";
import { billingEnabled } from "@/lib/billing/stripe";
import { PER_MENU, PRO } from "@/lib/billing/plans";
import { exportMenu } from "@/lib/export";
import { Menu } from "@/lib/menu/schema";

/** Build the POS import file(s). Returns files as base64 so the client can offer several downloads. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Menu.safeParse(body?.menu);
  if (!parsed.success) {
    return Response.json({ error: "Menu has problems.", issues: parsed.error.issues.slice(0, 10) }, { status: 400 });
  }
  const menu = parsed.data;

  // Pay per menu: charge on download, not on preview.
  const ent = await canExport(body?.draftId, body?.paidSessionId, body?.proSessionId);
  const pro = ent.pro ? { used: ent.pro.used, limit: ent.pro.limit } : undefined;
  if (!ent.allowed) {
    const overLimit = ent.reason === "pro_limit";
    const needsPayment = overLimit || ent.reason === "payment_required";
    return Response.json(
      {
        error: overLimit ? `You've used all ${PRO.builds} Pro builds this month.` : needsPayment ? "Payment needed to download." : ent.reason,
        needsPayment,
        priceCents: overLimit ? PRO.overageCents : PER_MENU.priceCents,
        pro,
      },
      { status: 402 },
    );
  }

  const result = await exportMenu(menu);
  if (result.files.length && billingEnabled()) {
    console.log("[export] paid", { draftId: body?.draftId, session: ent.paidSessionId, pro, target: menu.target, items: menu.items.length });
  }
  return Response.json({
    issues: result.issues,
    steps: result.steps,
    pro,
    files: result.files.map((f) => ({ filename: f.filename, mime: f.mime, base64: Buffer.from(f.body).toString("base64") })),
  });
}
