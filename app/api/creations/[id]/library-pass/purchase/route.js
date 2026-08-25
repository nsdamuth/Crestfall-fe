import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { createClient } from "@/lib/supabase/server";

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
        code: "LIBRARY_PASS_PURCHASE_FAILED",
        message:
          error?.message ||
          "Library Pass purchase could not be completed.",
        details: null,
      },
    },
    {
      status: 500,
    }
  );
}

export async function POST(
  request,
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
          message:
            "You must be signed in to purchase a Library Pass.",
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
        path: `/v1/creations/${encodeURIComponent(
          id
        )}/library-pass/purchase`,
        method: "POST",
        body,
        headers: {
          "x-crestfall-user-id":
            user.id,
        },
      });

    return NextResponse.json(
      payload,
      {
        status:
          payload?.data?.purchase?.charged
            ? 201
            : 200,
      }
    );
  } catch (error) {
    return forwardServiceError(error);
  }
}
