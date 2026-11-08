import { canExport, recordExport } from "@/lib/billing/entitlements";
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
  const menuId = typeof body?.menuId === "string" ? body.menuId : "draft";

  // Billing hook: always allowed until Stripe is wired. Charge on download, not on preview.
  const ent = await canExport(null, menuId);
  if (!ent.allowed) return Response.json({ error: ent.reason, upgradeUrl: ent.upgradeUrl }, { status: 402 });

  const result = await exportMenu(menu);
  if (result.files.length) await recordExport(null, menuId, menu.target);
  return Response.json({
    issues: result.issues,
    steps: result.steps,
    files: result.files.map((f) => ({ filename: f.filename, mime: f.mime, base64: Buffer.from(f.body).toString("base64") })),
  });
}
