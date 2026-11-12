import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("square-item-library-import");

export const metadata: Metadata = {
  title: "Square item library import: CSV guide with modifiers · Fast POS Menu",
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
          <li>
            Square imports items from an .xlsx or .csv in the Dashboard: Items &amp; services → Items → Actions → Import library.
          </li>
          <li>Each row is one variation (size). Rows with the same item name become one item.</li>
          <li>
            The sheet can switch modifier sets on, but <strong>can&apos;t create them</strong>. Create the sets first, with the exact names, then import.
          </li>
        </ul>
      }
      cta={{ title: "Get the Square file built for you.", sub: "Item library sheet plus your modifier set checklist. $49.", label: "Build a Square menu" }}
    >
      <p>
        Square&apos;s item library import is solid for retail-style catalogs. Restaurant menus are harder, because most of what makes a menu a menu
        (sizes, add-ons, &quot;choose one&quot;) lives in variations and modifier sets. Here&apos;s how the sheet is laid out and the order that avoids a
        re-do.
      </p>

      <h2>Step 1: Get the template from the account</h2>
      <p>
        In the Square Dashboard go to <strong>Items &amp; services → Items → Actions → Import library</strong> and download the template, or export
        the current library. Square says not to reorder, rename or delete columns, and the exact columns vary by account (locations, features, template
        version). So always start from the target account&apos;s own file. Square recommends the .xlsx version.
      </p>

      <h2>Step 2: One row per variation</h2>
      <p>
        Square groups rows into items by <strong>Item Name</strong>. A drink with two sizes is two rows with the same Item Name and different{" "}
        <strong>Variation Name</strong> values:
      </p>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Variation Name</th>
            <th>Price</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Latte</td>
            <td>12oz</td>
            <td>4.75</td>
            <td>Coffee</td>
          </tr>
          <tr>
            <td>Latte</td>
            <td>16oz</td>
            <td>5.50</td>
            <td>Coffee</td>
          </tr>
          <tr>
            <td>Cold Brew</td>
            <td>Regular</td>
            <td>4.50</td>
            <td>Coffee</td>
          </tr>
        </tbody>
      </table>
      <ul>
        <li>Single-price items still need a variation name. &quot;Regular&quot; is the convention.</li>
        <li>Prices are plain dollars, no $ sign. Use Variable (or leave blank) for market price.</li>
        <li>Item-level fields like description and category must match on every row of the same item.</li>
        <li>Leave the Token column blank for new items. Square fills it in.</li>
      </ul>

      <h2>Step 3: Create modifier sets before you import</h2>
      <p>
        This is the part that catches people. The sheet has a <code>Modifier Set - Name</code> column for each modifier set in the account, and you put
        Y or N to switch it on for an item. But the import <strong>can&apos;t create a modifier set</strong>, its options, prices, or the min/max rules.
        If the set doesn&apos;t exist, there&apos;s no column for it.
      </p>
      <ol>
        <li>
          List every modifier set on the menu: name, options, option prices, and the rule (&quot;choose 1&quot;, &quot;up to 3&quot;).
        </li>
        <li>
          Create each one in <strong>Items → Modifiers</strong> with the exact name.
        </li>
        <li>Download a fresh template. The new sets now appear as columns.</li>
        <li>Mark Y for each item that uses each set.</li>
      </ol>
      <p>
        Taxes work the same way: a <code>Tax - Name (rate%)</code> column per tax that exists in the account. Keep the header exactly as Square writes it.
      </p>

      <h2>Step 4: Import</h2>
      <p>
        Back in <strong>Actions → Import library</strong>, upload the file and pick <strong>Modify library</strong> (add/update) or{" "}
        <strong>Replace library</strong> (fresh account). Square previews the changes and keeps the good rows if some fail, with an error report you can
        download.
      </p>

      <h2>Gotchas</h2>
      <ul>
        <li>
          <strong>Two different items with the same name merge</strong> into one item with extra variations. Make names unique (&quot;Burrito -
          Breakfast&quot;).
        </li>
        <li>
          <strong>Don&apos;t open a CSV with SKUs directly</strong> in a spreadsheet app. It can strip leading zeros. Import it as text, or use .xlsx.
        </li>
        <li>
          <strong>Nested modifiers</strong> have to be set up in the Dashboard after import.
        </li>
        <li>No images in the sheet. Add photos in the Dashboard.</li>
      </ul>

      <h2>What about Square&apos;s free menu upload?</h2>
      <p>
        Square also offers to build a menu from a photo, PDF or URL. It only builds Square menus, and Square says most builds take under 24 hours. If
        that works for you, use it. If you need it in minutes, want to check it yourself first, or you&apos;re moving the menu to or from another POS,
        that&apos;s what we built.
      </p>

      <h2>The fast way</h2>
      <p>
        Upload menu photos, a PDF, a spreadsheet or another POS&apos;s export to <Link href="/square">Fast POS Menu</Link>. It builds the variations and
        modifier sets, then gives you two things: the item library sheet, and a checklist of exactly which modifier sets to create first (names,
        options, prices, min/max). Create the sets, import the sheet, done.
      </p>
      <Callout>
        <p>
          Moving a merchant <em>onto</em> Square from Toast? Read <Link href="/guides/toast-to-square-menu">Toast to Square without retyping</Link>.
        </p>
      </Callout>
    </GuideLayout>
  );
}
