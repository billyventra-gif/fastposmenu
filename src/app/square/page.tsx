import type { Metadata } from "next";
import { PosLanding } from "@/components/marketing/PosLanding";
import { DEMO_CAFE } from "@/components/marketing/MenuDemo";

export const metadata: Metadata = {
  title: "Square menu import from photos or PDF",
  description:
    "Turn any menu into a Square item library import file, plus the exact modifier sets to create first. Minutes, not a day. Works for moving off other POS too.",
  alternates: { canonical: "/square" },
};

export default function SquarePage() {
  return (
    <PosLanding
      pos="square"
      name="Square"
      h1={
        <>
          A Square item library <span className="font-serif font-normal italic tracking-[-0.01em]">in minutes, not a day.</span>
        </>
      }
      sub="Photos, a PDF or another POS's export in. A Square item library import file out, with sizes as variations and modifier sets mapped."
      demo={{ title: "DAYBREAK CAFE", rows: DEMO_CAFE }}
      files={[
        {
          title: "Item library spreadsheet (.xlsx)",
          body: "Laid out like Square's item import: one row per variation, categories filled in, and modifier sets and taxes switched on per item.",
        },
        {
          title: "Your modifier set checklist",
          body: "Square's spreadsheet can link modifier sets but can't create them. We list every set, its options and prices, so you create them first and the import links them.",
        },
      ]}
      handles={[
        "Sizes become variations (Small / Large, 12oz / 16oz) on one item, the way Square expects.",
        "Modifier set names match exactly between the checklist and the item rows, so nothing imports unlinked.",
        "Prices are written as plain dollars; market price becomes a variable price.",
        "Categories follow the printed menu.",
        "Tax hints are pulled from the menu for you to confirm.",
      ]}
      importSteps={[
        "Create the modifier sets from your checklist in Items → Modifiers (exact names).",
        "Go to Items & services → Items → Actions → Import library and upload the .xlsx.",
        "Choose Modify library for an account with items already, or Replace for a fresh one. Square shows a preview first.",
      ]}
      guide={{ href: "/guides/square-item-library-import", title: "Full guide: Square item library import" }}
      faq={[
        [
          "Square has a free menu upload. Why use this?",
          "Square's upload only builds Square menus and says most builds take up to a day. This takes minutes, and you review it yourself. It also works when you're moving a merchant from Square to Clover or Toast.",
        ],
        [
          "Why can't the file create modifier sets?",
          "That's a limit of Square's spreadsheet import, not ours. It can only switch on sets that already exist. We give you the list so creating them takes a few minutes.",
        ],
        [
          "Can I move a Toast or Clover menu to Square?",
          "Yes. Upload the old POS's export or photos of the menu. See our guide on moving from Toast to Square.",
        ],
        [
          "Is this a Square product?",
          "No. Fast POS Menu is independent and isn't affiliated with or endorsed by Square. We build a file in the format Square's item import reads.",
        ],
      ]}
    />
  );
}
