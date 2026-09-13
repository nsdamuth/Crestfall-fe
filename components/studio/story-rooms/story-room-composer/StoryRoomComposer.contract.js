export const STORY_ROOM_COMPOSER_VIEW_CONTRACT_VERSION = "3.2.0";

/**
 * Stable UI boundary for the Story Room message composer.
 *
 * 3.2.0, fe/chat-studio brief 3 item 2 (13 Sep 2026). ADDITIVE:
 * `playerCircle` ({ label, avatarUrl, canPick, onPick }) backs the
 * player circle the View renders first on the cast row, after the scene
 * image seat and before the character circles: the selected player
 * character's avatar or initial, or "You" when none is chosen. While
 * `canPick` is true the circle is a button whose tap opens the existing
 * select player character flow; otherwise it is a plain mark. It never
 * reports a speaker: the Chassis regulator flags a player character
 * chosen as responder, and no PLAYER speaker option exists, so the
 * brief's player-as-next-speaker tap is held for Brian's ruling.
 *
 * 3.1.0, fe/chat-studio brief 2 item 11 (13 Sep 2026). ADDITIVE:
 * `onOpenStoryList` and `onOpenSettings` back two bare icon buttons the
 * View renders below md only (hidden at md and up): the story list
 * button at the far left of the cast row, before the scene image seat,
 * carrying the left rail toggle's glyph; the settings button at the far
 * right of the send row, after send. Both sheets belong to the chat
 * shell. The mobile bar's media button is retired.
 *
 * 3.0.0, fe/chat-studio brief 2 item 1 (13 Sep 2026). BREAKING: the
 * Auto circle leaves the cast row and becomes a secondary circle on the
 * send row, between the field and the gold send circle. `onAuto` runs
 * the existing continuation (the AUTO speaker, PLAYER_YIELD_TO_AUTO)
 * and never depends on the draft; `autoDisabled`, `autoLabel`, and
 * `autoPendingLabel` describe it. The send circle posts the draft only:
 * `submitIsContinuation` is removed, `submitLabel` is always "Send",
 * and `sendDisabled` is true on an empty draft. `nextSpeakerOptions`
 * still carries the "AUTO" option for the ViewModel; the View renders
 * only the cast entries.
 *
 * 2.0.0, fe/chat-studio item 2 (12 Sep 2026). BREAKING: one composer bar
 * at every width replaces the desktop and mobile compositions; the
 * mobile tools drawer, the responder overflow picker, the Next Speaker
 * and Input Mode labels, the Random speaker (iconKind "random"), the two
 * Soon scene buttons, and the old continue label are retired;
 * `onOpenCast` and `onOpenState` are removed. ADDITIVE: `sceneImageState`
 * ("soon" | "ready") and `sceneImageLabel` describe the one scene image
 * seat, disabled until the Chassis serves the operation (CR-070).
 *
 * The View owns the bar: a 44px circle per cast member and the Auto
 * circle (tap reports the speaker through onChangeNextSpeaker), the
 * input mode chip (KitDropdown, labelMode replace, the first mode as
 * the resting value), the scene image seat, the growing message field,
 * and the gold send circle. It owns textarea sizing, Enter and
 * Shift+Enter submission, and the command, mention, and location menu
 * presentation. It does not receive raw Story Room participant records
 * and does not own message submission, room state, persistence, or API
 * behavior.
 *
 * @typedef {Object} StoryRoomComposerInputModeOption
 * @property {string} value Semantic input-mode value.
 * @property {string} label Display label.
 *
 * @typedef {Object} StoryRoomComposerSpeakerOption
 * @property {string} id Opaque speaker-selection value ("AUTO" or a participant id).
 * @property {string} label Display label.
 * @property {"auto"|"narrator"|"participant"} iconKind Display icon category.
 * @property {string} [avatarUrl] Display-ready avatar URL for participants.
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
 * @property {string} placeholder "Send a message" in every mode.
 * @property {string} disabledReason User-facing explanation when chat authoring is unavailable.
 * @property {boolean} textareaDisabled
 * @property {boolean} sendDisabled
 * @property {boolean} isSending
 * @property {string} submitLabel The send circle's accessible name at rest ("Send").
 * @property {string} submitPendingLabel The send circle's accessible name while sending.
 * @property {boolean} autoDisabled
 * @property {string} autoLabel The Auto circle's accessible name at rest.
 * @property {string} autoPendingLabel The Auto circle's accessible name while sending.
 * @property {"soon"|"ready"} sceneImageState "soon" renders the scene image seat disabled.
 * @property {string} sceneImageLabel The scene image seat's accessible name.
 * @property {{ label: string, avatarUrl: string, canPick: boolean, onPick: () => void }} playerCircle The player circle: the selected player character (or "You"), a button opening the select player character flow while canPick is true.
 * @property {() => void} onAuto Runs the existing continuation with the AUTO speaker.
 * @property {() => void} onOpenStoryList Below md: opens the story list as a left sheet.
 * @property {() => void} onOpenSettings Below md: opens the story details sheet.
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
 */

export {};
