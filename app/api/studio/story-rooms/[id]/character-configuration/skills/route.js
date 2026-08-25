import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "SKILLS_CHARACTER_CONFIGURATION_FAILED") {
  return NextResponse.json({ data: null, error: { code, message } }, { status });
}

async function getOwner() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

export async function GET(_request, { params }) {
  const { user, error } = await getOwner();
  if (error || !user) return apiError("Unauthorized", 401, "UNAUTHORIZED");
  const { id: roomId } = await params;
  if (!roomId) return apiError("Story room id is required.", 400, "STORY_ROOM_ID_REQUIRED");

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/${encodeURIComponent(roomId)}/character-configuration/skills`,
      method: "GET",
      headers: { "x-crestfall-user-id": user.id },
    });
    return NextResponse.json(responsePayload);
  } catch (requestError) {
    return apiError(
      requestError.message || "Skills Character Configuration could not be loaded.",
      Number.isInteger(requestError?.status) ? requestError.status : 500,
      requestError?.code || "SKILLS_CHARACTER_CONFIGURATION_LOAD_FAILED"
    );
  }
}

export async function POST(request, { params }) {
  const { user, error } = await getOwner();
  if (error || !user) return apiError("Unauthorized", 401, "UNAUTHORIZED");
  const { id: roomId } = await params;
  if (!roomId) return apiError("Story room id is required.", 400, "STORY_ROOM_ID_REQUIRED");

  let payload;
  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/${encodeURIComponent(roomId)}/character-configuration/skills`,
      method: "POST",
      headers: { "x-crestfall-user-id": user.id },
      body: payload || {},
    });
    return NextResponse.json(responsePayload);
  } catch (requestError) {
    return apiError(
      requestError.message || "Skills Character Configuration could not be saved.",
      Number.isInteger(requestError?.status) ? requestError.status : 500,
      requestError?.code || "SKILLS_CHARACTER_CONFIGURATION_SAVE_FAILED"
    );
  }
}
