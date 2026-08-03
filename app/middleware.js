import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const STUDIO_HOSTS = new Set(["crestfall.studio", "www.crestfall.studio"]);

function getRequestHost(request) {
  return (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(":")[0]
    .toLowerCase();
}

function shouldRedirectStudioRoot(request) {
  const host = getRequestHost(request);

  return STUDIO_HOSTS.has(host) && request.nextUrl.pathname === "/";
}

export async function middleware(request) {
  if (shouldRedirectStudioRoot(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/studio";
    return NextResponse.redirect(url, 308);
  }

  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 2. Pass options to the request cookies so downstream Server Components see the secure flags
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value, options);
          });

          // 3. Re-create the response to forward the mutated request headers
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // 4. Pass options to the response cookies so the user's browser saves them correctly
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // This triggers setAll implicitly if the token is refreshing!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Apply your custom header to the finalized response object
  response.headers.set("x-crestfall-auth", user ? "user" : "none");

  return response;
}

export const config = {
  matcher: [
    "/",
    "/studio/:path*",
    "/auth/callback",
    "/login",
    "/logout",
    "/api/debug-auth",
  ],
};