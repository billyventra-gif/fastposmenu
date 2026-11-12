import type { Metadata } from "next";
import { PosLanding } from "@/components/marketing/PosLanding";
import { DEMO_TACOS } from "@/components/marketing/MenuDemo";

export const metadata: Metadata = {
  title: "Clover menu import from photos or PDF",
  description:
    "Turn menu photos, a PDF or an old-POS export into a Clover inventory workbook with items, categories, modifier groups and tax rates. $49 a menu.",
  alternates: { canonical: "/clover" },
};

export default function CloverPage() {
  return (
    <PosLanding
      pos="clover"
      name="Clover"
      h1={
        <>
          Build the Clover menu <span className="font-serif font-normal italic tracking-[-0.01em]">from the one they already have.</span>
        </>
      }
      sub="Photos, a PDF or the old POS's export in. A Clover inventory workbook out, with items, categories, modifier groups and tax rates filled in."
      demo={{ title: "RIVERBEND", rows: DEMO_TACOS }}
      files={[
        {
          title: "Clover inventory workbook (.xlsx)",
          body: "One file with the sheets Clover's inventory import reads: Items, Modifier Groups, Categories and Tax Rates. Upload it once and Clover creates all of them.",
        },
        {
          title: "Modifier groups with real rules",
          body: "Groups come with required and max quantities set (\"choose 1\", \"up to 3\"), so the POS prompts the way the menu reads.",
        },
      ]}
      handles={[
        "Sizes become a required Size modifier group, with the base price set to the smallest size. Items with the same sizes share one group.",
        "Items link to modifier groups and categories by exact name, with Clover's extra rows for items in more than one group.",
        "Category order follows the printed menu, so the register screen looks like the menu.",
        "Prices are cleaned up: \"$12.95\", \"12.95\" and \"MP\" (market price becomes a variable price).",
        "Tax hints are pulled from the menu (\"plus tax\", alcohol) for you to confirm.",
      ]}
      importSteps={[
        "Open the Clover web dashboard and go to Inventory → Items.",
        "Choose Import (in the ⋯ or Import/Export menu) and upload the .xlsx. Clover takes .xls or .xlsx up to 5 MB.",
        "Check the review screen's item and group counts, then confirm. Items show up on the devices right after.",
      ]}
      guide={{ href: "/guides/import-menu-into-clover", title: "Full guide: how to import a menu into Clover" }}
      faq={[
        [
          "Doesn't Clover have its own menu import?",
          "Clover has a spreadsheet import, and you still have to fill in the spreadsheet. That's the part we do. Clover has shown an AI photo import in Europe, but we haven't seen it in the US.",
        ],
        [
          "Will it overwrite the merchant's existing items?",
          "The workbook creates new items. For a new install that's what you want. On an account that already has items, import into a clean account or check for duplicates after.",
        ],
        [
          "Can I move a Square or Toast menu to Clover?",
          "Yes. Upload the old POS's export (or photos of the printed menu) and download a Clover workbook. That's the main reason resellers use it.",
        ],
        [
          "Is this a Clover product?",
          "No. Fast POS Menu is independent and isn't affiliated with or endorsed by Clover. We build a file in the format Clover's import reads.",
        ],
      ]}
    />
  );
}
