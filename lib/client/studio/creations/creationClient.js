async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

export function getCreationApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestCreationApi({
  endpoint,
  method = "GET",
  body,
  fallbackMessage,
  cache,
}) {
  const response = await fetch(endpoint, {
    method,
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    const error = new Error(
      getCreationApiErrorMessage(payload, fallbackMessage)
    );

    error.status = response.status;
    error.code = payload?.error?.code || null;
    error.details = payload?.error?.details || null;

    throw error;
  }

  return payload;
}

export async function fetchOwnedCreations(
  filters = {},
  fallbackMessage = "Creations could not be loaded."
) {
  const searchParams = new URLSearchParams();

  if (filters.type) {
    searchParams.set("type", filters.type);
  }

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/creations?${queryString}`
    : "/api/creations";

  const payload = await requestCreationApi({
    endpoint,
    method: "GET",
    fallbackMessage,
  });

  return payload?.data?.creations || [];
}

export async function fetchCommunityCreations(filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.type) {
    searchParams.set("type", filters.type);
  }

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/community/creations?${queryString}`
    : "/api/community/creations";

  const payload = await requestCreationApi({
    endpoint,
    method: "GET",
    fallbackMessage: "Community creations could not be loaded.",
    cache: "no-store",
  });

  return (
    payload?.data?.creations ||
    payload?.creations ||
    payload?.data?.items ||
    payload?.items ||
    []
  );
}
export async function fetchCreationPreview(
  creationId,
  fallbackMessage = "Creation preview could not be loaded."
) {
  if (!creationId) {
    throw new Error("Creation id is required.");
  }

  const payload = await requestCreationApi({
    endpoint: `/api/creations/${encodeURIComponent(creationId)}/preview`,
    method: "GET",
    fallbackMessage,
    cache: "no-store",
  });

  return payload?.data || null;
}

export async function fetchOwnedCreation(
  creationId,
  fallbackMessage = "Creation could not be loaded."
) {
  if (!creationId) {
    throw new Error("Creation id is required.");
  }

  const payload = await requestCreationApi({
    endpoint: `/api/creations/${creationId}`,
    method: "GET",
    fallbackMessage,
  });

  return payload?.data?.creation || payload?.creation || null;
}
export async function createCreationDraft(
  creationPayload,
  fallbackMessage = "Creation draft could not be saved."
) {
  return requestCreationApi({
    endpoint: "/api/creations",
    method: "POST",
    body: creationPayload,
    fallbackMessage,
  });
}

export async function updateCreationDraft(
  creationId,
  creationPayload,
  fallbackMessage = "Creation could not be saved."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}`,
    method: "PATCH",
    body: creationPayload,
    fallbackMessage,
  });
}

export async function cancelCreationReview(
  creationId,
  fallbackMessage = "Review could not be cancelled."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/cancel-review`,
    method: "POST",
    fallbackMessage,
  });
}

export async function moveCreationToInternalEditing(
  creationId,
  fallbackMessage = "Creation could not be moved to internal editing."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/move-to-internal-editing`,
    method: "POST",
    fallbackMessage,
  });
}

export async function submitCreationReview(
  creationId,
  reviewType,
  fallbackMessage = "Creation could not be submitted."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/submit-review`,
    method: "POST",
    body: {
      reviewType,
    },
    fallbackMessage,
  });
}

export async function archiveCreation(
  creationId,
  fallbackMessage = "Creation could not be archived."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/archive`,
    method: "POST",
    fallbackMessage,
  });
}
export async function deleteCreation(
  creationId,
  fallbackMessage = "Creation could not be deleted."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}`,
    method: "DELETE",
    fallbackMessage,
  });
}
export async function fetchCreationImageLibrary(
  creationId,
  fallbackMessage = "Image library could not be loaded."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/image-library`,
    method: "GET",
    fallbackMessage,
  });
}

export async function setCreationFeaturedImageSlot(
  creationId,
  slotKey,
  libraryEntryId,
  fallbackMessage = "Featured image slot could not be saved."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/featured-image-slots/${slotKey}`,
    method: "PUT",
    body: {
      libraryEntryId,
    },
    fallbackMessage,
  });
}

export async function updateCreationImageLibraryEntry(
  creationId,
  entryId,
  { libraryVisibility },
  fallbackMessage = "Image library entry could not be updated."
) {
  return requestCreationApi({
    endpoint: `/api/creations/${creationId}/image-library/${entryId}`,
    method: "PATCH",
    body: {
      libraryVisibility,
    },
    fallbackMessage,
  });
}