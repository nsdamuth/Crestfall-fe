import { NextResponse } from "next/server";

import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  request,
  { params }
) {
  const { imageOutputId } = await params;
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in to rename images.",
          details: null,
        },
      },
      { status: 401 }
    );
  }

  let body = {};
  try {
    body = (await request.json()) || {};
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON body.",
          details: null,
        },
      },
      { status: 400 }
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: `/v1/media/images/${encodeURIComponent(imageOutputId)}`,
      method: "PATCH",
      body,
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return NextResponse.json(
      {
        data: null,
        error: {
          code: "IMAGE_RENAME_FAILED",
          message: error?.message || "Image name could not be saved.",
          details: null,
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request,
  { params }
) {
  const { imageOutputId } = await params;

  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message:
            "You must be signed in to delete images.",
          details: null,
        },
      },
      {
        status: 401,
      }
    );
  }

  let body = {};

  try {
    body =
      (await request.json()) || {};
  } catch {
    body = {};
  }

  try {
    const payload =
      await crestfallApiRequest({
        path: `/v1/media/images/${encodeURIComponent(
          imageOutputId
        )}`,

        method: "DELETE",
        body,

        headers: {
          "x-crestfall-user-id":
            user.id,
        },
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
          code: "IMAGE_DELETE_FAILED",
          message:
            error?.message ||
            "Image could not be deleted.",
          details: null,
        },
      },
      {
        status: 500,
      }
    );
  }
}