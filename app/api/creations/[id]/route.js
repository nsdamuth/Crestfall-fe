import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { readJsonRequestBody } from "@/lib/server/api/readJsonRequestBody";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(
  message,
  status = 500,
  code = "CREATION_FAILED",
  details = null
) {
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
function forwardServiceError(
  error,
  fallbackMessage,
  fallbackCode
) {
  if (
    error?.payload &&
    Number.isInteger(error.status)
  ) {
    return NextResponse.json(
      error.payload,
      {
        status: error.status,
      }
    );
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

async function getCreationId(params) {
  const resolvedParams = await params;
  return resolvedParams?.id || "";
}

export async function GET(_request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!creationId) {
    return apiError("Creation id is required.", 400, "CREATION_ID_REQUIRED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/creations/${encodeURIComponent(creationId)}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    // Some upstream GraphQL failures can arrive inside a successful HTTP
    // transport envelope. A failed write must never report success to the
    // V2 Chassis. Preserve the FE trunk's fail-closed response behavior.
    if (responsePayload?.error) {
      return NextResponse.json(responsePayload, { status: 500 });
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Creation could not be loaded.",
      "CREATION_LOAD_FAILED"
    );
  }
}

export async function PATCH(request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!creationId) {
    return apiError("Creation id is required.", 400, "CREATION_ID_REQUIRED");
  }

  let body = null;

  try {
    body = await readJsonRequestBody(request);
  } catch (error) {
    return apiError(
      error?.message || "Invalid JSON body.",
      Number.isInteger(error?.status) ? error.status : 400,
      error?.code || "INVALID_JSON",
      error?.details || null
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/creations/${encodeURIComponent(creationId)}`,
      method: "PATCH",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Creation could not be updated.",
      "CREATION_UPDATE_FAILED"
    );
  }
}

export async function DELETE(_request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!creationId) {
    return apiError("Creation id is required.", 400, "CREATION_ID_REQUIRED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/creations/${encodeURIComponent(creationId)}`,
      method: "DELETE",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Creation could not be deleted.",
      "CREATION_DELETE_FAILED"
    );
  }
}