export const STORY_CHAT_CANONICAL_ROUTE_PREFIX = "/studio/v2/stories";
export const STORY_CHAT_LEGACY_ROUTE_PREFIX = "/studio/story-rooms";

function normalizeRoomId(roomId) {
  return String(roomId ?? "").trim();
}

export function buildStoryChatHref(roomId) {
  const normalizedRoomId = normalizeRoomId(roomId);
  if (!normalizedRoomId) return "";

  return `${STORY_CHAT_CANONICAL_ROUTE_PREFIX}/${encodeURIComponent(normalizedRoomId)}`;
}

export function buildLegacyStoryChatHref(roomId) {
  const normalizedRoomId = normalizeRoomId(roomId);
  if (!normalizedRoomId) return "";

  return `${STORY_CHAT_LEGACY_ROUTE_PREFIX}/${encodeURIComponent(normalizedRoomId)}`;
}

export function buildStoryCharacterConfigurationHref(roomId) {
  const storyHref = buildStoryChatHref(roomId);
  return storyHref ? `${storyHref}/character-configuration` : "";
}

export function buildLegacyStoryCharacterConfigurationHref(roomId) {
  const storyHref = buildLegacyStoryChatHref(roomId);
  return storyHref ? `${storyHref}/character-configuration` : "";
}
