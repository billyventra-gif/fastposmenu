import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("toast-menu-bulk-import");

export const metadata: Metadata = {
  title: "How to upload a menu to Toast (bulk import guide)",
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
            Toast&apos;s self-serve route is the <strong>bulk import tool</strong> in Toast Web (Menus → Bulk management). It&apos;s only on some Toast
            packages and the multi-location module.
          </li>
          <li>The file is a list of operations (CREATE, ATTACH), not one row per item, and it points at menu groups by their Toast IDs.</li>
          <li>Toast says bulk imports can&apos;t be undone. Without the tool, it&apos;s Toast&apos;s menu-build service (billed hourly) or keying it in.</li>
        </ul>
      }
      cta={{ title: "Get the Toast files built for you.", sub: "Bulk-import sheet plus a menu-build workbook. $49.", label: "Build a Toast menu" }}
    >
      <p>
        Getting a menu into Toast is different from Square or Clover. There&apos;s no general spreadsheet upload for every account, and Toast
        doesn&apos;t let outside apps write menus through its API. Your options are the bulk import tool (if the account has it), Toast&apos;s own
        menu-build service, or typing it into Toast Web.
      </p>

      <h2>Option 1: The bulk import tool</h2>
      <h3>Who has it</h3>
      <p>
        Toast lists the tool for accounts on its higher restaurant-management packages or with the multi-location module. Check under{" "}
        <strong>Menus → Bulk management → Bulk import tool</strong> in Toast Web. If it isn&apos;t there, skip to option 2.
      </p>

      <h3>How the file works</h3>
      <p>
        Toast gives you template spreadsheets (basic, item update and advanced) to copy, fill in, and download as CSV. Each row is an
        <strong> operation</strong>:
      </p>
      <ul>
        <li>
          <strong>Operation</strong>: CREATE a new thing, or ATTACH an existing thing to a parent.
        </li>
        <li>
          <strong>Entity type</strong>: menu item, modifier group or modifier.
        </li>
        <li>
          <strong>Operation ID</strong>: a unique number for the row (1, 2, 3…) so other rows can point at it.
        </li>
        <li>
          <strong>Name</strong>, <strong>pricing strategy</strong> and <strong>price</strong>.
        </li>
        <li>
          <strong>Parent</strong>: either the Toast ID of something that already exists (like a menu group) or the operation ID of a row in the same
          file.
        </li>
      </ul>
      <p>
        So a burrito with a &quot;choose a protein&quot; group is several rows: CREATE the item under a menu group, CREATE the modifier group under the
        item&apos;s row, CREATE each protein under the group&apos;s row.
      </p>

      <h3>Step by step</h3>
      <ol>
        <li>
          In Toast Web, create the menu and its menu groups (Tacos, Burritos, Drinks…). The tool attaches items to groups that already exist.
        </li>
        <li>Copy each menu group&apos;s ID from Toast Web into the parent column for that group&apos;s items.</li>
        <li>Fill in the item, modifier group and modifier rows.</li>
        <li>
          Download as CSV and upload it in the <strong>Bulk import tool</strong>.
        </li>
        <li>If some rows fail, fix only those rows and re-import them. Toast warns that editing rows that already imported makes the re-import fail.</li>
        <li>
          Set anything the tool can&apos;t (see below) in Toast Web, then <strong>save and publish</strong> so it reaches the devices.
        </li>
      </ol>

      <h3>What the tool doesn&apos;t do</h3>
      <ul>
        <li>
          <strong>Min/max rules:</strong> Toast&apos;s docs say groups created by the tool start as required, choose one. &quot;Up to 3 toppings&quot;
          needs editing after.
        </li>
        <li>
          <strong>Sizes:</strong> items import at one base price, so per-size prices go in a size modifier group priced by modifier.
        </li>
        <li>
          <strong>Taxes and price levels</strong> are set in Toast Web.
        </li>
        <li>
          <strong>No undo.</strong> Try one menu group first.
        </li>
      </ul>

      <h2>Option 2: Toast&apos;s menu-build service</h2>
      <p>
        New Toast customers get a menu built during onboarding, either from a template or as a paid &quot;full menu build.&quot; Toast lists
        menu-expert hours at about $150 an hour. A clean, organized menu document shortens that work, whoever does it.
      </p>

      <h2>Option 3: Key it into Toast Web</h2>
      <p>
        Fine for a 30-item cafe. For a full restaurant menu with modifiers, operators commonly report a day or more. Work from an organized sheet
        (menu → group → item → modifier group → modifier) so you aren&apos;t flipping through a paper menu.
      </p>

      <h2>The fast way</h2>
      <p>
        Upload photos, a PDF or another POS&apos;s export to <Link href="/toast">Fast POS Menu</Link>. You get one workbook with both:
      </p>
      <ul>
        <li>
          <strong>A bulk-import sheet</strong> with the operation rows, operation IDs and parent links filled in, sizes set up as a size group, and a
          marked spot for each menu group&apos;s Toast ID.
        </li>
        <li>
          <strong>A menu-build workbook</strong> in Toast&apos;s own structure, with each group&apos;s required/min/max written down, for the onboarding
          team or for keying.
        </li>
      </ul>
      <Callout>
        <p>
          Moving the merchant <em>off</em> Toast? See <Link href="/guides/toast-to-square-menu">Toast to Square without retyping</Link>.
        </p>
      </Callout>
    </GuideLayout>
  );
}
