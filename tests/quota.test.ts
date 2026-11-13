import { test } from "node:test";
import assert from "node:assert/strict";
import { consumeBuild, draftKey } from "../src/lib/billing/quota";

const P1 = 1794500000;
const P2 = P1 + 30 * 86400;

test("pro quota: counts new drafts, re-downloads are free, limit holds, new period resets", () => {
  let meta = {};
  for (let i = 0; i < 10; i++) {
    const r = consumeBuild(meta, P1, `d_draft${i}aaaaaaa`, 10);
    assert.equal(r.allowed, true);
    assert.equal(r.used, i + 1);
    meta = r.next;
  }
  const again = consumeBuild(meta, P1, "d_draft3aaaaaaa", 10);
  assert.deepEqual([again.allowed, again.changed, again.used], [true, false, 10]);
  const over = consumeBuild(meta, P1, "d_eleventhxxxx", 10);
  assert.deepEqual([over.allowed, over.changed], [false, false]);
  const next = consumeBuild(meta, P2, "d_eleventhxxxx", 10);
  assert.deepEqual([next.allowed, next.used], [true, 1]);
  assert.equal(next.next.fpm_period, String(P2));
});

test("pro quota: metadata stays under Stripe's 500-char value limit", () => {
  let meta = {};
  for (let i = 0; i < 10; i++) meta = consumeBuild(meta, P1, `d_${i}${"z".repeat(39)}`, 10).next;
  assert.equal((meta as { fpm_drafts: string }).fpm_drafts.split(",").length, 10);
  assert.ok(((meta as { fpm_drafts: string }).fpm_drafts).length < 500);
  assert.equal(draftKey("d_abcdefghijklmnop"), "abcdefghijkl");
});
