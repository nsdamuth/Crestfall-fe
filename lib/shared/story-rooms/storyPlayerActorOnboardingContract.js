export const STORY_PLAYER_ACTOR_ONBOARDING_VERSION =
  "story_player_actor_onboarding_v1";
export const STORY_PLAYER_ACTOR_ONBOARDING_SOURCE =
  "STORY_ROOM_PLAYER_CHARACTER_CREATOR";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function buildStoryPlayerActorOnboardingContext({ roomId } = {}) {
  const safeRoomId = normalizeString(roomId);
  if (!safeRoomId) return null;

  return {
    version: STORY_PLAYER_ACTOR_ONBOARDING_VERSION,
    source: STORY_PLAYER_ACTOR_ONBOARDING_SOURCE,
    roomId: safeRoomId,
  };
}

export function normalizeStoryPlayerActorOnboardingContext(value = {}) {
  const source = normalizeObject(value);

  return {
    version: normalizeString(source.version),
    source: normalizeString(source.source).toUpperCase(),
    roomId: normalizeString(source.roomId || source.room_id),
  };
}

export function getStoryPlayerActorOnboardingContextFromCreation(creation = {}) {
  const data = normalizeObject(creation?.data);
  const context = normalizeStoryPlayerActorOnboardingContext(
    data.story_player_actor_onboarding || data.storyPlayerActorOnboarding
  );

  if (
    context.version !== STORY_PLAYER_ACTOR_ONBOARDING_VERSION ||
    context.source !== STORY_PLAYER_ACTOR_ONBOARDING_SOURCE ||
    !context.roomId
  ) {
    return null;
  }

  return context;
}

export function isStoryPlayerActorOnboardingCreationForRoom(
  creation,
  roomId
) {
  const context = getStoryPlayerActorOnboardingContextFromCreation(creation);
  return Boolean(context && context.roomId === normalizeString(roomId));
}
export function isStoryPlayerActorOnboardingCreationEligibleForRoom({
  creation,
  room,
} = {}) {
  const roomId = normalizeString(room?.id || room?.rowId || room?.row_id);
  if (!roomId || !creation) return false;

  if (isStoryPlayerActorOnboardingCreationForRoom(creation, roomId)) {
    return true;
  }

  const creationCreatedAt = Date.parse(
    normalizeString(creation?.createdAt || creation?.created_at)
  );
  const roomCreatedAt = Date.parse(
    normalizeString(room?.createdAt || room?.created_at)
  );

  return (
    Number.isFinite(creationCreatedAt) &&
    Number.isFinite(roomCreatedAt) &&
    creationCreatedAt >= roomCreatedAt
  );
}

export function isStoryPlayerActorOnboardingUnresolved({
  playerCharacterLaunch = {},
  participants = [],
} = {}) {
  const launch = normalizeObject(playerCharacterLaunch);
  const onboardingStatus = normalizeString(
    launch.onboardingStatus || launch.onboarding_status
  ).toUpperCase();
  const mode = normalizeString(launch.mode).toUpperCase();
  const playerCharacterId = normalizeString(
    launch.playerCharacterId || launch.player_character_id
  );
  const hasPlayerCharacter = (Array.isArray(participants) ? participants : []).some(
    (participant) =>
      normalizeString(participant?.participantType || participant?.participant_type).toUpperCase() ===
      "PLAYER_CHARACTER"
  );

  return (
    onboardingStatus === "UNRESOLVED" &&
    mode !== "NONE" &&
    !playerCharacterId &&
    !hasPlayerCharacter
  );
}
