/** Guide registry: drives the /guides hub, related links and article metadata. Copy owned by marketing. */

export type GuideMeta = {
  slug: string;
  title: string;
  /** Short card title for the hub. */
  short: string;
  description: string;
  updated: string; // ISO date
  readMins: number;
  tag: "Clover" | "Square" | "Toast" | "Switching POS" | "For ISOs";
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "import-menu-into-clover",
    title: "How to import a menu into Clover",
    short: "Import a menu into Clover",
    description: "Clover's import workbook, sheet by sheet: items, modifier groups, categories and tax rates. Plus the fast way.",
    updated: "2026-11-12",
    readMins: 7,
    tag: "Clover",
  },
  {
    slug: "square-item-library-import",
    title: "How to import a menu into Square's item library",
    short: "Square item library import",
    description: "How Square's item import sheet works, why it can't create modifier sets, and how to get a full menu in fast.",
    updated: "2026-11-12",
    readMins: 7,
    tag: "Square",
  },
  {
    slug: "toast-menu-bulk-import",
    title: "How to upload a menu to Toast",
    short: "Upload a menu to Toast",
    description: "Toast's bulk import tool explained: who can use it, operation rows, group IDs, and what to set in Toast Web after.",
    updated: "2026-11-12",
    readMins: 8,
    tag: "Toast",
  },
  {
    slug: "toast-to-square-menu",
    title: "Moving a restaurant from Toast to Square without retyping the menu",
    short: "Toast to Square, without retyping",
    description: "Export or photograph the Toast menu, rebuild it as a Square import file, and go live without a weekend of data entry.",
    updated: "2026-11-12",
    readMins: 6,
    tag: "Switching POS",
  },
  {
    slug: "switch-pos-without-retyping-menu",
    title: "Switching POS without retyping the menu",
    short: "Switch POS without retyping",
    description: "The menu is the hardest part of switching POS. A checklist for owners and agents, and how to do it in minutes.",
    updated: "2026-11-12",
    readMins: 6,
    tag: "Switching POS",
  },
  {
    slug: "menu-builds-restaurant-boarding",
    title: "The menu build is the slowest step in restaurant boarding",
    short: "Menu builds slow down boarding",
    description: "For ISOs and agents: what menu builds cost your shop in hours and go-live time, and how to take them off the critical path.",
    updated: "2026-11-12",
    readMins: 5,
    tag: "For ISOs",
  },
];

export function getGuide(slug: string): GuideMeta {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`Unknown guide: ${slug}`);
  return g;
}
