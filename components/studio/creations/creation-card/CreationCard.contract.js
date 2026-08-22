export const CREATION_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for a Crestfall creation catalogue card.
 *
 * The View receives only display-ready card content, link destinations,
 * child-View props, action visibility/busy state, messages, and semantic
 * callbacks. It does not receive a raw creation record, load preview data,
 * start Story Rooms, set profile defaults, interpret ownership/lifecycle
 * policy, or invoke persistence clients.
 *
 * @typedef {Object} CreationCardViewProps
 * @property {string} title
 * @property {string} fallbackInitial
 * @property {string|null} imageUrl
 * @property {boolean} priority
 * @property {boolean} mobileCompact
 * @property {boolean} isPreviewLoading
 * @property {Object} statusBadges
 * @property {Object} statsRow
 * @property {boolean} showLikeAction
 * @property {boolean} liked
 * @property {null|(() => void)} onToggleLike
 * @property {boolean} showBookmarkAction
 * @property {boolean} bookmarked
 * @property {null|(() => void)} onToggleBookmark
 * @property {boolean} showDefaultPlayerCharacterAction
 * @property {boolean} isSettingDefaultPlayerCharacter
 * @property {null|(() => void)} onSetDefaultPlayerCharacter
 * @property {boolean} showStartChatAction
 * @property {boolean} isStartingChat
 * @property {null|(() => void)} onStartChat
 * @property {string} imageHref
 * @property {boolean} showEditAction
 * @property {string|null} editHref
 * @property {boolean} showCreatorAttribution
 * @property {string} creatorHandle
 * @property {string|null} creatorHref
 * @property {string} subtitle
 * @property {string} description
 * @property {string} errorMessage
 * @property {string} statusMessage
 * @property {null|(() => void)} onOpenPreview
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};
