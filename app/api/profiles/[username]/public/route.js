import { NextResponse } from "next/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  const { username } = await params;

  const normalizedUsername =
    typeof username === "string"
      ? username.trim().replace(/^@/, "")
      : "";

  if (!normalizedUsername) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "USERNAME_REQUIRED",
          message: "Username is required.",
          details: null,
        },
      },
      {
        status: 400,
      }
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/profiles/${encodeURIComponent(
        normalizedUsername
      )}/public`,
      method: "GET",
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
            error?.message ||
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