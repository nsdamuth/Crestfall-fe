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
  code = "OUTFIT_ADVANCED_CONVERSION_FAILED",
  details = null
) {
  return NextResponse.json(
    { data: null, error: { code, message, details } },
    { status }
  );
}

function forwardServiceError(error) {
  if (error?.payload && Number.isInteger(error.status)) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  return apiError(
    error?.message || "The Outfit prompt could not be converted to Advanced mode.",
    500,
    error?.code || "OUTFIT_ADVANCED_CONVERSION_FAILED",
    error?.details || null
  );
}

export async function POST(request) {
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
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
      path: "/v1/studio/outfits/advanced-prompt-conversion",
      method: "POST",
      body,
      headers: { "x-crestfall-user-id": user.id },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return forwardServiceError(error);
  }
}
