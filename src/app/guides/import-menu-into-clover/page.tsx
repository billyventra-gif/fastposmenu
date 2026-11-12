import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("import-menu-into-clover");

export const metadata: Metadata = {
  title: "How to import a menu into Clover (2026 guide) · Fast POS Menu",
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
  openGraph: { type: "article", title: guide.title, description: guide.description },
};

export default function Page() {
  return (
    <GuideLayout
      guide={guide}
      tldr={
        <ul>
          <li>Clover imports a whole menu from one Excel workbook (.xls or .xlsx, up to 5 MB) in the web dashboard under Inventory.</li>
          <li>The workbook has separate sheets for Items, Modifier Groups, Categories and Tax Rates. Items link to groups and categories by exact name.</li>
          <li>Filling it in by hand is the slow part. You can upload menu photos or a PDF to Fast POS Menu and download the finished workbook instead.</li>
        </ul>
      }
      cta={{ title: "Get the Clover workbook built for you.", sub: "Photos or PDF in. Clover inventory workbook out. $49.", label: "Build a Clover menu" }}
    >
      <p>
        Clover doesn&apos;t make you add items one at a time. Its web dashboard has a bulk import that reads an Excel workbook and creates items,
        modifier groups, categories and tax rates in one go. The catch: you have to build that workbook, and on a 150-item menu with sizes and add-ons,
        that&apos;s an afternoon or more.
      </p>
      <p>Here&apos;s how the import works, sheet by sheet, and what trips people up.</p>

      <h2>Step 1: Download Clover&apos;s template</h2>
      <p>
        In the Clover web dashboard, go to <strong>Inventory → Items</strong> and open the import/export options. Download the template, or export the
        current inventory if the account already has items. Starting from Clover&apos;s own file is the safest way to get the exact sheet and column
        names the account expects. The template has an instructions tab that explains each field.
      </p>

      <h2>Step 2: Fill in the sheets</h2>
      <h3>Items</h3>
      <p>One row per item. The columns that matter for a restaurant menu:</p>
      <ul>
        <li>
          <strong>Name</strong> and <strong>Price</strong> (dollars). Leave Price blank and set <strong>Price Type</strong> to Variable for market
          price items.
        </li>
        <li>
          <strong>Modifier Groups</strong>: the exact name of a group on the Modifier Groups sheet.
        </li>
        <li>
          <strong>Categories</strong>: the exact name of a category.
        </li>
        <li>
          <strong>Tax Rates</strong> or <strong>Default tax rates?</strong>, and <strong>Printer Labels</strong> if you route items to kitchen
          printers.
        </li>
        <li>
          Leave <strong>Clover ID</strong> blank for new items. Clover assigns it.
        </li>
      </ul>
      <p>
        <strong>Items in more than one group or category</strong> use extra rows: the first group goes on the item&apos;s row, and each additional
        group or category goes on the row below with everything else left blank. This is the most common thing people get wrong.
      </p>

      <h3>Modifier Groups</h3>
      <p>
        One group per block of rows. The group name, <strong>Pop up Automatically?</strong>, <strong>Required Quantity</strong> (minimum) and{" "}
        <strong>Max Quantity</strong> go on the first row; each modifier and its price goes on its own row below. &quot;Choose a protein&quot; is
        required quantity 1, max 1. &quot;Add up to 3 toppings&quot; is required 0, max 3.
      </p>

      <h3>Categories</h3>
      <p>
        Category names, with the item names listed under each one in the order you want them on the register. The order here is the order servers see.
      </p>

      <h3>Tax Rates</h3>
      <p>Name, rate (percent) and whether it&apos;s the default. Most single-location restaurants need one default rate and maybe an alcohol rate.</p>

      <h2>Step 3: Handle sizes</h2>
      <p>
        Clover has two ways to do sizes. For restaurants, the usual one is a required <strong>Size</strong> modifier group: set the item price to the
        smallest size and make the larger sizes upcharges. Small $3.50 / Large $6.00 becomes a $3.50 item with a required Size group: Small +$0.00,
        Large +$2.50. Items with identical sizes can share one group.
      </p>

      <h2>Step 4: Import and check</h2>
      <ol>
        <li>Close the workbook on your computer (an open file can fail to upload).</li>
        <li>
          Back in <strong>Inventory → Items</strong>, choose Import and upload the file.
        </li>
        <li>Check the item, group and category counts on the review screen against your menu before you confirm.</li>
        <li>Open the register and ring up a test order with modifiers to make sure the prompts behave.</li>
      </ol>

      <h2>Gotchas</h2>
      <ul>
        <li>
          <strong>Names must match exactly</strong> across sheets. &quot;Protein&quot; and &quot;Proteins&quot; are two different groups.
        </li>
        <li>
          <strong>Format SKU and product code columns as text</strong> so leading zeros survive.
        </li>
        <li>
          <strong>5 MB limit.</strong> Plenty for a menu, but don&apos;t paste images into the sheet.
        </li>
        <li>
          <strong>Re-importing</strong> an edited export updates items that keep their Clover ID. Test on one item before you re-import a whole menu
          into a live account.
        </li>
      </ul>

      <h2>The fast way</h2>
      <p>
        The import itself takes a minute. Building the workbook is the job. <Link href="/clover">Fast POS Menu</Link> does that part: upload photos of
        the printed menu, a PDF, a spreadsheet or another POS&apos;s export, and it builds the items, sizes (as Size groups), modifier groups with
        required and max quantities, and categories. You fix anything it flags on your phone, then download the Clover workbook and import it as
        above.
      </p>
      <Callout>
        <p>
          <strong>For agents and installers:</strong> this is the step that holds up go-lives. See{" "}
          <Link href="/for-isos">how ISOs and agents use Fast POS Menu</Link> during boarding.
        </p>
      </Callout>
    </GuideLayout>
  );
}
