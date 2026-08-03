import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

function buildHeaders(userId) {
  return {
    "x-crestfall-user-id": userId,
  };
}

export async function publishOwnedLoreValidatedRevision({
  userId,
  creationId,
  submissionId,
}) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-validation/${encodeURIComponent(submissionId)}/publish`,
    method: "POST",
    headers: buildHeaders(userId),
  });
}

export async function getPublicLorePublication({ creationId }) {
  return crestfallApiRequest({
    path: `/v1/lore/${encodeURIComponent(creationId)}/publication`,
    method: "GET",
  });
}
