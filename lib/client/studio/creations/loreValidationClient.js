import { getCreationApiErrorMessage } from "./creationClient";

async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

async function requestLoreValidationApi({
  endpoint,
  method = "GET",
  fallbackMessage,
}) {
  const response = await fetch(endpoint, {
    method,
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

export async function fetchLoreValidationState(creationId) {
  if (!creationId) throw new Error("Lore Asset id is required.");

  return requestLoreValidationApi({
    endpoint: `/api/creations/${encodeURIComponent(creationId)}/lore-validation`,
    fallbackMessage: "Lore validation status could not be loaded.",
  });
}

export async function submitLoreValidation(creationId) {
  if (!creationId) throw new Error("Lore Asset id is required.");

  return requestLoreValidationApi({
    endpoint: `/api/creations/${encodeURIComponent(creationId)}/lore-validation`,
    method: "POST",
    fallbackMessage: "Lore validation could not be submitted.",
  });
}

export async function cancelLoreValidation(creationId, submissionId) {
  if (!creationId || !submissionId) {
    throw new Error("Lore Asset and validation submission ids are required.");
  }

  return requestLoreValidationApi({
    endpoint: `/api/creations/${encodeURIComponent(
      creationId
    )}/lore-validation/${encodeURIComponent(submissionId)}/cancel`,
    method: "POST",
    fallbackMessage: "Lore validation could not be cancelled.",
  });
}


export async function publishLoreValidatedRevision(creationId, submissionId) {
  if (!creationId || !submissionId) {
    throw new Error("Lore Asset and validation submission ids are required.");
  }

  return requestLoreValidationApi({
    endpoint: `/api/creations/${encodeURIComponent(
      creationId
    )}/lore-validation/${encodeURIComponent(submissionId)}/publish`,
    method: "POST",
    fallbackMessage: "Validated Lore revision could not be published.",
  });
}
