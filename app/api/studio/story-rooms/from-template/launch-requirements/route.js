import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(
  message,
  status = 500,
  code = "STORY_LAUNCH_REQUIREMENTS_FAILED"
) {
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

export async function GET(request) {
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return apiError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const templateId = String(
    new URL(request.url).searchParams.get("templateId") || ""
  ).trim();

  if (!templateId) {
    return apiError(
      "A Story Template id is required.",
      400,
      "STORY_TEMPLATE_REQUIRED"
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/from-template/launch-requirements?templateId=${encodeURIComponent(
        templateId
      )}`,
      method: "GET",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return apiError(
      error.message || "Story launch requirements could not be loaded.",
      Number.isInteger(error?.status) ? error.status : 500,
      error?.code || "STORY_LAUNCH_REQUIREMENTS_FAILED"
    );
  }
}
