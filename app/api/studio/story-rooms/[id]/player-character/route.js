import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "STORY_ROOM_PC_FAILED") {
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

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const roomId = resolvedParams?.id;

  const supabase = await createClient();

  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!roomId) {
    return apiError("Story room id is required.", 400, "STORY_ROOM_ID_REQUIRED");
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/${encodeURIComponent(
        roomId
      )}/player-character`,
      method: "POST",
      headers: {
        "x-crestfall-user-id": user.id,
      },
      body: payload || {},
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Player Character could not be changed.",
      500,
      "STORY_ROOM_PC_UPDATE_FAILED"
    );
  }
}