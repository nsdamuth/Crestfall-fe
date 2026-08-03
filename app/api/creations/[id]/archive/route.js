import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "CREATION_ARCHIVE_FAILED") {
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

async function requireUser() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

async function getCreationId(params) {
  const resolvedParams = await params;
  return resolvedParams?.id || "";
}

export async function POST(request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  let body = null;

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/creations/${encodeURIComponent(creationId)}/archive`,
      method: "POST",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Creation could not be archived.",
      500,
      "CREATION_ARCHIVE_FAILED"
    );
  }
}