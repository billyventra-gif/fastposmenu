import { NextResponse, type NextRequest } from "next/server";

/**
 * Private beta gate. Basic auth on the app and API so a public URL can't spend our Claude credits.
 * Set SITE_PASSWORD in Vercel. If it's missing in production, everything behind the gate is blocked.
 * Swap for Supabase Auth when accounts land.
 */
export function proxy(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
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
