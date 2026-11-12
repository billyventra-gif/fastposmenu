import type { Metadata } from "next";
import { PosLanding } from "@/components/marketing/PosLanding";
import { DEMO_PIZZA } from "@/components/marketing/MenuDemo";

export const metadata: Metadata = {
  title: "Toast menu upload without the build hours",
  description:
    "Turn menu photos or a PDF into a Toast bulk-import sheet and a menu-build workbook. Minutes, not menu-expert hours. $49 a menu.",
  alternates: { canonical: "/toast" },
};

export default function ToastPage() {
  return (
    <PosLanding
      pos="toast"
      name="Toast"
      h1={
        <>
          A Toast menu build <span className="text-brand">without the hourly bill.</span>
        </>
      }
      sub="Toast lists menu-expert hours at about $150 an hour. Snap the menu instead and get a Toast-ready build in minutes."
      demo={{ title: "NORTHSIDE PIZZA", rows: DEMO_PIZZA }}
      files={[
        {
          title: "Bulk-import sheet",
          body: "Shaped like Toast Web's bulk import: CREATE and ATTACH rows for items, modifier groups and modifiers. For Toast accounts that have the bulk import tool.",
        },
        {
          title: "Menu-build workbook",
          body: "The same menu laid out the way Toast is organized (menu, group, item, modifier group, modifier). Hand it to the onboarding team or key from it. Works on every Toast package.",
        },
      ]}
      handles={[
        "Sizes become a size modifier group priced by modifier, since the bulk tool prices items at a single base price.",
        "Operation IDs and parent links are filled in, so modifiers attach to the right groups and items.",
        "Menu groups are marked where you paste the group IDs from Toast Web, one per group.",
        "Prices are written as plain numbers, the way the bulk tool expects.",
        "Required and multi-select rules are written down so you can set them in Toast Web after import.",
      ]}
      importSteps={[
        "In Toast Web, create the menu and its menu groups, then copy each group's ID onto the bulk-import sheet.",
        "Save that sheet as CSV and upload it in Menus → Bulk management → Bulk import tool.",
        "Set any min/max rules the sheet calls out, then save and publish to push it to the devices.",
      ]}
      guide={{ href: "/guides/toast-menu-bulk-import", title: "Full guide: how to upload a menu to Toast" }}
      faq={[
        [
          "Does every Toast account have the bulk import tool?",
          "No. Toast limits it to certain packages (and the multi-location module). If yours doesn't have it, use the menu-build workbook: it's the whole menu, organized the way Toast is, ready for the onboarding team or for keying.",
        ],
        [
          "Can you push the menu straight into Toast?",
          "No. Toast doesn't offer a public way for outside tools to write menus. That's why we produce files, not a sync.",
        ],
        [
          "Is the bulk import reversible?",
          "Toast says bulk imports can't be undone. Review the menu in our app first, and test with a single group if you're unsure.",
        ],
        [
          "Is this a Toast product?",
          "No. Fast POS Menu is independent and isn't affiliated with or endorsed by Toast. We build files that follow Toast's menu structure and bulk-import layout.",
        ],
      ]}
    />
  );
}
