export const STORY_ROOM_RUNTIME_MECHANICS_PANEL_VIEW_CONTRACT_VERSION =
  "1.0.0";

export const STORY_ROOM_RUNTIME_MECHANICS_PANEL_OWNERSHIP = Object.freeze({
  ownsMechanicsModulePicker: "Binding Shell",
  ownsStoryRoomClientMutations: "ViewModel",
  ownsRawRoomBindingCompatibility: "ViewModel",
  ownsBindingPayloadComposition: "ViewModel",
  ownsRuntimePanelPresentation: "Portable View",
  ownsCoreMechanicsModuleAbstraction: "Deferred Mechanics work",
});

/**
 * Display-ready attached Mechanics Module information.
 *
 * @typedef {Object} StoryRoomRuntimeMechanicsBindingViewItem
 * @property {string} title
 * @property {string} creationId
 * @property {string} moduleId
 * @property {string} trigger
 * @property {"STORY_ROOM"|"BINDING_OWNER"} scopeMode
 * @property {boolean} enabled
 * @property {number} priority
 */

/**
 * Stable boundary for the portable Story Room Runtime Mechanics Panel View.
 *
 * The View must not know Story Room JSONB compatibility, Mechanics Module
 * Creation payloads, Story Room clients, room reload orchestration, picker
 * loading, PostGraphile, or persistence. It receives display-ready state and
 * emits semantic attach, remove, enable, scope, and priority intents.
 *
 * @typedef {Object} StoryRoomRuntimeMechanicsPanelViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {StoryRoomRuntimeMechanicsBindingViewItem|null} binding
 * @property {string} attachActionLabel
 * @property {boolean} saving
 * @property {string} savingMessage
 * @property {string} statusMessage
 * @property {string} errorMessage
 * @property {import("react").ReactNode|null} pickerContent
 * @property {(() => void)|null} onOpenPicker
 * @property {(() => void)|null} onRemove
 * @property {((enabled: boolean) => void)|null} onToggleEnabled
 * @property {((scopeMode: string) => void)|null} onChangeScopeMode
 * @property {((priority: string|number) => void)|null} onChangePriority
 */

export {};
