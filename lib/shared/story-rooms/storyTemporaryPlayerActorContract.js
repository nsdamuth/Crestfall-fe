export const STORY_TEMPORARY_PLAYER_ACTOR_VERSION =
  "story_temporary_player_actor_v1";
export const STORY_TEMPORARY_PLAYER_ACTOR_SOURCE =
  "STORY_ROOM_TEMPORARY_PLAYER_ACTOR";

export const STORY_TEMPORARY_PLAYER_ACTOR_CONFIGURATION_STATUSES = Object.freeze({
  READY: "READY",
  REQUIRED: "CONFIGURATION_REQUIRED",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getConfigurationStatus(configurationPlan = {}) {
  const plan = normalizeObject(configurationPlan);
  const attachmentDomains = normalizeArray(plan.attachmentDomains).filter(Boolean);
  const configurationDomains = normalizeArray(plan.configurationDomains).filter(Boolean);

  return attachmentDomains.length || configurationDomains.length
    ? STORY_TEMPORARY_PLAYER_ACTOR_CONFIGURATION_STATUSES.REQUIRED
    : STORY_TEMPORARY_PLAYER_ACTOR_CONFIGURATION_STATUSES.READY;
}

export function buildStoryTemporaryPlayerActorDescriptor({
  participantId = null,
  sourceTemplateId = null,
  configurationPlan = null,
} = {}) {
  const plan = normalizeObject(configurationPlan);

  return {
    version: STORY_TEMPORARY_PLAYER_ACTOR_VERSION,
    source: STORY_TEMPORARY_PLAYER_ACTOR_SOURCE,
    participantId: normalizeString(participantId) || null,
    sourceTemplateId: normalizeString(sourceTemplateId) || null,
    actorType: "PLAYER_CHARACTER",
    actorMode: "TEMPORARY_ROOM_ACTOR",
    persistentCreationId: null,
    configurationStatus: getConfigurationStatus(plan),
    configurationPlan: Object.keys(plan).length ? plan : null,
  };
}

export function buildStoryTemporaryPlayerActorParticipantMetadata({
  controlledByUserId = null,
  sourceTemplateId = null,
  configurationPlan = null,
} = {}) {
  const descriptor = buildStoryTemporaryPlayerActorDescriptor({
    sourceTemplateId,
    configurationPlan,
  });

  return {
    source: STORY_TEMPORARY_PLAYER_ACTOR_SOURCE,
    temporaryPlayerActor: true,
    controlledByUserId: normalizeString(controlledByUserId) || null,
    sourceTemplateId: normalizeString(sourceTemplateId) || null,
    characterConfiguration: {
      version: descriptor.version,
      status: descriptor.configurationStatus,
      plan: descriptor.configurationPlan,
    },
  };
}

export function isStoryTemporaryPlayerActorParticipant(participant = {}) {
  const source = normalizeObject(participant);
  const metadata = normalizeObject(source.metadata);

  return (
    normalizeString(source.participantType).toUpperCase() === "PLAYER_CHARACTER" &&
    !normalizeString(source.creationId || source.creation_id) &&
    (metadata.temporaryPlayerActor === true ||
      normalizeString(metadata.source).toUpperCase() ===
        STORY_TEMPORARY_PLAYER_ACTOR_SOURCE)
  );
}

export function findStoryTemporaryPlayerActorParticipant(participants = []) {
  return normalizeArray(participants).find(isStoryTemporaryPlayerActorParticipant) || null;
}

export function getStoryTemporaryPlayerActorDescriptor({ room = null, state = null } = {}) {
  const roomData = normalizeObject(room?.data);
  const stateData = normalizeObject(state?.state || state);
  const value = normalizeObject(
    roomData.temporaryPlayerActor ||
      roomData.temporary_player_actor ||
      stateData.temporaryPlayerActor ||
      stateData.temporary_player_actor
  );

  return Object.keys(value).length ? value : null;
}

export function isStoryTemporaryPlayerActorConfigurationRequired(value = null) {
  const descriptor = normalizeObject(value);
  return (
    normalizeString(descriptor.source).toUpperCase() ===
      STORY_TEMPORARY_PLAYER_ACTOR_SOURCE &&
    normalizeString(descriptor.configurationStatus).toUpperCase() ===
      STORY_TEMPORARY_PLAYER_ACTOR_CONFIGURATION_STATUSES.REQUIRED
  );
}

export function markStoryTemporaryPlayerActorDomainReady({
  descriptor = null,
  domain = "",
} = {}) {
  const source = normalizeObject(descriptor);
  const normalizedDomain = normalizeString(domain).toUpperCase();
  if (!normalizedDomain || !Object.keys(source).length) return source;

  const plan = normalizeObject(source.configurationPlan);
  const attachmentDomains = normalizeArray(plan.attachmentDomains)
    .map((value) => normalizeString(value).toUpperCase())
    .filter((value) => value && value !== normalizedDomain);
  const configurationDomains = normalizeArray(plan.configurationDomains)
    .map((value) => normalizeString(value).toUpperCase())
    .filter((value) => value && value !== normalizedDomain);
  const configuredDomains = [
    ...new Set([
      ...normalizeArray(plan.configuredDomains)
        .map((value) => normalizeString(value).toUpperCase())
        .filter(Boolean),
      normalizedDomain,
    ]),
  ];
  const canEnterPlay =
    attachmentDomains.length === 0 && configurationDomains.length === 0;
  const configurationPlan = {
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
    configurationStatus: getConfigurationStatus(configurationPlan),
    configurationPlan,
  };
}
