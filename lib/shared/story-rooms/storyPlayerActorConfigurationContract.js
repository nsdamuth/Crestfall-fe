export const STORY_PLAYER_ACTOR_CONFIGURATION_VERSION =
  "story_player_actor_configuration_v1";
export const STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES = Object.freeze({
  READY: "READY",
  REQUIRED: "CONFIGURATION_REQUIRED",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}
function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}
function getConfigurationStatus(plan = {}) {
  const source = normalizeObject(plan);
  return normalizeArray(source.attachmentDomains).length ||
    normalizeArray(source.configurationDomains).length
    ? STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES.REQUIRED
    : STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES.READY;
}

export function buildStoryPlayerActorConfigurationDescriptor({
  actorMode = "SAVED_PLAYER_CHARACTER",
  participantId = null,
  playerCharacterId = null,
  sourceTemplateId = null,
  configurationPlan = null,
} = {}) {
  const plan = normalizeObject(configurationPlan);
  return {
    version: STORY_PLAYER_ACTOR_CONFIGURATION_VERSION,
    actorMode: normalizeUpper(actorMode) || "SAVED_PLAYER_CHARACTER",
    participantId: normalizeString(participantId) || null,
    playerCharacterId: normalizeString(playerCharacterId) || null,
    sourceTemplateId: normalizeString(sourceTemplateId) || null,
    configurationStatus: getConfigurationStatus(plan),
    configurationPlan: Object.keys(plan).length ? plan : null,
  };
}

export function getStoryPlayerActorConfigurationDescriptor({ room = null, state = null } = {}) {
  const roomData = normalizeObject(room?.data);
  const stateData = normalizeObject(state?.state || state);
  const direct = normalizeObject(
    roomData.playerActorConfiguration ||
      roomData.player_actor_configuration ||
      stateData.playerActorConfiguration ||
      stateData.player_actor_configuration
  );
  if (Object.keys(direct).length) return direct;

  const launch = normalizeObject(
    roomData.playerCharacterLaunch ||
      roomData.player_character_launch ||
      stateData.playerCharacterLaunch ||
      stateData.player_character_launch
  );
  let plan = normalizeObject(
    launch.characterConfigurationPlan || launch.character_configuration_plan
  );
  if (!Object.keys(plan).length) {
    const temporary = normalizeObject(
      roomData.temporaryPlayerActor ||
        roomData.temporary_player_actor ||
        stateData.temporaryPlayerActor ||
        stateData.temporary_player_actor
    );
    const temporaryPlan = normalizeObject(temporary.configurationPlan);
    if (Object.keys(temporaryPlan).length) {
      return buildStoryPlayerActorConfigurationDescriptor({
        actorMode: "TEMPORARY_ROOM_ACTOR",
        participantId: temporary.participantId,
        playerCharacterId: null,
        sourceTemplateId: temporary.sourceTemplateId,
        configurationPlan: temporaryPlan,
      });
    }
    return null;
  }

  const playerCharacter = normalizeObject(stateData.playerCharacter);
  return buildStoryPlayerActorConfigurationDescriptor({
    actorMode: launch.actorMode || launch.actor_mode,
    participantId: playerCharacter.participantId || playerCharacter.participant_id,
    playerCharacterId:
      launch.playerCharacterId || launch.player_character_id || playerCharacter.playerCharacterId,
    sourceTemplateId: normalizeObject(roomData.source).templateId,
    configurationPlan: plan,
  });
}

export function isStoryPlayerActorConfigurationRequired(value = null) {
  return (
    normalizeUpper(normalizeObject(value).configurationStatus) ===
    STORY_PLAYER_ACTOR_CONFIGURATION_STATUSES.REQUIRED
  );
}

export function markStoryPlayerActorConfigurationDomainReady({
  descriptor = null,
  domain = "",
} = {}) {
  const source = normalizeObject(descriptor);
  const normalizedDomain = normalizeUpper(domain);
  if (!normalizedDomain || !Object.keys(source).length) return source;
  const plan = normalizeObject(source.configurationPlan);
  const attachmentDomains = normalizeArray(plan.attachmentDomains)
    .map(normalizeUpper)
    .filter((value) => value && value !== normalizedDomain);
  const configurationDomains = normalizeArray(plan.configurationDomains)
    .map(normalizeUpper)
    .filter((value) => value && value !== normalizedDomain);
  const configuredDomains = [
    ...new Set([
      ...normalizeArray(plan.configuredDomains).map(normalizeUpper).filter(Boolean),
      normalizedDomain,
    ]),
  ];
  const canEnterPlay = attachmentDomains.length === 0 && configurationDomains.length === 0;
  const nextPlan = {
    ...plan,
    status: canEnterPlay ? "READY" : plan.status,
    attachmentDomains,
    configurationDomains,
    attachmentRequired: attachmentDomains.length > 0,
    configurationRequired: configurationDomains.length > 0,
    configuredDomains,
    canEnterPlay,
  };
  return {
    ...source,
    configurationStatus: getConfigurationStatus(nextPlan),
    configurationPlan: nextPlan,
  };
}
