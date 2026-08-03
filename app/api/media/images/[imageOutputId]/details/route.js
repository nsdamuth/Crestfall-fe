import {
  NextResponse,
} from "next/server";

import {
  crestfallApiRequest,
} from "@/lib/server/api/crestfallApiClient";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getAuthenticatedUser,
} from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

function apiError(
  message,
  status,
  code,
  details = null
) {
  return NextResponse.json(
    {
      ok: false,

      error: {
        message,
        code,
        details,
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
  const {
    imageOutputId,
  } = await params;

  const supabase =
    await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(
    supabase
  );

  if (userError || !user) {
    return apiError(
      "You must be signed in to view image details.",
      401,
      "UNAUTHORIZED"
    );
  }

  try {
    const payload =
      await crestfallApiRequest({
        path:
          `/v1/media/images/${encodeURIComponent(
            imageOutputId
          )}/details`,

        method: "GET",

        headers: {
          "x-crestfall-user-id":
            user.id,
        },
      });

    return NextResponse.json({
      ok: true,

      data:
        payload?.data ||
        null,
    });
  } catch (error) {
    const serviceError =
      error?.payload?.error;

    return apiError(
      serviceError?.message ||
        error?.message ||
        "Image details could not be loaded.",

      Number.isInteger(
        error?.status
      )
        ? error.status
        : 500,

      serviceError?.code ||
        "IMAGE_DETAILS_LOAD_FAILED",

      serviceError?.details ||
        null
    );
  }
}