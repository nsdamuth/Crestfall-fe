import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "IMAGE_GENERATION_FAILED") {
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

  const url = new URL(request.url);
  const params = new URLSearchParams();

  const limit = url.searchParams.get("limit");
  const cursor = url.searchParams.get("cursor") || url.searchParams.get("after");

  if (limit) {
    params.set("limit", limit);
  }

  if (cursor) {
    params.set("cursor", cursor);
  }

  const query = params.toString();

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/image-generation/jobs${query ? `?${query}` : ""}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Image generation history could not be loaded.",
      500,
      "IMAGE_GENERATION_HISTORY_LOAD_FAILED"
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
      path: "/v1/studio/image-generation/jobs",
      method: "POST",
      body: payload,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Image generation job could not be created.",
      500,
      "IMAGE_GENERATION_REQUEST_FAILED"
    );
  }
}