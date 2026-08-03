import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const requestUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? requestUrl.origin;

  return NextResponse.redirect(siteUrl);
}