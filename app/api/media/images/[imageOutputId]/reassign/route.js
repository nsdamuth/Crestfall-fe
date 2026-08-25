import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status, code, details = null) {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

async function getActor() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

function serviceFailure(error, fallbackCode, fallbackMessage) {
  const serviceError = error?.payload?.error;

  return apiError(
    serviceError?.message || error?.message || fallbackMessage,
    Number.isInteger(error?.status) ? error.status : 500,
    serviceError?.code || fallbackCode,
    serviceError?.details || null
  );
}

export async function GET(request, { params }) {
  const { imageOutputId } = await params;
  const { user, error: userError } = await getActor();

  if (userError || !user) {
    return apiError(
      "You must be signed in to reassign images.",
      401,
      "UNAUTHORIZED"
    );
  }

  const incomingUrl = new URL(request.url);
  const sourceCreationId = incomingUrl.searchParams.get("sourceCreationId");
  const query = sourceCreationId
    ? `?sourceCreationId=${encodeURIComponent(sourceCreationId)}`
    : "";

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/media/images/${encodeURIComponent(
        imageOutputId
      )}/reassign${query}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(payload);
  } catch (error) {
    return serviceFailure(
      error,
      "IMAGE_REASSIGNMENT_CONTEXT_FAILED",
      "Image reassignment options could not be loaded."
    );
  }
}

export async function POST(request, { params }) {
  const { imageOutputId } = await params;
  const { user, error: userError } = await getActor();

  if (userError || !user) {
    return apiError(
      "You must be signed in to reassign images.",
      401,
      "UNAUTHORIZED"
    );
  }

  let body;

  try {
    body = (await request.json()) || {};
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/media/images/${encodeURIComponent(
        imageOutputId
      )}/reassign`,
      method: "POST",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(payload);
  } catch (error) {
    return serviceFailure(
      error,
      "IMAGE_REASSIGNMENT_FAILED",
      "Image could not be reassigned."
    );
  }
}
