import { NextResponse } from "next/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getOptionalAuthenticatedUser() {
  const supabase = await createClient();
  const { user, error } =
    await getAuthenticatedUser(supabase);

  return error || !user ? null : user;
}

function apiError(
  message,
  status = 500,
  code = "PREVIEW_LOAD_FAILED"
) {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        details: null,
      },
    },
    {
      status,
    }
  );
}

export async function GET(
  _request,
  { params }
) {
  const { id } = await params;

  if (!id) {
    return apiError(
      "Creation ID is required.",
      400,
      "MISSING_CREATION_ID"
    );
  }

  try {
    const user =
      await getOptionalAuthenticatedUser();
    const payload =
      await crestfallApiRequest({
        path: `/v1/creations/${encodeURIComponent(
          id
        )}/preview`,

        method: "GET",
        headers: user
          ? {
              "x-crestfall-user-id": user.id,
            }
          : {},
      });

    return NextResponse.json(payload);
  } catch (error) {
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
      error?.message ||
        "Creation preview could not be loaded.",
      500,
      "PREVIEW_LOAD_FAILED"
    );
  }
}