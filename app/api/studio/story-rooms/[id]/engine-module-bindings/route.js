import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "ENGINE_MODULE_BINDINGS_FAILED") {
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

async function requireUser() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

function getRoomId(params) {
  return params?.id || params?.roomId || "";
}

async function forwardBindingRequest({ method, roomId, userId, body }) {
  return crestfallApiRequest({
    path: `/v1/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/engine-module-bindings`,
    method,
    body,
    headers: {
      "x-crestfall-user-id": userId,
    },
  });
}

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const roomId = getRoomId(resolvedParams);

  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!roomId) {
    return apiError("Story room id is required.", 400, "STORY_ROOM_ID_REQUIRED");
  }

  try {
    const responsePayload = await forwardBindingRequest({
      method: "GET",
      roomId,
      userId: user.id,
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module bindings could not be loaded.",
      500,
      "ENGINE_MODULE_BINDINGS_LOAD_FAILED"
    );
  }
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const roomId = getRoomId(resolvedParams);

  const { user, error: userError } = await requireUser();

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
    const responsePayload = await forwardBindingRequest({
      method: "POST",
      roomId,
      userId: user.id,
      body: payload,
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module binding could not be saved.",
      500,
      "ENGINE_MODULE_BINDING_SAVE_FAILED"
    );
  }
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const roomId = getRoomId(resolvedParams);

  const { user, error: userError } = await requireUser();

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
    const responsePayload = await forwardBindingRequest({
      method: "PUT",
      roomId,
      userId: user.id,
      body: payload,
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module bindings could not be replaced.",
      500,
      "ENGINE_MODULE_BINDINGS_REPLACE_FAILED"
    );
  }
}