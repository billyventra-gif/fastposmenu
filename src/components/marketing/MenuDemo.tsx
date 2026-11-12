/** Animated "paper menu → import file" visual. Sample data only (made-up restaurants). */

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
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -inset-6 -z-10 rounded-[48px] bg-gradient-to-br from-brand/20 via-brand-soft to-transparent blur-2xl" />
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-3 sm:gap-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#fffaf0] p-4 shadow-xl ring-1 ring-line">
          <p className="text-center font-serif text-[11px] font-bold tracking-widest">{title}</p>
          <div className="mt-3 space-y-2.5">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="h-1.5 rounded-full bg-ink/25" style={{ width: `${40 + ((i * 29) % 45)}%` }} />
                <span className="h-1.5 w-5 rounded-full bg-ink/30" />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 h-12 animate-scan bg-gradient-to-b from-transparent via-brand/25 to-transparent">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand shadow-[0_0_10px_2px_rgba(255,90,31,0.6)]" />
          </div>
        </div>
        <div className="rounded-3xl bg-surface p-3 shadow-xl ring-1 ring-line sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">READY</span>
          </div>
          <ul className="space-y-1.5">
            {rows.map((d, i) => (
              <li key={d.name} className="animate-rise rounded-xl bg-bg px-2.5 py-2" style={{ animationDelay: `${300 + i * 180}ms` }}>
                <div className="flex items-center justify-between gap-2 text-[13px] font-semibold">
                  <span className="truncate">{d.name}</span>
                  <span className="shrink-0 tabular-nums">{d.price}</span>
                </div>
                <div className="text-[11px] text-muted">{d.tag}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
