import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("toast-to-square-menu");

export const metadata: Metadata = {
  title: "Move a menu from Toast to Square without retyping · Fast POS Menu",
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
          <li>Get the menu out of Toast: a menu export from Toast Web if you have access, or clear photos/screenshots of the menu.</li>
          <li>Rebuild it as a Square item library file: sizes become variations, modifier groups become modifier sets.</li>
          <li>Create the modifier sets in Square first, then import the item sheet. With Fast POS Menu, steps 1 to 3 take minutes.</li>
        </ul>
      }
      cta={{ title: "Move the menu, not the keyboard.", sub: "Toast export or photos in. Square import file out. $49.", label: "Build a Square menu" }}
    >
      <p>
        When a restaurant moves from Toast to Square, the menu is the job nobody wants. Toast and Square don&apos;t share a format, neither will import
        the other&apos;s file, and a full menu with sizes and add-ons is a long day of typing. You don&apos;t have to retype it.
      </p>

      <h2>Step 1: Get the menu out of Toast</h2>
      <p>Pick whichever of these you can get:</p>
      <ul>
        <li>
          <strong>A Toast menu export.</strong> Toast Web can export menu data to CSV. It&apos;s the cleanest source because names and prices are
          already exact. Ask the owner to pull it before the Toast account is closed.
        </li>
        <li>
          <strong>The printed or PDF menu.</strong> Usually close to the POS, but check for items that are only on the register (add-ons, &quot;open
          food&quot;, staff items).
        </li>
        <li>
          <strong>Photos of the register screens.</strong> Not pretty, but it catches modifiers that aren&apos;t on the printed menu.
        </li>
        <li>
          <strong>Screenshots of the restaurant&apos;s online ordering page.</strong> Good for modifier detail. Screenshot it; don&apos;t rely on
          link-import tools that scrape delivery apps.
        </li>
      </ul>
      <p>
        Do this <strong>before</strong> the Toast contract ends. Once the account is closed, the export is gone.
      </p>

      <h2>Step 2: Translate Toast&apos;s structure to Square&apos;s</h2>
      <table>
        <thead>
          <tr>
            <th>In Toast</th>
            <th>In Square</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Menu group</td>
            <td>Category</td>
          </tr>
          <tr>
            <td>Menu item</td>
            <td>Item</td>
          </tr>
          <tr>
            <td>Size (size pricing or a size modifier group)</td>
            <td>Variations on the item (one row each)</td>
          </tr>
          <tr>
            <td>Modifier group (required, min/max)</td>
            <td>Modifier set (min/max set in Square)</td>
          </tr>
          <tr>
            <td>Open price / market price</td>
            <td>Variable price</td>
          </tr>
        </tbody>
      </table>
      <p>
        The one that bites: in Toast, sizes are often a modifier group. In Square they should usually be <strong>variations</strong>, so reporting and
        inventory work per size. Convert them, don&apos;t copy them as modifiers.
      </p>

      <h2>Step 3: Build the Square file</h2>
      <p>
        Square&apos;s item import is one row per variation. It can switch modifier sets on per item, but it can&apos;t create them. So:
      </p>
      <ol>
        <li>Create each modifier set in Square (Items → Modifiers), exact names, options, prices and min/max.</li>
        <li>Download the item import template from the Square account.</li>
        <li>Fill in items and variations, and mark Y on the modifier set columns each item uses.</li>
        <li>
          Import with <strong>Replace library</strong> on a fresh account (or Modify if items already exist).
        </li>
      </ol>
      <p>
        Full detail in our <Link href="/guides/square-item-library-import">Square item library import guide</Link>.
      </p>

      <h2>Step 4: Check before go-live</h2>
      <ul>
        <li>Item count and category count match the old menu.</li>
        <li>Spot-check 10 prices, including every size of one drink.</li>
        <li>Ring a test order with each required modifier set to make sure it prompts.</li>
        <li>Set up taxes, and check alcohol is taxed correctly.</li>
        <li>Rebuild kitchen printer routing; it doesn&apos;t come across.</li>
      </ul>

      <h2>The fast way</h2>
      <p>
        Upload the Toast export or photos of the menu to <Link href="/square">Fast POS Menu</Link>, pick Square, and it does the translation in step 2
        for you: sizes to variations, groups to modifier sets with min/max, categories in menu order. Review anything flagged, then download the Square
        item sheet and your modifier set checklist.
      </p>
      <Callout>
        <p>
          Going the other way, or to Clover? Same tool, different output. See <Link href="/guides/switch-pos-without-retyping-menu">switching POS
          without retyping the menu</Link>.
        </p>
      </Callout>
    </GuideLayout>
  );
}
