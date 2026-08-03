import { NextResponse } from "next/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const url = new URL(request.url);
  const query =
    url.searchParams.toString();

  try {
    const payload =
      await crestfallApiRequest({
        path:
          "/v1/community/creations" +
          (query ? `?${query}` : ""),
        method: "GET",
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
            "COMMUNITY_CREATIONS_LOAD_FAILED",
          message:
            error?.message ||
            "Community creations could not be loaded.",
          details: null,
        },
      },
      {
        status: 500,
      }
    );
  }
}