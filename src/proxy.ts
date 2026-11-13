import { NextResponse, type NextRequest } from "next/server";

/**
 * Private beta gate. Basic auth on the app and API so a public URL can't spend our Claude credits.
 * - SITE_PASSWORD set: password required.
 * - PUBLIC_APP=true and no SITE_PASSWORD: open to everyone (launch). Read limits in src/lib/ratelimit.ts apply.
 * - Neither, in production: blocked.
 */
export function proxy(req: NextRequest) {
  // Stripe can't send a password; the webhook checks Stripe's signature instead.
  if (req.nextUrl.pathname === "/api/stripe/webhook") return NextResponse.next();
  const password = process.env.SITE_PASSWORD;
  if (!password && process.env.PUBLIC_APP === "true") return NextResponse.next();
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse("Private beta. Not configured yet.", { status: 503 });
  }
  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const pass = decoded.slice(decoded.indexOf(":") + 1);
      if (decoded.includes(":") && pass === password) return NextResponse.next();
    } catch {
      /* fall through */
    }
  }
  return new NextResponse("Password required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Fast POS Menu beta", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/build/:path*", "/api/:path*"],
};
