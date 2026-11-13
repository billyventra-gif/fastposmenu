import type { PosTarget } from "@/lib/menu/schema";

/**
 * Official POS logo files, from each company's brand/press kit. Never redraw them.
 * Drop the file in /public/logos/ and set the path here. Until then, every slot falls
 * back to plain text (wordmark) or a neutral letter tile (mark).
 *  - wordmark: horizontal logo, used in "exports to" strips and POS pages
 *  - mark: square icon, used in the app's POS picker
 */
export const POS_LOGOS: Record<PosTarget, { name: string; wordmark: string | null; mark: string | null }> = {
  square: { name: "Square", wordmark: null, mark: null },
  clover: { name: "Clover", wordmark: null, mark: null },
  toast: { name: "Toast", wordmark: null, mark: null },
};

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Horizontal logo, or the name in text. Height drives size. */
export function PosWordmark({ pos, className }: { pos: PosTarget; className?: string }) {
  const l = POS_LOGOS[pos];
  if (l.wordmark) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={l.wordmark} alt={l.name} className={cx("h-6 w-auto", className)} />;
  }
  return <span className={cx("font-display font-semibold tracking-[-0.02em]", className)}>{l.name}</span>;
}

/** Square icon, or a neutral letter tile. */
export function PosIcon({ pos, className }: { pos: PosTarget; className?: string }) {
  const l = POS_LOGOS[pos];
  if (l.mark) {
    return (
      <span className={cx("grid place-items-center overflow-hidden rounded-lg border border-line bg-white", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.mark} alt="" className="size-[70%] object-contain" />
      </span>
    );
  }
  return (
    <span className={cx("grid place-items-center rounded-lg bg-ink font-display font-semibold uppercase text-white", className)} aria-hidden>
      {pos[0]}
    </span>
  );
}
