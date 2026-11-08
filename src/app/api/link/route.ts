import { classifyLink } from "@/lib/ingest/link";

/**
 * Link intake. Stub: classifies the link and returns guidance.
 * Own-site fetching is behind LINK_FETCH_ENABLED and not implemented yet
 * (needs SSRF guard + robots.txt check). Marketplace links are never fetched.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { url?: string };
  const verdict = classifyLink(body.url ?? "");
  if (verdict.kind === "own_site" && verdict.enabled) {
    // TODO: fetch once with a plain UA, check robots.txt, block private IPs,
    // strip HTML to text, then run extractMenu({ kind: "text", ... }).
    return Response.json({ ...verdict, message: "Website import isn't built yet." }, { status: 501 });
  }
  return Response.json(verdict);
}
