import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  const { username } = await params;

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
        username
      )}/public`,
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
          code: "PUBLIC_PROFILE_LOAD_FAILED",
          message:
            error.message ||
            "Public profile could not be loaded.",
          details: null,
        },
      },
      {
        status: 500,
      }
    );
  }
}