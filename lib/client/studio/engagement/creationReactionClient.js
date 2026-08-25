async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getEngagementApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

const MAX_CREATION_REACTION_IDS_PER_REQUEST = 100;

async function requestCreationReactions(
  creationIds = null,
  fallbackMessage = "Creation reactions could not be loaded."
) {
  const params = new URLSearchParams();

  if (Array.isArray(creationIds) && creationIds.length) {
    params.set("creationIds", creationIds.join(","));
  }

  const query = params.toString();
  const endpoint = query
    ? `/api/engagement/creation-reactions?${query}`
    : "/api/engagement/creation-reactions";

  const response = await fetch(endpoint, {
    method: "GET",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getEngagementApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.reactions || [];
}

export async function fetchCreationReactions(
  creationIds = [],
  fallbackMessage = "Creation reactions could not be loaded."
) {
  const uniqueIds = [...new Set(creationIds.filter(Boolean))];

  if (!uniqueIds.length) {
    return [];
  }

  const batches = [];

  for (
    let index = 0;
    index < uniqueIds.length;
    index += MAX_CREATION_REACTION_IDS_PER_REQUEST
  ) {
    batches.push(
      uniqueIds.slice(index, index + MAX_CREATION_REACTION_IDS_PER_REQUEST)
    );
  }

  const results = await Promise.all(
    batches.map((batch) => requestCreationReactions(batch, fallbackMessage))
  );

  return results.flat();
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
