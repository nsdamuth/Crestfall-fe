
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeImageOutputId(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return UUID_PATTERN.test(normalized)
    ? normalized
    : null;
}

function normalizeImageOutputIds(values = []) {
  return [
    ...new Set(
      (Array.isArray(values) ? values : [])
        .map(normalizeImageOutputId)
        .filter(Boolean)
    ),
  ];
}
async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

export function getMediaReactionApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function fetchMediaReactions(
  imageOutputIds = [],
  fallbackMessage = "Media reactions could not be loaded."
) {
  const uniqueIds =
    normalizeImageOutputIds(imageOutputIds);

  if (!uniqueIds.length) {
    return [];
  }

  const params = new URLSearchParams({
    imageOutputIds: uniqueIds.join(","),
  });

  const response = await fetch(`/api/media/reactions?${params.toString()}`, {
    method: "GET",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getMediaReactionApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.reactions || [];
}

export async function setMediaReaction(
  { imageOutputId, reactionType, active },
  fallbackMessage = "Media reaction could not be saved."
) {
  const normalizedImageOutputId =
  normalizeImageOutputId(imageOutputId);

  if (!normalizedImageOutputId) {
    throw new Error(
      "A persisted image output id is required."
    );
  }
  const response = await fetch("/api/media/reactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageOutputId: normalizedImageOutputId,
      reactionType,
      active,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getMediaReactionApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data?.reaction || null;
}

export function setMediaLike(imageOutputId, active) {
  return setMediaReaction({
    imageOutputId,
    reactionType: "LIKE",
    active,
  });
}

export function setMediaBookmark(imageOutputId, active) {
  return setMediaReaction({
    imageOutputId,
    reactionType: "BOOKMARK",
    active,
  });
}