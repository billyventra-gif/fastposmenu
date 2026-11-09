"use client";

import { useState } from "react";
import { centsToDecimal, inputToCents } from "@/lib/menu/money";
import { cx } from "./ui";

/** Holds its own text; commits integer cents on blur. "MP" = market price (null). */
export default function PriceInput({
  cents,
  onCommit,
  allowMarket = true,
  label,
  className,
}: {
  cents: number | null;
  onCommit: (c: number | null) => void;
  allowMarket?: boolean;
  label: string;
  className?: string;
}) {
  const [text, setText] = useState(cents === null ? "MP" : centsToDecimal(cents));
  const [bad, setBad] = useState(false);
  return (
    <div className={cx("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
      <input
        aria-label={label}
        inputMode="decimal"
        value={text}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const c = inputToCents(text);
          if (c === undefined || (c === null && !allowMarket)) return setBad(true);
          setBad(false);
          setText(c === null ? "MP" : centsToDecimal(c));
          onCommit(c);
        }}
        className={cx(
          "h-12 w-full rounded-xl bg-bg pl-7 pr-3 text-right tabular-nums ring-1 transition focus:bg-surface focus:outline-none focus:ring-2",
          bad ? "ring-red-500 focus:ring-red-500" : "ring-line focus:ring-brand",
        )}
      />
    </div>
  );
}
