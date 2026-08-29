import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { getOwnedTimelineProjection } from "@/lib/server/services/creations/timelineService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "TIMELINE_LOAD_FAILED") {
  return NextResponse.json(
    { data: null, error: { code, message, details: null } },
    { status }
  );
}

export async function GET(_request, { params }) {
  const resolved = await params;
  const timelineId = resolved?.id || "";
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!timelineId) {
    return apiError("Timeline id is required.", 400, "TIMELINE_ID_REQUIRED");
  }

  try {
    const payload = await getOwnedTimelineProjection({
      userId: user.id,
      timelineId,
    });
    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return apiError(
      error?.message || "Timeline could not be loaded.",
      500,
      error?.code || "TIMELINE_LOAD_FAILED"
    );
  }
}
