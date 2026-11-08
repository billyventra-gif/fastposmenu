import { applyDefaultTaxes, checkMenu } from "../menu/normalize";
import type { Menu } from "../menu/schema";
import { exportClover } from "./clover";
import type { ExportResult } from "./common";
import { exportSquare } from "./square";
import { exportToast } from "./toast";

export async function exportMenu(menu: Menu): Promise<ExportResult> {
  const m = menu.taxes.length ? menu : applyDefaultTaxes(menu);
  const base = checkMenu(m);
  if (base.some((i) => i.level === "error")) return { files: [], issues: base, steps: [] };
  const r = menu.target === "square" ? await exportSquare(m) : menu.target === "clover" ? await exportClover(m) : await exportToast(m);
  return { ...r, issues: [...base, ...r.issues] };
}
