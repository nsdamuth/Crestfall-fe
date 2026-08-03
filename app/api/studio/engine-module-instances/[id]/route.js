import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "ENGINE_MODULE_INSTANCE_FAILED") {
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

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const moduleInstanceId = resolvedParams?.id;

  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!moduleInstanceId) {
    return apiError(
      "Engine module instance id is required.",
      400,
      "ENGINE_MODULE_INSTANCE_ID_REQUIRED"
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/engine-module-instances/${encodeURIComponent(
        moduleInstanceId
      )}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module instance could not be loaded.",
      500,
      "ENGINE_MODULE_INSTANCE_LOAD_FAILED"
    );
  }
}

export async function PATCH(request, { params }) {
  const resolvedParams = await params;
  const moduleInstanceId = resolvedParams?.id;

  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!moduleInstanceId) {
    return apiError(
      "Engine module instance id is required.",
      400,
      "ENGINE_MODULE_INSTANCE_ID_REQUIRED"
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/engine-module-instances/${encodeURIComponent(
        moduleInstanceId
      )}`,
      method: "PATCH",
      body: payload,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module instance could not be updated.",
      500,
      "ENGINE_MODULE_INSTANCE_UPDATE_FAILED"
    );
  }
}

export async function PUT(request, context) {
  return PATCH(request, context);
}