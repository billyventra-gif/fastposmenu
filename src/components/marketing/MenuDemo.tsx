import Image from "next/image";
import { ArrowRight } from "lucide-react";
import menuPhoto from "../../../public/product/menu-photo.png";

/** "Paper menu → import file" visual. Sample data only (made-up restaurants). */

export type DemoRow = { name: string; price: string; tag: string };

export const DEMO_TACOS: DemoRow[] = [
  { name: "Street Tacos (3)", price: "11.50", tag: "Protein · choose 1" },
  { name: "Classic Burrito", price: "12.75", tag: "Protein · Add-ons" },
  { name: "Chips & Salsa", price: "3.50 / 6.00", tag: "Sm · Lg" },
  { name: "Horchata", price: "3.75 / 4.95", tag: "16oz · 24oz" },
  { name: "House Margarita", price: "10.00", tag: "Flavors · up to 2" },
];

export const DEMO_PIZZA: DemoRow[] = [
  { name: "Cheese", price: "14 / 18 / 22", tag: "12in · 16in · 20in" },
  { name: "Build Your Own", price: "16.00", tag: "Toppings · up to 6" },
  { name: "Garlic Knots (6)", price: "6.50", tag: "Dip · choose 1" },
  { name: "Caesar Salad", price: "9.00", tag: "Add protein" },
  { name: "Fountain Drink", price: "2.50 / 3.25", tag: "Reg · Lg" },
];

export const DEMO_CAFE: DemoRow[] = [
  { name: "Latte", price: "4.75 / 5.50", tag: "12oz · 16oz · Milk" },
  { name: "Cold Brew", price: "4.50", tag: "Sweetener · up to 2" },
  { name: "Breakfast Burrito", price: "9.25", tag: "Protein · choose 1" },
  { name: "Avocado Toast", price: "10.50", tag: "Add egg +2.00" },
  { name: "Blueberry Muffin", price: "3.75", tag: "Warm it?" },
];

export function MenuDemo({ title, label, rows }: { title: string; label: string; rows: DemoRow[] }) {
  const file = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}_${label.toLowerCase().split(" ")[0]}.xlsx`;
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none" aria-hidden>
      <div className="relative grid grid-cols-[0.72fr_1fr] items-center gap-3 sm:gap-5">
        {/* Before: the paper menu */}
        <figure className="relative">
          <div className="-rotate-2 overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-20px_rgba(0,0,0,0.25)]">
            <Image src={menuPhoto} alt="" className="aspect-[3/4] w-full rounded-[4px] object-cover object-top" sizes="(max-width: 640px) 40vw, 260px" priority />
          </div>
          <figcaption className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">menu-photo.jpg</figcaption>
          <span className="absolute -right-3 top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface sm:-right-4 sm:size-8">
            <ArrowRight className="size-3.5" />
          </span>
        </figure>

        {/* After: the import file */}
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-bg px-3 py-2.5 sm:px-4">
            <span className="truncate font-mono text-[10.5px] text-muted">{file}</span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Ready
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 border-b border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-muted sm:px-4">
            <span>Item · modifiers</span>
            <span>Price</span>
          </div>
          <ul>
            {rows.map((d, i) => (
              <li
                key={d.name}
                className="grid animate-rise grid-cols-[1fr_auto] items-baseline gap-x-3 border-b border-line/70 px-3 py-2 last:border-0 sm:px-4 sm:py-2.5"
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium sm:text-[13.5px]">{d.name}</span>
                  <span className="block truncate text-[11px] text-muted">{d.tag}</span>
                </span>
                <span className="font-mono text-[11.5px] tabular-nums sm:text-[12.5px]">{d.price}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line bg-bg px-3 py-2 font-mono text-[10px] text-muted sm:px-4">{label}</div>
        </div>
      </div>
    </div>
  );
}
