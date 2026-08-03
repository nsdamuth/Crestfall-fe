import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "CREATIONS_FAILED") {
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

async function requireUser() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

function buildQueryString(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();

  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const view = url.searchParams.get("view");

  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (view) params.set("view", view);

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
      path: `/v1/studio/creations${buildQueryString(request)}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Creations could not be loaded.",
      500,
      "CREATIONS_LOAD_FAILED"
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
      path: "/v1/studio/creations",
      method: "POST",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Creation could not be created.",
      "CREATION_CREATE_FAILED"
    );
  }
}