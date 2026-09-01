import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(parsed, 50)) : 20;
}

export async function GET(request) {
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in to view notifications.",
          details: null,
        },
      },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const limit = normalizeLimit(url.searchParams.get("limit"));

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/studio/notifications?limit=${limit}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return NextResponse.json(
      {
        data: null,
        error: {
          code: "STUDIO_NOTIFICATIONS_LOAD_FAILED",
          message: error?.message || "Notifications could not be loaded.",
          details: null,
        },
      },
      { status: 500 }
    );
  }
}
