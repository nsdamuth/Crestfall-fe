import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(_request, { params }) {
  const resolvedParams = await params;
  const roomId = resolvedParams?.id;
  const shareId = resolvedParams?.shareId;
  const supabase = await createClient();
  const { user, error: userError } =
    await getAuthenticatedUser(supabase);

  if (userError || !user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        },
      },
      { status: 401 }
    );
  }

  try {
    const responsePayload = await crestfallApiRequest({
      path: `/v1/studio/story-rooms/${encodeURIComponent(
        roomId
      )}/persistent-share/${encodeURIComponent(shareId)}`,
      method: "DELETE",
      headers: {
        "x-crestfall-user-id": user.id,
      },
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code:
            error?.code ||
            "PERSISTENT_SHARE_REVOKE_FAILED",
          message:
            error?.message ||
            "Persistent share could not be revoked.",
        },
      },
      { status: Number(error?.status) || 500 }
    );
  }
}
