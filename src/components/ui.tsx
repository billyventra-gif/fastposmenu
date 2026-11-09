"use client";

import { useEffect, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { PosTarget } from "@/lib/menu/schema";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "danger";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-[0_6px_20px_-6px_rgba(255,90,31,0.6)] hover:bg-brand-ink active:scale-[0.98]",
  secondary: "bg-surface text-ink ring-1 ring-line hover:ring-ink/20 active:scale-[0.98]",
  ghost: "text-ink hover:bg-ink/5",
  danger: "text-red-600 hover:bg-red-50",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4",
        size === "lg" && "h-14 px-6 text-[17px]",
        VARIANTS[variant],
        className,
      )}
    />
  );
}

const noop = () => () => {};
/** Render into <body> so fixed layers aren't trapped by animated/transformed parents. */
export function Portal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? createPortal(children, document.body) : null;
}

/** Fixed bottom action bar (safe-area aware). */
export function BottomBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Portal>
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/90 px-4 pt-3 backdrop-blur-md">
        <div className={cx("mx-auto", className)}>{children}</div>
      </div>
    </Portal>
  );
}

/** Bottom sheet on phones, right-side panel on tablet/desktop. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <Portal>
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={cx(
          "absolute flex flex-col bg-surface shadow-2xl",
          "inset-x-0 bottom-0 max-h-[92dvh] animate-sheet-up rounded-t-[28px]",
          "md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[460px] md:animate-sheet-left md:rounded-none md:rounded-l-[28px]",
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line md:hidden" />
        <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-3 md:pt-5">
          <h2 className="truncate text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
        {footer && <div className="pb-safe border-t border-line px-5 pt-3">{footer}</div>}
      </div>
    </div>
    </Portal>
  );
}

export function Stat({ value, label, tone = "default" }: { value: number | string; label: string; tone?: "default" | "warn" }) {
  return (
    <div className={cx("rounded-2xl px-3 py-2.5", tone === "warn" ? "bg-amber-100 text-amber-950" : "bg-surface ring-1 ring-line")}>
      <div className="text-xl font-bold tabular-nums leading-none">{value}</div>
      <div className={cx("mt-1 text-xs", tone === "warn" ? "text-amber-900" : "text-muted")}>{label}</div>
    </div>
  );
}

/** Neutral monogram tiles. We don't use POS vendors' logos. */
const POS_STYLE: Record<PosTarget, string> = {
  square: "bg-ink text-white",
  clover: "bg-emerald-600 text-white",
  toast: "bg-orange-500 text-white",
};
export function PosMark({ pos, className }: { pos: PosTarget; className?: string }) {
  return (
    <span className={cx("grid place-items-center rounded-2xl font-black uppercase", POS_STYLE[pos], className)} aria-hidden>
      {pos[0]}
    </span>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "h-12 w-full rounded-xl border-0 bg-bg px-3.5 ring-1 ring-line transition placeholder:text-muted/70 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand";
