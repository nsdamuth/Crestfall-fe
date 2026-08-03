async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getEngagementApiErrorMessage(payload, fallbackMessage) {
  return payload?.error?.message || payload?.message || fallbackMessage;
}

export async function fetchProfileReactions(
  profileIds = [],
  fallbackMessage = "Creator reactions could not be loaded."
) {
  const uniqueIds = [...new Set(profileIds.filter(Boolean))];

  if (!uniqueIds.length) {
    return [];
  }

  const params = new URLSearchParams({
    profileIds: uniqueIds.join(","),
  });

  const response = await fetch(
    `/api/engagement/profile-reactions?${params.toString()}`,
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

export async function setProfileReaction(
  { profileId, reactionType, active },
  fallbackMessage = "Creator reaction could not be saved."
) {
  const response = await fetch("/api/engagement/profile-reactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profileId,
      reactionType,
      active,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getEngagementApiErrorMessage(payload, fallbackMessage));
  }

  return payload?.data || null;
}

export function setProfileLike(profileId, active) {
  return setProfileReaction({
    profileId,
    reactionType: "LIKE",
    active,
  });
}

export function setProfileBookmark(profileId, active) {
  return setProfileReaction({
    profileId,
    reactionType: "BOOKMARK",
    active,
  });
}

export function setProfileFollow(profileId, active) {
  return setProfileReaction({
    profileId,
    reactionType: "FOLLOW",
    active,
  });
}