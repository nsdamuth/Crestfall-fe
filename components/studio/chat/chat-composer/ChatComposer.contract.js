export const CHAT_COMPOSER_VIEW_CONTRACT_VERSION = "2.2.0";

export const CHAT_COMPOSER_MODES = Object.freeze({
  DIALOGUE: "DIALOGUE",
  ACTION: "ACTION",
  THOUGHT: "THOUGHT",
  SUGGESTION: "SUGGESTION",
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
 * Portable View contract, wave C2 (docs/plans/FABLE-GATE-PLAN.md),
 * RESHAPED 2.0.0 (23 Aug 2026, build-0823 pass 2): one action-bar grid
 * at both breakpoints, [menu][Auto][Party][Dialogue with disclosure],
 * replacing the "Next Speaker" row, the full speaker-selection strip,
 * and the mode-segmented-control column. `modeOptions` is REMOVED (the
 * View owns its own fixed Dialogue/Action/Suggestion picker); `mode`,
 * `onChangeMode`, `speakerId`, and `onChangeSpeaker` remain (Auto
 * routes through onChangeSpeaker("AUTO")). `speakerOptions` and
 * `initialToolsOpen` are REMOVED (the mobile tools sheet no longer
 * exists; Party/Menu/Dialogue chips replace it). The View owns
 * textarea sizing, Enter/Shift+Enter submission, and
 * command/mention/location menu presentation. It does not receive raw
 * story participant records and does not own message submission, room
 * state, persistence, or API behavior; those stay caller-owned (wave
 * C5's chat page shell).
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
 * @property {"DIALOGUE"|"ACTION"|"THOUGHT"|"SUGGESTION"|"OOC"|"DIRECT"} mode
 * @property {string} speakerId Read by the Auto chip's active state only; no options row renders.
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
 * @property {(nextValue: "DIALOGUE"|"ACTION"|"THOUGHT"|"SUGGESTION") => void} onChangeMode Fired only for the chip-presented modes; OOC/DIRECT stay contract-legal but unreachable from this chip.
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
 * @property {() => void} onOpenCast Party chip: opens the left party panel.
 * @property {() => void} onOpenState Menu chip: opens the right story/state panel.
 */
