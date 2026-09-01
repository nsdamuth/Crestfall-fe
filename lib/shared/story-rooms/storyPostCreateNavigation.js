import {
  STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES,
  getStoryPlayerActorConfigurationDescriptor,
  isStoryPlayerActorConfigurationRequired,
} from "./storyPlayerActorConfigurationContract.js";
import { buildStoryChatHref } from "./storyRoomRouteAuthority.js";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function getExplicitConfigurationStatuses(room = null) {
  const roomData = normalizeObject(room?.data);
  const playerActorConfiguration = normalizeObject(
    roomData.playerActorConfiguration || roomData.player_actor_configuration
  );
  const playerCharacterLaunch = normalizeObject(
    roomData.playerCharacterLaunch || roomData.player_character_launch
  );
  const temporaryPlayerActor = normalizeObject(
    roomData.temporaryPlayerActor || roomData.temporary_player_actor
  );

  return [
    playerActorConfiguration.configurationStatus ||
      playerActorConfiguration.configuration_status,
    playerCharacterLaunch.configurationStatus ||
      playerCharacterLaunch.configuration_status,
    temporaryPlayerActor.configurationStatus ||
      temporaryPlayerActor.configuration_status,
  ]
    .map(normalizeUpper)
    .filter(Boolean);
}

export function isStoryPostCreateCharacterConfigurationRequired(room = null) {
  const requiredStatus = STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES.REQUIRED;
  if (getExplicitConfigurationStatuses(room).includes(requiredStatus)) {
    return true;
  }

  const descriptor = getStoryPlayerActorConfigurationDescriptor({ room });
  return isStoryPlayerActorConfigurationRequired(descriptor);
}

export function resolveStoryPostCreateNavigationHref({ room = null, roomId = null } = {}) {
  const resolvedRoomId = normalizeString(roomId || room?.id);
  if (!resolvedRoomId) return "";

  const encodedRoomId = encodeURIComponent(resolvedRoomId);
  return isStoryPostCreateCharacterConfigurationRequired(room)
    ? `/studio/story-rooms/${encodedRoomId}/character-configuration`
    : buildStoryChatHref(resolvedRoomId);
}
