import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import {
  apiError,
  apiOk,
} from "@/lib/server/api/responses";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();

  const {
    user,
    error: userError,
  } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError(
      "Unauthorized",
      401,
      "UNAUTHORIZED"
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: "/v1/profile/mutuals",
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return apiOk({
      mutuals: payload?.data?.mutuals || [],
    });
  } catch (error) {
    return apiError(
      error.message ||
        "Mutual profiles could not be loaded.",
      500,
      "MUTUAL_PROFILES_LOAD_FAILED"
    );
  }
}