import { NextResponse } from "next/server";

const APEX_HOST = "crestfall.net";
const CANONICAL_HOST = "www.crestfall.net";

export function proxy(request) {
  const url = request.nextUrl.clone();

  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = forwardedHost || request.headers.get("host") || "";
  const host = hostHeader.toLowerCase().split(":")[0];

  if (process.env.NODE_ENV === "production" && host === APEX_HOST) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};