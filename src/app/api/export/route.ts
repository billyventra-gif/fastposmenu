import { canExport } from "@/lib/billing/entitlements";
import { billingEnabled } from "@/lib/billing/stripe";
import { PER_MENU } from "@/lib/billing/plans";
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
  const ent = await canExport(body?.draftId, body?.paidSessionId);
  if (!ent.allowed) {
    const needsPayment = ent.reason === "payment_required";
    return Response.json(
      { error: needsPayment ? "Payment needed to download." : ent.reason, needsPayment, priceCents: PER_MENU.priceCents },
      { status: 402 },
    );
  }

  const result = await exportMenu(menu);
  if (result.files.length && billingEnabled()) {
    console.log("[export] paid", { draftId: body?.draftId, session: ent.paidSessionId, target: menu.target, items: menu.items.length });
  }
  return Response.json({
    issues: result.issues,
    steps: result.steps,
    files: result.files.map((f) => ({ filename: f.filename, mime: f.mime, base64: Buffer.from(f.body).toString("base64") })),
  });
}
