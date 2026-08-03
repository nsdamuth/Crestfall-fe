import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "MEDIA_REACTIONS_FAILED") {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        details: null,
      },
    },
    { status }
  );
}

async function requireUser() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

function getMediaReactionsQuery(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();

  const imageOutputIds = url.searchParams.get("imageOutputIds");

  if (imageOutputIds) {
    params.set("imageOutputIds", imageOutputIds);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export async function GET(request) {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/engagement/media-reactions${getMediaReactionsQuery(
        request
      )}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Media reactions could not be loaded.",
      500,
      "MEDIA_REACTIONS_LOAD_FAILED"
    );
  }
}

export async function POST(request) {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let body = null;

  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/studio/engagement/media-reactions",
      method: "POST",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Media reaction could not be saved.",
      500,
      "MEDIA_REACTION_SAVE_FAILED"
    );
  }
}