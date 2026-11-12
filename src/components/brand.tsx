const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Brand mark: a menu card (three lines) with an accent tab. Works at 16–64px. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx("shrink-0", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0e0f11" />
      <rect x="8" y="9" width="12" height="2.6" rx="1.3" fill="#fff" />
      <rect x="8" y="14.7" width="16" height="2.6" rx="1.3" fill="#fff" opacity="0.85" />
      <rect x="8" y="20.4" width="9" height="2.6" rx="1.3" fill="#fff" opacity="0.7" />
      <circle cx="23.5" cy="10.3" r="2.6" fill="#ff5a1f" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("flex items-center gap-2", className)}>
      <Mark className="size-7" />
      <span className="font-[family-name:var(--ff-tight)] text-[17px] font-semibold tracking-[-0.02em]">
        Fast POS Menu
      </span>
    </span>
  );
}
