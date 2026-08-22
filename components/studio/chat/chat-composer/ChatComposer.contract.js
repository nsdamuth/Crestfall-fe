export const CHAT_COMPOSER_VIEW_CONTRACT_VERSION = "1.0.0";

export const CHAT_COMPOSER_MODES = Object.freeze({
  DIALOGUE: "DIALOGUE",
  ACTION: "ACTION",
  OOC: "OOC",
  DIRECT: "DIRECT",
});

export const CHAT_COMPOSER_SPEAKER_ICON_KINDS = Object.freeze({
  AUTO: "auto",
  NARRATOR: "narrator",
  PARTICIPANT: "participant",
  RANDOM: "random",
});

export const CHAT_COMPOSER_DRAFT_SOFT_LIMIT = 2000;

/**
 * Portable View contract, wave C2 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-composer 1.5.0). The View owns desktop/mobile
 * composition, mobile tools disclosure, textarea sizing,
 * Enter/Shift+Enter submission, and command/mention/location menu
 * presentation. It does not receive raw story participant records and
 * does not own message submission, room state, persistence, or API
 * behavior; those stay caller-owned (wave C5's chat page shell).
 *
 * @typedef {Object} ChatComposerModeOption
 * @property {"DIALOGUE"|"ACTION"|"OOC"|"DIRECT"} value
 * @property {string} label
 *
 * @typedef {Object} ChatComposerSpeakerOption
 * @property {string} id Opaque speaker-selection value ("AUTO", "RANDOM", or a participant id).
 * @property {string} label
 * @property {"auto"|"narrator"|"participant"|"random"} iconKind
 * @property {string} avatarUrl
 *
 * @typedef {Object} ChatComposerMentionOption
 * @property {string} id
 * @property {string} label
 * @property {string} avatarUrl
 * @property {string} mentionAlias
 *
 * @typedef {Object} ChatComposerCommandOption
 * @property {string} name
 * @property {string[]} aliases
 * @property {string} description
 * @property {string} usage
 *
 * @typedef {Object} ChatComposerLocationOption
 * @property {string} runtimeEntryId
 * @property {string} label
 * @property {string[]} aliases
 * @property {string} locationScale
 * @property {string} registryTitle
 * @property {boolean} isCurrent
 *
 * @typedef {Object} ChatComposerSceneImageSeat
 * @property {boolean} available Honest absence when false; the button is not rendered.
 * @property {string} costLabel Display-ready cost, e.g. "40 coins".
 * @property {boolean} pending
 * @property {(() => void)|null} onOpenConfirm
 *
 * @typedef {Object} ChatComposerSceneImageConfirmSheet
 * @property {boolean} open
 * @property {string} costLabel
 * @property {boolean} pending
 * @property {string} error
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onCancel
 *
 * @typedef {Object} ChatComposerUseCurrentSceneSeat
 * @property {boolean} available Honest absence when false; the button is not rendered.
 * @property {boolean} pending
 * @property {(() => void)|null} onUse
 *
 * @typedef {Object} ChatComposerViewProps
 * @property {ChatComposerModeOption[]} modeOptions
 * @property {"DIALOGUE"|"ACTION"|"OOC"|"DIRECT"} mode
 * @property {ChatComposerSpeakerOption[]} speakerOptions
 * @property {string} speakerId
 * @property {string} draft
 * @property {number} draftLength
 * @property {boolean} showLengthCounter O5: no hard cap, a quiet counter past the soft threshold (2,000).
 * @property {ChatComposerMentionOption[]} mentionSuggestions
 * @property {number} highlightedMentionIndex
 * @property {ChatComposerCommandOption[]} commandSuggestions
 * @property {number} highlightedCommandIndex
 * @property {boolean} highlightedCommandExact
 * @property {ChatComposerLocationOption[]} locationSuggestions
 * @property {number} highlightedLocationIndex
 * @property {string} placeholder
 * @property {boolean} textareaDisabled
 * @property {boolean} sendDisabled
 * @property {boolean} isSending
 * @property {boolean} submitIsContinuation Whether the empty-draft AUTO action continues the scene.
 * @property {string} submitLabel
 * @property {string} submitPendingLabel
 * @property {boolean} streamingSupported O9: honest absence of the stop-generation seat until transport lands.
 * @property {boolean} isStreaming
 * @property {(() => void)|null} onStopGenerating
 * @property {ChatComposerSceneImageSeat} sceneImageSeat O10.
 * @property {ChatComposerSceneImageConfirmSheet|null} sceneImageConfirmSheet O10.
 * @property {ChatComposerUseCurrentSceneSeat} useCurrentSceneSeat O10.
 * @property {(nextValue: "DIALOGUE"|"ACTION"|"OOC"|"DIRECT") => void} onChangeMode
 * @property {(speakerId: string) => void} onChangeSpeaker
 * @property {(nextValue: string, cursorPosition: number) => void} onChangeDraft
 * @property {(value: string, cursorPosition: number) => void} onUpdateSuggestionQueries
 * @property {(direction: "next"|"previous") => void} onMoveMentionHighlight
 * @property {() => number|null} onSelectHighlightedMention
 * @property {(participantId: string) => number|null} onSelectMention
 * @property {() => void} onDismissMentionSuggestions
 * @property {(direction: "next"|"previous") => void} onMoveCommandHighlight
 * @property {() => number|null} onSelectHighlightedCommand
 * @property {(commandName: string) => number|null} onSelectCommand
 * @property {() => void} onDismissCommandSuggestions
 * @property {(direction: "next"|"previous") => void} onMoveLocationHighlight
 * @property {() => number|null} onSelectHighlightedLocation
 * @property {(runtimeEntryId: string) => number|null} onSelectLocation
 * @property {() => void} onDismissLocationSuggestions
 * @property {(options?: Object) => void} onSend
 * @property {() => void} onOpenCast
 * @property {() => void} onOpenState
 * @property {boolean} [initialToolsOpen] doc-only addition (ED1G chat
 *   family pass): consumed by MobileComposer's initial disclosure
 *   state and ChatComposer.fixtures.js; was already read by the View
 *   and fixtures but undeclared here. Default false, no prop-surface
 *   change, so no version bump.
 */
