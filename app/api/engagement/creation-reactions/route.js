import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "CREATION_REACTIONS_FAILED") {
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

function forwardServiceError(error, fallbackMessage, fallbackCode) {
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

function getCreationReactionsQuery(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();

  const creationIds = url.searchParams.get("creationIds");

  if (creationIds) {
    params.set("creationIds", creationIds);
  }

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
      path: `/v1/studio/engagement/creation-reactions${getCreationReactionsQuery(
        request
      )}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Creation reactions could not be loaded.",
      "CREATION_REACTIONS_LOAD_FAILED"
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
      path: "/v1/studio/engagement/creation-reactions",
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
      "Creation reaction could not be saved.",
      "CREATION_REACTION_SAVE_FAILED"
    );
  }
}