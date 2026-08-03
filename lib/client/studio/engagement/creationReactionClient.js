async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getEngagementApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function fetchCreationReactions(
  creationIds = [],
  fallbackMessage = "Creation reactions could not be loaded."
) {
  const uniqueIds = [...new Set(creationIds.filter(Boolean))];

  if (!uniqueIds.length) {
    return [];
  }

  const params = new URLSearchParams({
    creationIds: uniqueIds.join(","),
  });

  const response = await fetch(
    `/api/engagement/creation-reactions?${params.toString()}`,
    {
      method: "GET",
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getEngagementApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.reactions || [];
}

export async function setCreationReaction(
  { creationId, reactionType, active },
  fallbackMessage = "Creation reaction could not be saved."
) {
  const response = await fetch("/api/engagement/creation-reactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creationId,
      reactionType,
      active,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getEngagementApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.reaction || null;
}

export function setCreationLike(creationId, active) {
  return setCreationReaction({
    creationId,
    reactionType: "LIKE",
    active,
  });
}

export function setCreationBookmark(creationId, active) {
  return setCreationReaction({
    creationId,
    reactionType: "BOOKMARK",
    active,
  });
}