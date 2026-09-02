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
      "You must be signed in to load account capabilities.",
      401,
      "UNAUTHORIZED"
    );
  }

  try {
    const payload = await crestfallApiRequest({
      path: "/v1/account/capabilities",
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    const capabilities = payload?.data;

    if (
      !capabilities ||
      typeof capabilities.chat !== "boolean" ||
      typeof capabilities.imageGeneration !== "boolean" ||
      typeof capabilities.videoGeneration !== "boolean"
    ) {
      return apiError(
        "Account capabilities returned an invalid response.",
        502,
        "ACCOUNT_CAPABILITIES_CONTRACT_INVALID"
      );
    }

    return apiOk(capabilities);
  } catch (error) {
    return apiError(
      error.message ||
        "Account capabilities could not be loaded.",
      Number.isInteger(error?.status) ? error.status : 500,
      error?.code || "ACCOUNT_CAPABILITIES_LOAD_FAILED"
    );
  }
}
