import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(
  message,
  status = 500,
  code = "RANDOM_LIKED_CHARACTER_LOAD_FAILED"
) {
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

export async function POST(_request, { params }) {
  const resolvedParams = await params;
  const roomId = resolvedParams?.id || resolvedParams?.roomId || "";
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!roomId) {
    return apiError(
      "Story room id is required.",
      400,
      "STORY_ROOM_ID_REQUIRED"
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/${encodeURIComponent(
        roomId
      )}/random-liked`,
      method: "POST",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message ||
        "A random liked Character could not be loaded into this Story.",
      error.status || 500,
      error.code || "RANDOM_LIKED_CHARACTER_LOAD_FAILED"
    );
  }
}
