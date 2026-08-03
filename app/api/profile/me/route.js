import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { apiError, apiOk } from "@/lib/server/api/responses";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireUser() {
  const supabase = await createClient();

  return getAuthenticatedUser(supabase);
}

function forwardServiceError(
  error,
  fallbackMessage,
  fallbackCode
) {
  if (error?.payload && Number.isInteger(error.status)) {
    return NextResponse.json(error.payload, {
      status: error.status,
    });
  }

  return apiError(
    error?.message || fallbackMessage,
    500,
    fallbackCode
  );
}

function buildProfileResponse(user, responsePayload) {
  return apiOk({
    user: {
      id: user.id,
      email: user.email,
    },
    profile: responsePayload?.data?.profile || null,
  });
}

export async function GET() {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/profile/me",
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return buildProfileResponse(user, responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Profile could not be loaded.",
      "PROFILE_LOAD_FAILED"
    );
  }
}

export async function PATCH(request) {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return apiError(
      "Invalid JSON body.",
      400,
      "INVALID_JSON"
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/profile/me",
      method: "PATCH",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return buildProfileResponse(user, responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Profile could not be updated.",
      "PROFILE_UPDATE_FAILED"
    );
  }
}