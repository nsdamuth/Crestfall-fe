import { getCreationApiErrorMessage } from "./creationClient";

async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

async function requestLoreEngineUseApi({
  endpoint,
  method = "GET",
  body = null,
  fallbackMessage,
}) {
  const response = await fetch(endpoint, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : null,
    cache: "no-store",
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(
      getCreationApiErrorMessage(payload, fallbackMessage)
    );
    error.code = payload?.error?.code || null;
    error.details = payload?.error?.details || null;
    throw error;
  }

  return payload?.data || null;
}

export async function fetchLoreEngineUseState(creationId) {
  if (!creationId) throw new Error("Lore Asset id is required.");

  return requestLoreEngineUseApi({
    endpoint: `/api/creations/${encodeURIComponent(creationId)}/lore-engine-use`,
    fallbackMessage: "Lore engine-use status could not be loaded.",
  });
}

export async function submitLoreForEngineUse(creationId, configuration) {
  if (!creationId) throw new Error("Lore Asset id is required.");

  return requestLoreEngineUseApi({
    endpoint: `/api/creations/${encodeURIComponent(creationId)}/lore-engine-use`,
    method: "POST",
    body: configuration,
    fallbackMessage: "Lore could not be submitted for engine use.",
  });
}

export async function cancelLoreEngineUseSubmission(creationId, submissionId) {
  if (!creationId || !submissionId) {
    throw new Error("Lore Asset and engine-use submission ids are required.");
  }

  return requestLoreEngineUseApi({
    endpoint: `/api/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use/${encodeURIComponent(submissionId)}/cancel`,
    method: "POST",
    fallbackMessage: "Lore engine-use submission could not be cancelled.",
  });
}

export async function withdrawLoreEngineUseSubmission(creationId, submissionId) {
  if (!creationId || !submissionId) {
    throw new Error("Lore Asset and engine-use submission ids are required.");
  }

  return requestLoreEngineUseApi({
    endpoint: `/api/creations/${encodeURIComponent(
      creationId
    )}/lore-engine-use/${encodeURIComponent(submissionId)}/withdraw`,
    method: "POST",
    fallbackMessage: "Lore could not be withdrawn from engine use.",
  });
}
