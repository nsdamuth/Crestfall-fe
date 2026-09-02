export const STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION = "1.5.0";

/**
 * Stable UI boundary for the Story Room message composer.
 *
 * The View owns desktop/mobile composition, disclosure of mobile tools,
 * textarea sizing, Enter/Shift+Enter submission behavior, command/mention-menu presentation, and disabled future-tool
 * placeholders. It does not receive raw Story Room participant records and
 * does not own message submission, room state, persistence, or API behavior.
 *
 * @typedef {Object} StoryRoomComposerInputModeOption
 * @property {string} value Semantic input-mode value.
 * @property {string} label Display label.
 *
 * @typedef {Object} StoryRoomComposerSpeakerOption
 * @property {string} id Opaque speaker-selection value.
 * @property {string} label Display label.
 * @property {"auto"|"narrator"|"participant"|"random"} iconKind Display icon category.
 *
 * @typedef {Object} StoryRoomComposerMention
 * @property {string} participantId Opaque participant identifier.
 * @property {string} displayName Display-ready participant name.
 * @property {string} mentionText Exact mention text present in the draft.
 *
 * @typedef {Object} StoryRoomComposerMentionOption
 * @property {string} id Opaque participant identifier.
 * @property {string} label Display-ready participant name.
 * @property {string} avatarUrl Optional display-ready avatar URL.
 * @property {string} mentionAlias Display-ready short mention hint.
 *
 * @typedef {Object} StoryRoomComposerViewProps
 * @property {StoryRoomComposerInputModeOption[]} inputModeOptions
 * @property {string} inputMode
 * @property {StoryRoomComposerSpeakerOption[]} nextSpeakerOptions
 * @property {string} nextSpeaker
 * @property {string} draft
 * @property {StoryRoomComposerMentionOption[]} mentionSuggestions
 * @property {number} highlightedMentionIndex
 * @property {Object[]} commandSuggestions Filtered display-ready command definitions.
 * @property {number} highlightedCommandIndex
 * @property {boolean} highlightedCommandExact Whether Enter should execute the exact selected command.
 * @property {Object[]} locationSuggestions Filtered display-ready Location Registry options.
 * @property {number} highlightedLocationIndex
 * @property {string} placeholder
 * @property {string} disabledReason User-facing explanation when chat authoring is unavailable.
 * @property {boolean} textareaDisabled
 * @property {boolean} sendDisabled
 * @property {boolean} isSending
 * @property {boolean} submitIsContinuation Whether the empty AUTO action continues the scene.
 * @property {string} submitLabel Idle submit-action label.
 * @property {string} submitPendingLabel In-flight submit-action label.
 * @property {(nextValue: string) => void} onChangeInputMode
 * @property {(speakerId: string) => void} onChangeNextSpeaker
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
 */

export {};
