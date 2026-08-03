import {
  createClient,
} from "@/lib/supabase/server";

import {
  apiError,
  apiOk,
} from "@/lib/server/api/responses";

import {
  crestfallApiRequest,
} from "@/lib/server/api/crestfallApiClient";

import {
  getAuthenticatedUser,
} from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

function forwardServiceError(
  error,
  fallbackCode,
  fallbackMessage
) {
  const serviceError =
    error?.payload?.error;

  return apiError(
    serviceError?.message ||
      error?.message ||
      fallbackMessage,

    Number.isInteger(error?.status)
      ? error.status
      : 500,

    serviceError?.code ||
      fallbackCode,

    serviceError?.details ||
      null
  );
}

async function proxyFollowRequest({
  method,
  username,
  userId,
}) {
  const payload =
    await crestfallApiRequest({
      path:
        `/v1/profiles/${encodeURIComponent(
          username
        )}/follow`,

      method,

      headers: {
        "x-crestfall-user-id":
          userId,
      },
    });

  return apiOk(
    payload?.data ?? payload
  );
}

export async function POST(
  _request,
  { params }
) {
  const { username } =
    await params;

  const supabase =
    await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(
    supabase
  );

  if (userError || !user) {
    return apiError(
      "Unauthorized",
      401,
      "UNAUTHORIZED"
    );
  }

  try {
    return await proxyFollowRequest({
      method: "POST",
      username,
      userId: user.id,
    });
  } catch (error) {
    return forwardServiceError(
      error,
      "FOLLOW_FAILED",
      "Profile could not be followed."
    );
  }
}

export async function DELETE(
  _request,
  { params }
) {
  const { username } =
    await params;

  const supabase =
    await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(
    supabase
  );

  if (userError || !user) {
    return apiError(
      "Unauthorized",
      401,
      "UNAUTHORIZED"
    );
  }

  try {
    return await proxyFollowRequest({
      method: "DELETE",
      username,
      userId: user.id,
    });
  } catch (error) {
    return forwardServiceError(
      error,
      "UNFOLLOW_FAILED",
      "Profile could not be unfollowed."
    );
  }
}