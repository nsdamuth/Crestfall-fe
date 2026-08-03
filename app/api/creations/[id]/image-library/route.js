import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function forwardServiceError(error) {
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

  return NextResponse.json(
    {
      data: null,
      error: {
        code: "IMAGE_LIBRARY_LOAD_FAILED",
        message:
          error?.message ||
          "Image library could not be loaded.",
        details: null,
      },
    },
    {
      status: 500,
    }
  );
}

export async function GET(
  _request,
  { params }
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          details: null,
        },
      },
      {
        status: 401,
      }
    );
  }

  try {
    const payload =
      await crestfallApiRequest({
        path: `/v1/studio/creations/${encodeURIComponent(
          id
        )}/image-library`,

        method: "GET",

        headers: {
          "x-crestfall-user-id":
            user.id,
        },
      });

    return NextResponse.json(payload);
  } catch (error) {
    return forwardServiceError(error);
  }
}