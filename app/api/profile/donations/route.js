import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value || ""), 10);

  if (!Number.isFinite(parsed)) {
    return 20;
  }

  return Math.max(1, Math.min(parsed, 100));
}

export async function GET(request) {
  const url = new URL(request.url);

  const profileId = String(
    url.searchParams.get("profileId") || ""
  ).trim();

  if (!profileId) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "PROFILE_ID_REQUIRED",
          message: "Profile id is required.",
          details: null,
        },
      },
      {
        status: 400,
      }
    );
  }

  const limit = normalizeLimit(
    url.searchParams.get("limit")
  );

  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(supabase);

  const authenticatedUser =
    userError || !user ? null : user;

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/profiles/${encodeURIComponent(
        profileId
      )}/donation-events?limit=${limit}`,
      method: "GET",
      headers: authenticatedUser
        ? {
            "x-crestfall-user-id":
              authenticatedUser.id,
          }
        : {},
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (
      error?.payload &&
      Number.isInteger(error.status)
    ) {
      return NextResponse.json(error.payload, {
        status: error.status,
      });
    }

    return NextResponse.json(
      {
        data: null,
        error: {
          code: "DONATION_EVENTS_LOAD_FAILED",
          message:
            error.message ||
            "Donation events could not be loaded.",
          details: null,
        },
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message:
            "You must be signed in to donate coins.",
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
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON body.",
        },
      },
      {
        status: 400,
      }
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: "/v1/profile/donations",
      method: "POST",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      data: payload?.data || null,
    });
  } catch (error) {
    const serviceError =
      error?.payload?.error || null;

    return NextResponse.json(
      {
        ok: false,
        error: {
          code:
            serviceError?.code ||
            "DONATION_FAILED",

          message:
            serviceError?.message ||
            error?.message ||
            "Donation could not be completed.",
        },
      },
      {
        status:
          Number.isInteger(error?.status)
            ? error.status
            : 500,
      }
    );
  }
}