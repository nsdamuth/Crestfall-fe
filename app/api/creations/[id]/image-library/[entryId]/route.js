import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  request,
  { params }
) {
  const {
    id,
    entryId,
  } = await params;

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

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON body.",
          details: null,
        },
      },
      {
        status: 400,
      }
    );
  }

  try {
    const payload =
      await crestfallApiRequest({
        path: `/v1/studio/creations/${encodeURIComponent(
          id
        )}/image-library/${encodeURIComponent(
          entryId
        )}`,

        method: "PATCH",
        body,

        headers: {
          "x-crestfall-user-id":
            user.id,
        },
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

    return NextResponse.json(
      {
        data: null,
        error: {
          code:
            "IMAGE_LIBRARY_ENTRY_UPDATE_FAILED",

          message:
            error?.message ||
            "Image library entry could not be updated.",

          details: null,
        },
      },
      {
        status: 500,
      }
    );
  }
}