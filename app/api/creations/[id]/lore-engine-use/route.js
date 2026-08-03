import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import {
  getOwnedLoreEngineUseState,
  submitOwnedLoreForEngineUse,
} from "@/lib/server/services/creations/loreEngineUseService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function apiError(message, status = 500, code = "LORE_ENGINE_USE_FAILED", details = null) {
  return NextResponse.json(
    { data: null, error: { code, message, details } },
    { status }
  );
}

function forwardServiceError(error, fallbackMessage, fallbackCode) {
  if (error?.payload && Number.isInteger(error.status)) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  return apiError(
    error?.message || fallbackMessage,
    500,
    fallbackCode,
    error?.details || null
  );
}

async function requireUser() {
  const supabase = await createClient();
  return getAuthenticatedUser(supabase);
}

async function getCreationId(params) {
  const resolvedParams = await params;
  return resolvedParams?.id || "";
}

export async function GET(_request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) return apiError("Unauthorized", 401, "UNAUTHORIZED");
  if (!creationId) {
    return apiError(
      "Lore Asset id is required.",
      400,
      "LORE_ENGINE_USE_CREATION_REQUIRED"
    );
  }

  try {
    const payload = await getOwnedLoreEngineUseState({
      userId: user.id,
      creationId,
    });
    return NextResponse.json(payload);
  } catch (error) {
    return forwardServiceError(
      error,
      "Lore engine-use status could not be loaded.",
      "LORE_ENGINE_USE_LOAD_FAILED"
    );
  }
}

export async function POST(request, { params }) {
  const creationId = await getCreationId(params);
  const { user, error: userError } = await requireUser();

  if (userError || !user) return apiError("Unauthorized", 401, "UNAUTHORIZED");
  if (!creationId) {
    return apiError(
      "Lore Asset id is required.",
      400,
      "LORE_ENGINE_USE_CREATION_REQUIRED"
    );
  }

  let configuration = null;
  try {
    configuration = await request.json();
  } catch {
    return apiError(
      "Engine-use configuration must be valid JSON.",
      400,
      "LORE_ENGINE_USE_BODY_INVALID"
    );
  }

  try {
    const payload = await submitOwnedLoreForEngineUse({
      userId: user.id,
      creationId,
      configuration,
    });
    return NextResponse.json(payload, { status: 202 });
  } catch (error) {
    return forwardServiceError(
      error,
      "Lore could not be submitted for engine use.",
      "LORE_ENGINE_USE_SUBMIT_FAILED"
    );
  }
}
