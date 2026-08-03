import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getAuthenticatedUser,
} from "@/lib/server/auth/getAuthenticatedUser";

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

  const variant =
    request.nextUrl.searchParams.get(
      "variant"
    ) === "thumbnail"
      ? "thumbnail"
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
        headers,
        cache: "no-store",
      }
    );

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

    const responseHeaders =
      new Headers();

    for (const headerName of [
      "content-type",
      "content-length",
      "cache-control",
    ]) {
      const value =
        response.headers.get(
          headerName
        );

      if (value) {
        responseHeaders.set(
          headerName,
          value
        );
      }
    }

    return new Response(
      response.body,
      {
        status: 200,
        headers:
          responseHeaders,
      }
    );
  } catch (error) {
    return apiError(
      error.message ||
        "Image output file could not be loaded."
    );
  }
}