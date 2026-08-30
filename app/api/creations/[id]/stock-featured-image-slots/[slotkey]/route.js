import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const slotKey =
    resolvedParams?.slotKey ||
    resolvedParams?.slotkey ||
    resolvedParams?.slot ||
    resolvedParams?.key ||
    "";

  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          details: null,
        },
      },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON body.",
          details: null,
        },
      },
      { status: 400 }
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/studio/creations/${encodeURIComponent(
        id
      )}/stock-featured-image-slots/${encodeURIComponent(slotKey)}`,
      method: "PUT",
      body,
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
          code: "STOCK_FEATURED_MEDIA_SAVE_FAILED",
          message: error?.message || "Crestfall Stock image could not be saved.",
          details: null,
        },
      },
      { status: 500 }
    );
  }
}
