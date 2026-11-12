import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("switch-pos-without-retyping-menu");

export const metadata: Metadata = {
  title: "Switching POS? How to move your menu without retyping · Fast POS Menu",
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
          <li>Before you cancel the old POS, export the menu and take photos of the printed menu and register screens.</li>
          <li>POS systems don&apos;t import each other&apos;s files. Something has to translate sizes, modifiers and categories into the new format.</li>
          <li>Do that translation with a tool instead of by hand, review it, import, and test-ring before go-live.</li>
        </ul>
      }
      cta={{ title: "Switching POS? Bring the menu with you.", sub: "Old menu in. New POS import file out. $49.", label: "Build a menu" }}
    >
      <p>
        Ask a restaurant owner what they dread about switching POS and the answer is rarely the hardware or the fees. It&apos;s{" "}
        <strong>rebuilding the menu</strong>. 150 items, sizes, add-ons, combos, the &quot;no onion&quot; buttons. It&apos;s also where agents watch
        signed deals stall.
      </p>
      <p>Here&apos;s a checklist that works whether you&apos;re the owner or the agent doing the install.</p>

      <h2>Before you cancel the old POS</h2>
      <ol>
        <li>
          <strong>Export the menu</strong> from the old POS back office if it offers one (most do: items, categories, sometimes modifiers).
        </li>
        <li>
          <strong>Photograph the register screens</strong>, including each modifier screen. These catch the add-ons that aren&apos;t on the printed
          menu.
        </li>
        <li>
          <strong>Grab the printed menu or PDF</strong>, and screenshots of the online ordering page if they have one.
        </li>
        <li>
          <strong>Write down taxes</strong> (rates, what&apos;s taxed differently) and <strong>kitchen printer routing</strong>.
        </li>
        <li>
          <strong>Pull sales by item</strong> for the last 90 days. It tells you which items actually matter, and which dead items to leave behind.
        </li>
      </ol>

      <h2>Translate, don&apos;t copy</h2>
      <p>Every POS models a menu a little differently. The big three differences:</p>
      <ul>
        <li>
          <strong>Sizes.</strong> Square prefers variations. Clover restaurants usually use a required Size modifier group. Toast often uses a size
          modifier group priced by modifier.
        </li>
        <li>
          <strong>Modifier rules.</strong> &quot;Choose 1&quot;, &quot;up to 3&quot;, &quot;optional&quot; are set in different places, and some
          import files can&apos;t set them at all (Square&apos;s sheet can&apos;t create modifier sets; Toast&apos;s bulk tool defaults groups to
          required, choose one).
        </li>
        <li>
          <strong>How things link.</strong> Clover links by exact name. Toast links by IDs. Square groups rows by item name.
        </li>
      </ul>
      <p>Per-POS detail:</p>
      <ul>
        <li>
          <Link href="/guides/import-menu-into-clover">How to import a menu into Clover</Link>
        </li>
        <li>
          <Link href="/guides/square-item-library-import">How to import a menu into Square</Link>
        </li>
        <li>
          <Link href="/guides/toast-menu-bulk-import">How to upload a menu to Toast</Link>
        </li>
      </ul>

      <h2>Import, then test like a server</h2>
      <ul>
        <li>Counts match: items, categories, modifier groups.</li>
        <li>Spot-check prices on 10 items, every size on at least one.</li>
        <li>Ring one order per required modifier group. Does it prompt? Can you pick more than you should?</li>
        <li>Check taxes on food, alcohol and anything tax-exempt.</li>
        <li>Send a test ticket to every kitchen printer.</li>
      </ul>

      <h2>What about delivery app menus?</h2>
      <p>
        If the cleanest copy of the menu is on DoorDash, Uber Eats or Grubhub, take screenshots and use those. Those sites don&apos;t allow automated
        scraping, so we don&apos;t pull from links, and we&apos;d steer you away from tools that do.
      </p>

      <h2>The fast way</h2>
      <p>
        <Link href="/">Fast POS Menu</Link> takes whatever you collected above (the export, photos, the PDF, all at once) and builds the menu in the new
        POS&apos;s format: Square, Clover or Toast. It handles the size and modifier translation, flags anything it isn&apos;t sure about for you to
        check on your phone, and gives you the import file. Most menus take minutes.
      </p>
      <Callout>
        <p>
          <strong>Agents:</strong> do the switch in the meeting. <Link href="/for-isos">Here&apos;s how ISOs and agents use it</Link>.
        </p>
      </Callout>
    </GuideLayout>
  );
}
