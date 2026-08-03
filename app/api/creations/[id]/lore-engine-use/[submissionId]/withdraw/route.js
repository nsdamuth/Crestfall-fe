import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { withdrawOwnedLoreEngineUseSubmission } from "@/lib/server/services/creations/loreEngineUseService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "LORE_ENGINE_USE_WITHDRAW_FAILED") {
  return NextResponse.json(
    { data: null, error: { code, message, details: null } },
    { status }
  );
}

async function getParams(params) {
  const resolved = await params;
  return {
    creationId: resolved?.id || "",
    submissionId: resolved?.submissionId || "",
  };
}

export async function POST(_request, { params }) {
  const { creationId, submissionId } = await getParams(params);
  const supabase = await createClient();
  const { user, error: userError } = await getAuthenticatedUser(supabase);

  if (userError || !user) return apiError("Unauthorized", 401, "UNAUTHORIZED");
  if (!creationId || !submissionId) {
    return apiError(
      "Lore Asset and engine-use submission ids are required.",
      400,
      "LORE_ENGINE_USE_WITHDRAW_IDS_REQUIRED"
    );
  }

  try {
    const payload = await withdrawOwnedLoreEngineUseSubmission({
      userId: user.id,
      creationId,
      submissionId,
    });
    return NextResponse.json(payload);
  } catch (error) {
    if (error?.payload && Number.isInteger(error.status)) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    return apiError(
      error?.message || "Lore could not be withdrawn from engine use.",
      500,
      error?.code || "LORE_ENGINE_USE_WITHDRAW_FAILED"
    );
  }
}
