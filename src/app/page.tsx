import Link from "next/link";

const STEPS = [
  ["Pick your POS", "Square, Clover, or Toast. More coming."],
  ["Drop in the menu", "Photos, PDF, spreadsheet, or an export from the old POS."],
  ["Fix what's off", "Low-confidence items are flagged. Edit on your phone."],
  ["Download the import file", "Formatted for that POS. Upload it and you're done."],
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Fast POS Menu</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
        Any restaurant menu, into any POS, in minutes.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600">
        Stop retyping menus. Upload what the restaurant has. Get a file the POS will import.
      </p>
      <Link
        href="/build"
        className="mt-8 inline-flex h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-dark"
      >
        Build a menu
      </Link>
      <ol className="mt-14 grid gap-4 sm:grid-cols-2">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="text-sm font-semibold text-brand">{i + 1}</span>
            <h2 className="mt-1 font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-14 text-xs text-neutral-500">A Code 85 Labs product.</p>
    </main>
  );
}
