export const CHAT_NPC_MANAGER_VIEW_CONTRACT_VERSION = "1.1.0";

export const CHAT_NPC_MANAGER_SECTION_IDS = Object.freeze({
  LOADED: "loaded",
  TARGETS: "pending",
  AVAILABLE: "available",
  PREVIOUSLY_LOADED: "inactive",
  UNAVAILABLE: "unavailable",
});

export const CHAT_NPC_MANAGER_ACTION_ICON_KEYS = Object.freeze({
  UNLOAD: "unload",
  TARGET: "target",
  LOAD: "load",
  RELOAD: "reload",
  UNAVAILABLE: "unavailable",
});

/**
 * Portable View contract, wave C3 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-npc-participant-manager 1.0.0). The View owns disclosure,
 * section presentation, and per-entry action buttons; it does not know
 * registry lifecycle response shapes, registry or participant ids, or
 * load/unload API ownership.
 *
 * @typedef {Object} ChatNpcManagerEntry
 * @property {string} actionId Opaque View action identifier.
 * @property {string} name
 * @property {string} title
 * @property {string} registryTitle
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} statusLabel
 * @property {string} statusDetail
 * @property {string} pendingReason
 * @property {string} actionLabel
 * @property {string} busyLabel
 * @property {boolean} busy
 * @property {boolean} disabled
 * @property {string} actionTitle
 * @property {boolean} hasAction False for informational/degraded rows such as unavailable linked-Character references.
 *
 * @typedef {Object} ChatNpcManagerSection
 * @property {string} id one of CHAT_NPC_MANAGER_SECTION_IDS
 * @property {string} title
 * @property {string} emptyMessage
 * @property {"unload"|"target"|"load"|"reload"|"unavailable"} actionIconKey
 * @property {ChatNpcManagerEntry[]} entries
 *
 * @typedef {Object} ChatNpcManagerViewProps
 * @property {string} title
 * @property {string} summaryText
 * @property {boolean} isOpen
 * @property {string} loadingNotice
 * @property {string} registryNotice
 * @property {string} errorMessage
 * @property {ChatNpcManagerSection[]} sections The lifecycle sections: Loaded/Unload, Narrative Targets/Load Now, Available/Load, Previously Loaded/Reload, plus informational Unavailable References when authoritative linked Characters cannot be resolved.
 * @property {(() => void)|null} onTogglePanel
 * @property {((actionId: string) => void)|null} onActivateNpc
 */
