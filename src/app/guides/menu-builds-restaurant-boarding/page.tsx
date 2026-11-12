import type { Metadata } from "next";
import Link from "next/link";
import { getGuide } from "@/content/guides";
import { Callout, GuideLayout } from "@/components/marketing/GuideLayout";

const guide = getGuide("menu-builds-restaurant-boarding");

export const metadata: Metadata = {
  title: "Menu builds are slowing your restaurant boarding · Fast POS Menu",
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
          <li>Approval, hardware and training are predictable. The menu build is the step that varies most and slips most.</li>
          <li>Hand builds commonly run 4 to 20 hours per restaurant, usually unbilled, and every day of delay is a merchant who signed but isn&apos;t processing.</li>
          <li>Move the menu build to the sales meeting, standardize it across POS brands, and have your team review instead of type.</li>
        </ul>
      }
      cta={{ title: "Take the menu off the critical path.", sub: "Build it at the table. Review on your phone. $49 a menu.", label: "Try it on your next board" }}
    >
      <p>
        Walk through a typical restaurant board: the app goes in, underwriting approves, hardware ships, the install gets scheduled. Each of those has
        a known timeline. Then there&apos;s the menu, and nobody can tell you when it&apos;ll be done.
      </p>

      <h2>Where the time goes</h2>
      <p>
        A restaurant menu isn&apos;t a product list. It&apos;s items, sizes, required choices, optional add-ons with prices, rules about how many you
        can pick, and categories in the order servers expect. Building it by hand in a POS back office commonly takes 4 to 20 hours depending on the
        menu, by what operators and installers report. Some shops hand it to the POS vendor&apos;s onboarding team and wait in their queue; some
        vendors bill it hourly (Toast lists menu-expert hours at about $150).
      </p>
      <p>Whoever does it, three costs land on the ISO:</p>
      <ul>
        <li>
          <strong>Unbilled labor.</strong> Your installer or agent&apos;s hours, or a freelancer you pay and manage.
        </li>
        <li>
          <strong>Time to first transaction.</strong> Residuals start when cards run. A menu that takes a week is a week of zero.
        </li>
        <li>
          <strong>Early churn risk.</strong> The gap between &quot;signed&quot; and &quot;live&quot; is where merchants get cold feet, take a
          competitor&apos;s call, or decide to stay on the old system.
        </li>
      </ul>

      <h2>Why it&apos;s worse on POS switches</h2>
      <p>
        Your best deals usually come off another POS: an established restaurant with real volume. That&apos;s also the case where the owner has a
        large, battle-tested menu and the most to lose if it&apos;s wrong. &quot;We&apos;ll need to rebuild your menu&quot; is the sentence that
        makes them hesitate.
      </p>

      <h2>Three changes that fix it</h2>
      <h3>1. Start the menu in the sales meeting</h3>
      <p>
        The menu is sitting on the counter. Photograph every page (and the register&apos;s modifier screens on a switch) before you leave. You&apos;ve
        removed the &quot;waiting on the merchant to send their menu&quot; step entirely.
      </p>
      <h3>2. Review, don&apos;t type</h3>
      <p>
        Your people are better used checking a draft than typing one. A draft that flags what it&apos;s unsure of turns an afternoon of data entry
        into fifteen minutes of review.
      </p>
      <h3>3. One process for every POS you sell</h3>
      <p>
        If your shop sells Clover and Square and the occasional Toast, a different menu process per brand means nobody gets fast at any of them. Same
        input, same review, then pick the output format.
      </p>

      <h2>What to measure</h2>
      <ul>
        <li>Days from approval to first transaction, by POS brand. Look at the spread, not just the average.</li>
        <li>Hours per install spent on menus (ask your installers; they know).</li>
        <li>Merchants that cancel between approval and first transaction.</li>
      </ul>
      <p>If the menu is your longest pole, those numbers will show it within a month.</p>

      <h2>Where we fit</h2>
      <p>
        We built <Link href="/for-isos">Fast POS Menu</Link> for exactly this. Snap the menu, it builds categories, items, sizes and modifier groups
        with min/max, you fix what&apos;s flagged on your phone, and you download the import file for Clover, Square or Toast. $49 a menu today; a
        monthly plan for shops boarding every month is coming.
      </p>
      <Callout>
        <p>
          Run your next board through it and time it. If it doesn&apos;t save your team hours, it&apos;s not for you. See{" "}
          <Link href="/pricing">pricing</Link>.
        </p>
      </Callout>
    </GuideLayout>
  );
}
