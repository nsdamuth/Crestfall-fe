import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function forwardServiceError(
  error,
  fallbackCode,
  fallbackMessage
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

  return NextResponse.json(
    {
      data: null,
      error: {
        code: fallbackCode,
        message:
          error?.message || fallbackMessage,
        details: null,
      },
    },
    {
      status: 500,
    }
  );
}

async function getOptionalAuthenticatedUser() {
  const supabase = await createClient();

  const {
    user,
    error,
  } = await getAuthenticatedUser(supabase);

  return error || !user ? null : user;
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  return getAuthenticatedUser(supabase);
}

export async function GET(
  _request,
  { params }
) {
  const { id } = await params;
  const user =
    await getOptionalAuthenticatedUser();

  try {
    const payload =
      await crestfallApiRequest({
        path: `/v1/creations/${encodeURIComponent(
          id
        )}/library-pass`,
        method: "GET",
        headers: user
          ? {
              "x-crestfall-user-id":
                user.id,
            }
          : {},
      });

    return NextResponse.json(payload);
  } catch (error) {
    return forwardServiceError(
      error,
      "LIBRARY_PASS_STATE_LOAD_FAILED",
      "Library Pass state could not be loaded."
    );
  }
}

export async function PATCH(
  request,
  { params }
) {
  const { id } = await params;

  const {
    user,
    error: userError,
  } = await requireAuthenticatedUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message:
            "You must be signed in to manage Library Pass sales.",
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
        )}/library-pass`,
        method: "PATCH",
        body,
        headers: {
          "x-crestfall-user-id":
            user.id,
        },
      });

    return NextResponse.json(payload);
  } catch (error) {
    return forwardServiceError(
      error,
      "LIBRARY_PASS_OFFER_UPDATE_FAILED",
      "Library Pass sales could not be updated."
    );
  }
}
