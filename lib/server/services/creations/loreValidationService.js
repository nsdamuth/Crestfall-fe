import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

function buildHeaders(userId) {
  return {
    "x-crestfall-user-id": userId,
  };
}

export async function getOwnedLoreValidationState({ userId, creationId }) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-validation`,
    method: "GET",
    headers: buildHeaders(userId),
  });
}

export async function submitOwnedLoreValidation({ userId, creationId }) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-validation`,
    method: "POST",
    headers: buildHeaders(userId),
  });
}

export async function cancelOwnedLoreValidation({
  userId,
  creationId,
  submissionId,
}) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-validation/${encodeURIComponent(submissionId)}/cancel`,
    method: "POST",
    headers: buildHeaders(userId),
  });
}
