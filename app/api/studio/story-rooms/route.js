import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "STORY_ROOM_FAILED") {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

export async function GET(request) {
  const supabase = await createClient();

  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const incoming = request?.nextUrl?.searchParams || new URL(request.url).searchParams;
    const outgoing = new URLSearchParams();
    const limit = Number.parseInt(incoming.get("limit"), 10);
    const offset = Number.parseInt(incoming.get("offset"), 10);

    if (Number.isFinite(limit) && limit > 0) {
      outgoing.set("limit", String(Math.min(limit, 100)));
    }
    if (Number.isFinite(offset) && offset >= 0) {
      outgoing.set("offset", String(offset));
    }

    const suffix = outgoing.size ? `?${outgoing.toString()}` : "";
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms${suffix}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Story rooms could not be loaded.",
      500,
      "STORY_ROOM_LIST_FAILED"
    );
  }
}

export async function POST(request) {
  const supabase = await createClient();

  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/studio/story-rooms",
      method: "POST",
      body: payload,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Story room could not be created.",
      500,
      "STORY_ROOM_CREATE_FAILED"
    );
  }
}
