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

async function readPayload(request) {
  return request.json();
}

export async function GET() {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/studio/engine-module-instances",
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module instances could not be loaded.",
      500,
      "ENGINE_MODULE_INSTANCE_LIST_FAILED"
    );
  }
}

export async function POST(request) {
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let payload;

  try {
    payload = await readPayload(request);
  } catch {
    return apiError("Invalid JSON body.", 400, "INVALID_JSON");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/studio/engine-module-instances",
      method: "POST",
      body: payload,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Engine module instance could not be created.",
      500,
      "ENGINE_MODULE_INSTANCE_CREATE_FAILED"
    );
  }
}