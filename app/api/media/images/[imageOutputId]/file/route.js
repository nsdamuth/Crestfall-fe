import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getAuthenticatedUser,
} from "@/lib/server/auth/getAuthenticatedUser";

import {
  appendImageConditionalRequestHeaders,
  buildImageProxyResponseHeaders,
} from "@/lib/server/media/imageFileCacheProxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(
  message,
  status = 500,
  code =
    "IMAGE_OUTPUT_FILE_LOAD_FAILED"
) {
  return NextResponse.json(
    {
      data: null,
      error: {
        code,
        message,
        details: null,
      },
    },
    {
      status,
    }
  );
}

function getApiConfiguration() {
  const baseUrl =
    process.env.CRESTFALL_API_INTERNAL_URL;

  const secret =
    process.env.CRESTFALL_API_INTERNAL_SECRET;

  if (!baseUrl || !secret) {
    throw new Error(
      "Crestfall services API is not configured."
    );
  }

  return {
    baseUrl,
    secret,
  };
}

export async function GET(
  request,
  { params }
) {
  const { imageOutputId } =
    await params;

  if (!imageOutputId) {
    return apiError(
      "Image output id is required.",
      400,
      "MISSING_IMAGE_OUTPUT_ID"
    );
  }

  const requestedVariant =
    request.nextUrl.searchParams.get(
      "variant"
    );
  const variant =
    requestedVariant === "thumbnail" ||
    requestedVariant === "card" ||
    requestedVariant === "lockedPreview" ||
    requestedVariant === "display"
      ? requestedVariant
      : null;

  /*
   * Authentication is optional and used
   * only to identify an owner viewing
   * private/studio media.
   */
  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(
    supabase
  );

  const authenticatedUser =
    userError || !user
      ? null
      : user;

  try {
    const {
      baseUrl,
      secret,
    } = getApiConfiguration();

    const serviceUrl = new URL(
      `/v1/media/images/${encodeURIComponent(
        imageOutputId
      )}/file`,
      baseUrl
    );

    if (variant) {
      serviceUrl.searchParams.set(
        "variant",
        variant
      );
    }

    const headers = {
      "x-crestfall-internal-secret":
        secret,
    };

    if (authenticatedUser) {
      headers["x-crestfall-user-id"] =
        authenticatedUser.id;
    }

    const response = await fetch(
      serviceUrl,
      {
        method: "GET",
        headers: appendImageConditionalRequestHeaders(request, headers),
        cache: "no-store",
      }
    );

    if (response.status === 304) {
      return new Response(null, {
        status: 304,
        headers: buildImageProxyResponseHeaders(response),
      });
    }

    if (!response.ok) {
      const payload = await response
        .json()
        .catch(() => null);

      return apiError(
        payload?.error?.message ||
          payload?.error ||
          "Image output file could not be loaded.",
        response.status,
        payload?.error?.code ||
          payload?.code ||
          "IMAGE_OUTPUT_FILE_LOAD_FAILED"
      );
    }

    return new Response(
      response.body,
      {
        status: 200,
        headers: buildImageProxyResponseHeaders(response),
      }
    );
  } catch (error) {
    return apiError(
      error.message ||
        "Image output file could not be loaded."
    );
  }
}