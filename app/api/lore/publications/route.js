import { NextResponse } from "next/server";
import { listPublicLorePublications } from "@/lib/server/services/creations/lorePublicationService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const url = new URL(request.url);
  const limit = Math.min(
    200,
    Math.max(1, Number.parseInt(url.searchParams.get("limit") || "100", 10) || 100)
  );
  const offset = Math.max(
    0,
    Number.parseInt(url.searchParams.get("offset") || "0", 10) || 0
  );

  try {
    const payload = await listPublicLorePublications({ limit, offset });
    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return NextResponse.json(
      {
        data: null,
        error: {
          code: error?.code || "LORE_PUBLICATIONS_LOAD_FAILED",
          message: error?.message || "Published Lore could not be loaded.",
          details: null,
        },
      },
      { status: 500 }
    );
  }
}
