import { notFound } from "next/navigation";

import { feApiRequest } from "@/lib/server/api/feApiRequest";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getErrorCode(error) {
  return error?.payload?.error?.code || error?.payload?.code || null;
}

function getErrorMessage(error) {
  return (
    error?.payload?.error?.message ||
    error?.payload?.error ||
    error?.message ||
    "Creation could not be loaded."
  );
}

function getCreation(payload) {
  return payload?.data?.creation || payload?.creation || null;
}

/**
 * Lightweight owner-only creation read for V2 reader surfaces.
 *
 * The same-origin /api/creations/:id route requires the authenticated owner
 * and forwards that actor identity to services-api. Reader surfaces should use
 * this helper instead of public/community creation routes so private, unlisted,
 * and draft creations remain owner-only.
 */
export async function getOwnedCreationPageData(id) {
  const creationId = normalizeString(id);
  if (!creationId) notFound();

  try {
    const payload = await feApiRequest({
      path: `/api/creations/${encodeURIComponent(creationId)}`,
    });
    const creation = getCreation(payload);
    if (!creation) notFound();
    return { creation };
  } catch (error) {
    const code = getErrorCode(error);
    if (
      error?.status === 401 ||
      error?.status === 404 ||
      code === "UNAUTHORIZED" ||
      code === "CREATION_NOT_FOUND"
    ) {
      notFound();
    }

    throw new Error(getErrorMessage(error));
  }
}
