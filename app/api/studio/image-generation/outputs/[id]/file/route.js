import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import {
  appendImageConditionalRequestHeaders,
  buildImageProxyResponseHeaders,
} from "@/lib/server/media/imageFileCacheProxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "IMAGE_OUTPUT_FILE_FAILED") {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

function getCrestfallApiConfig() {
  const baseUrl = process.env.CRESTFALL_API_INTERNAL_URL;
  const secret = process.env.CRESTFALL_API_INTERNAL_SECRET;

  if (!baseUrl) {
    throw new Error("CRESTFALL_API_INTERNAL_URL is not configured.");
  }

  if (!secret) {
    throw new Error("CRESTFALL_API_INTERNAL_SECRET is not configured.");
  }

  return {
    baseUrl,
    secret,
  };
}

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return apiError("Image output id is required.", 400, "MISSING_IMAGE_OUTPUT_ID");
  }
  const variant = request.nextUrl?.searchParams?.get("variant") || "";
  const safeVariant =
    variant === "thumbnail" ||
    variant === "card" ||
    variant === "lockedPreview" ||
    variant === "display"
      ? variant
      : "";

  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const { baseUrl, secret } = getCrestfallApiConfig();

    const serviceUrl = new URL(
      `/v1/studio/image-generation/outputs/${encodeURIComponent(id)}/file`,
      baseUrl
    );

    if (safeVariant) {
      serviceUrl.searchParams.set("variant", safeVariant);
    }

    const response = await fetch(serviceUrl.toString(), {
      method: "GET",
      headers: appendImageConditionalRequestHeaders(request, {
        "x-crestfall-internal-secret": secret,
        "x-crestfall-user-id": user.id,
      }),
      cache: "no-store",
    });

    if (response.status === 304) {
      return new Response(null, {
        status: 304,
        headers: buildImageProxyResponseHeaders(response),
      });
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => null);

      return apiError(
        payload?.error || "Image output file could not be loaded.",
        response.status,
        payload?.code || "IMAGE_OUTPUT_FILE_LOAD_FAILED"
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: buildImageProxyResponseHeaders(response),
    });
  } catch (error) {
    return apiError(
      error.message || "Image output file could not be loaded.",
      500,
      "IMAGE_OUTPUT_FILE_LOAD_FAILED"
    );
  }
}