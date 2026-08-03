import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "GAMES_LOAD_FAILED") {
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

export async function GET() {
  const supabase = await createClient();

  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: "/v1/studio/games",
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Games could not be loaded.",
      500,
      "GAMES_LOAD_FAILED"
    );
  }
}