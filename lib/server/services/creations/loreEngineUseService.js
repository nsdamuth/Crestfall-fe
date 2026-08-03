import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";

function buildHeaders(userId) {
  return {
    "x-crestfall-user-id": userId,
  };
}

export async function getOwnedLoreEngineUseState({ userId, creationId }) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use`,
    method: "GET",
    headers: buildHeaders(userId),
  });
}

export async function submitOwnedLoreForEngineUse({
  userId,
  creationId,
  configuration,
}) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use`,
    method: "POST",
    headers: buildHeaders(userId),
    body: configuration,
  });
}

export async function cancelOwnedLoreEngineUseSubmission({
  userId,
  creationId,
  submissionId,
}) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use/${encodeURIComponent(submissionId)}/cancel`,
    method: "POST",
    headers: buildHeaders(userId),
  });
}

export async function withdrawOwnedLoreEngineUseSubmission({
  userId,
  creationId,
  submissionId,
}) {
  return crestfallApiRequest({
    path: `/v1/studio/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use/${encodeURIComponent(submissionId)}/withdraw`,
    method: "POST",
    headers: buildHeaders(userId),
  });
}
