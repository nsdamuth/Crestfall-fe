export const STUDIO_ACCOUNT_PROFILE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable presentation contract for the Studio account profile editor.
 *
 * The View receives display-ready account/profile values, semantic field
 * callbacks, and application-owned content slots. It does not load or update
 * the current account, interpret API payloads, map persistence field names,
 * select Player Character records, or import other Crestfall feature Shells.
 *
 * @typedef {Object} StudioAccountProfileViewProps
 * @property {boolean} isLoading
 * @property {boolean} isSaving
 * @property {string} loadErrorMessage
 * @property {string} saveErrorMessage
 * @property {string} statusMessage
 * @property {string} profileInitial
 * @property {string} profileUsername
 * @property {string} userEmail
 * @property {boolean} hasPublicProfile
 * @property {string|null} publicProfileHref
 * @property {Object} fields
 * @property {Object|null} defaultPlayerCharacter
 * @property {boolean} hasDefaultPlayerCharacter
 * @property {boolean} [hasDefaultPlayerCharacterSelection] doc-only addition (ED1G sw12), no version bump.
 * @property {boolean} isContentPreferenceNoticeOpen
 * @property {string} contentPreferenceNoticeLabel
 * @property {import("react").ReactNode} profileMediaContent
 * @property {import("react").ReactNode} accountMetricsContent
 * @property {(event: import("react").FormEvent<HTMLFormElement>) => void} onSubmit
 * @property {(value: string) => void} onUsernameChange
 * @property {(value: string) => void} onDisplayNameChange
 * @property {(value: string) => void} onContactEmailChange
 * @property {(value: string) => void} onTaglineChange
 * @property {(value: string) => void} onDescriptionChange
 * @property {(value: string) => void} onAnnouncementChange
 * @property {(value: string) => void} onContentPreferenceChange
 * @property {() => void} onCloseContentPreferenceNotice
 * @property {() => void} onOpenDefaultPlayerCharacterPicker
 * @property {() => void} onClearDefaultPlayerCharacter
 */

export {};
