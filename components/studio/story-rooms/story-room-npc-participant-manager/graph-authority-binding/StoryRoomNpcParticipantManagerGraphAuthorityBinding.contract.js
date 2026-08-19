import {
  STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION,
} from "../StoryRoomNpcParticipantManager.contract.js";

export const STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION =
  "story_room_npc_participant_manager_graph_authority_binding_v1";

export const STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND =
  "CREATION_REF";

export const STORY_ROOM_NPC_PARTICIPANT_SECTION_STATUSES = Object.freeze([
  "LOADED",
  "PENDING",
  "AVAILABLE",
  "INACTIVE",
  "UNAVAILABLE",
]);

const SECTION_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "loaded",
    status: "LOADED",
    title: "Loaded",
    emptyMessage: "No Registry NPCs are currently present.",
    actionIconKey: "unload",
    actionLabel: "Unload",
  }),
  Object.freeze({
    id: "pending",
    status: "PENDING",
    title: "Narrative Targets",
    emptyMessage:
      "No unloaded NPCs are currently marked as needed by the story.",
    actionIconKey: "target",
    actionLabel: "Load Now",
  }),
  Object.freeze({
    id: "available",
    status: "AVAILABLE",
    title: "Available",
    emptyMessage: "No additional Registry NPCs are available.",
    actionIconKey: "load",
    actionLabel: "Load",
  }),
  Object.freeze({
    id: "inactive",
    status: "INACTIVE",
    title: "Previously Loaded",
    emptyMessage: "No Registry NPCs have been unloaded.",
    actionIconKey: "reload",
    actionLabel: "Reload",
  }),
  Object.freeze({
    id: "unavailable",
    status: "UNAVAILABLE",
    title: "Unavailable References",
    emptyMessage: "No linked Character references are unavailable.",
    actionIconKey: "unavailable",
    actionLabel: "",
  }),
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function upper(value) {
  return text(value).toUpperCase();
}

function statusDetail(entry, status) {
  if (status === "UNAVAILABLE") {
    return (
      text(entry.unavailableReason) ||
      "The linked Character could not be resolved from the authoritative creation graph."
    );
  }

  if (upper(entry.arrivalStatus) === "PENDING_ARRIVAL") {
    return "Will enter the scene on their first turn and has no knowledge of earlier scene events.";
  }

  return "";
}

function statusLabel(entry, status) {
  if (status === "UNAVAILABLE") {
    return "Unavailable";
  }

  if (upper(entry.arrivalStatus) === "PENDING_ARRIVAL") {
    return "Arriving";
  }

  return "";
}

function projectEntry(entry = {}, section = {}) {
  const source = object(entry);
  const status = upper(source.status);
  const actionId = text(source.actionId);
  const hasAction = status !== "UNAVAILABLE" && Boolean(actionId);

  return {
    actionId,
    name: text(source.name) || "Unnamed NPC",
    title: text(source.title) || "Linked Character",
    registryTitle: text(source.registryTitle),
    avatarUrl: text(source.avatarUrl),
    fallbackInitial:
      (text(source.name) || "N").slice(0, 1).toUpperCase(),
    statusLabel: statusLabel(source, status),
    statusDetail: statusDetail(source, status),
    pendingReason:
      status === "PENDING"
        ? text(source.pendingReason || source.automaticLifecycle?.pendingDriver?.reason)
        : "",
    actionLabel: hasAction ? section.actionLabel : "",
    busyLabel: hasAction ? `${section.actionLabel}ing...` : "",
    busy: hasAction && source.busy === true,
    disabled: !hasAction || source.disabled === true,
    actionTitle:
      hasAction
        ? text(source.actionTitle) || section.actionLabel
        : "",
    hasAction,
    authoritativeKind: STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND,
  };
}

function projectAuthoritativeSections(entries = []) {
  return SECTION_DEFINITIONS.map((section) => ({
    id: section.id,
    title: section.title,
    emptyMessage: section.emptyMessage,
    actionIconKey: section.actionIconKey,
    entries: entries
      .filter((entry) => upper(entry.status) === section.status)
      .map((entry) => projectEntry(entry, section)),
  }));
}

function portableCompatibleSections(authoritativeSections = []) {
  return authoritativeSections.map((section) => ({
    id: section.id,
    title: section.title,
    emptyMessage: section.emptyMessage,
    actionIconKey: section.actionIconKey,
    entries: section.entries.map((entry) => ({
      actionId: entry.actionId,
      name: entry.name,
      title: entry.title,
      registryTitle: entry.registryTitle,
      avatarUrl: entry.avatarUrl,
      fallbackInitial: entry.fallbackInitial,
      statusLabel: entry.statusLabel,
      statusDetail: entry.statusDetail,
      pendingReason: entry.pendingReason,
      actionLabel: entry.actionLabel,
      busyLabel: entry.busyLabel,
      busy: entry.busy,
      disabled: entry.disabled,
      actionTitle: entry.actionTitle,
      hasAction: entry.hasAction,
    })),
  }));
}

