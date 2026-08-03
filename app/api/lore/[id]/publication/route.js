import { NextResponse } from "next/server";
import { getPublicLorePublication } from "@/lib/server/services/creations/lorePublicationService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "LORE_PUBLICATION_LOAD_FAILED") {
  return NextResponse.json(
    { data: null, error: { code, message, details: null } },
    { status }
  );
}

export async function GET(_request, { params }) {
  const resolved = await params;
  const creationId = resolved?.id || "";

  if (!creationId) {
    return apiError(
      "Lore Asset id is required.",
      400,
      "LORE_PUBLICATION_CREATION_REQUIRED"
    );
  }

  try {
    const payload = await getPublicLorePublication({ creationId });
    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return apiError(
      error?.message || "Published Lore revision could not be loaded.",
      500,
      error?.code || "LORE_PUBLICATION_LOAD_FAILED"
    );
  }
}
