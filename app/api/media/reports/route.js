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

export async function POST(
  request
) {
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
      "You must be signed in to report media.",
      401,
      "UNAUTHORIZED"
    );
  }

  let body;

  try {
    body =
      await request.json();
  } catch {
    return apiError(
      "Invalid JSON body.",
      400,
      "INVALID_JSON"
    );
  }

  try {
    const payload =
      await crestfallApiRequest({
        path:
          "/v1/media/reports",

        method: "POST",

        body: {
          imageOutputId:
            body?.imageOutputId,

          reasonKey:
            body?.reasonKey,

          reasonText:
            body?.reasonText ||
            "",
        },

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
        "Report could not be saved.",

      Number.isInteger(
        error?.status
      )
        ? error.status
        : 500,

      serviceError?.code ||
        "REPORT_SAVE_FAILED",

      serviceError?.details ||
        null
    );
  }
}