export function projectStoryRoomNpcParticipantManagerGraphAuthorityBinding({
  registryNpcs = {},
  loading = false,
  error = "",
  isOpen = false,
  onTogglePanel = null,
  onActivateNpc = null,
} = {}) {
  const registryState = object(registryNpcs);
  const inputEntries = array(registryState.entries);

  const authoritativeEntries = inputEntries.filter(
    (entry) =>
      upper(entry?.kind) ===
      STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND
  );

  const excludedLightweightEntries = inputEntries.filter(
    (entry) =>
      upper(entry?.kind) !==
      STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND
  );

  const authoritativeSections =
    projectAuthoritativeSections(authoritativeEntries);

  const loadedEntries =
    authoritativeSections.find((section) => section.id === "loaded")?.entries || [];

  const arrivingCount = loadedEntries.filter(
    (entry) => entry.statusLabel === "Arriving"
  ).length;

  const presentCount = Math.max(
    0,
    loadedEntries.length - arrivingCount
  );

  const pendingCount =
    authoritativeSections.find((section) => section.id === "pending")?.entries.length || 0;

  const unavailableCount =
    authoritativeSections.find((section) => section.id === "unavailable")?.entries.length || 0;

  const registryCount = Number(registryState.registryCount || 0);

  let registryNotice = "";

  if (!loading && registryCount === 0) {
    registryNotice =
      "No NPC Registry is attached to this Story or active Location.";
  } else if (!loading && registryCount > 0 && authoritativeEntries.length === 0) {
    registryNotice =
      "The attached NPC Registries do not contain any authoritative linked Character entries.";
  }

  const summaryText = `${presentCount} present${
    arrivingCount ? ` · ${arrivingCount} arriving` : ""
  }${pendingCount ? ` · ${pendingCount} pending` : ""}${
    unavailableCount ? ` · ${unavailableCount} unavailable` : ""
  }`;

  return {
    bindingContractVersion:
      STORY_ROOM_NPC_PARTICIPANT_MANAGER_GRAPH_AUTHORITY_BINDING_CONTRACT_VERSION,

    participantManagerViewContractVersion:
      STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION,

    authority: {
      includedKind:
        STORY_ROOM_NPC_PARTICIPANT_AUTHORITATIVE_KIND,
      lightweightAdHocExcluded: true,
      excludedEntryCount:
        excludedLightweightEntries.length,
      excludedEntries:
        excludedLightweightEntries.map((entry) => ({
          kind: upper(entry?.kind),
          name: text(entry?.name),
          entryId: text(entry?.entryId),
        })),
    },

    title: "Manage Registry NPCs",
    summaryText,
    loadingNotice:
      loading
        ? "Loading attached NPC Registries..."
        : "",
    registryNotice,
    errorMessage: text(error),

    authoritativeSections,

    currentPortableViewProps: {
      title: "Manage Registry NPCs",
      summaryText,
      isOpen: isOpen === true,
      loadingNotice:
        loading
          ? "Loading attached NPC Registries..."
          : "",
      registryNotice,
      errorMessage: text(error),
      sections:
        portableCompatibleSections(authoritativeSections),
      onTogglePanel:
        onTogglePanel || null,
      onActivateNpc:
        onActivateNpc || null,
    },

    functionalWiringStatus: {
      authoritativeCreationRefFiltering:
        "WIRED",
      unavailableReferenceSection:
        "WIRED",
      noActionUnavailableState:
        "WIRED",
      loadUnloadActionRouting:
        "WIRED",
    },

    unavailableReferences: {
      count: unavailableCount,
      section:
        authoritativeSections.find(
          (section) => section.id === "unavailable"
        ) || null,
      visualStatus:
        "WIRED",
      currentPortableViewLimitation:
        "",
    },

    visualExtensionStatus: {
      authoritativeCreationRefFiltering:
        "WIRED",
      unavailableReferenceSection:
        "WIRED",
    },

    architecture: {
      registryGraphResolutionOwnedByChassis: true,
      linkedCharacterAvailabilityOwnedByChassis: true,
      loadUnloadMutationOwnedByChassis: true,
      opaqueActionIdentityOwnedByChassis: true,
      lightweightNpcLifecycleSeparateFromParticipantManager: true,
      authoritativeKindFilteringOwnedByFePresentationBinding: true,
      unavailableReferencePresentationOwnedByFe: true,
    },
  };
}
