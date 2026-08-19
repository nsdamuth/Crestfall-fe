export const MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable presentation contract for the shared full-screen media viewer.
 *
 * The View receives normalized media cards, active-state labels, dialog state,
 * semantic callbacks, and an injected internal-link component. It does not
 * interpret image-output aliases, call media clients, confirm deletion, use
 * browser sharing APIs, or know persistence and ownership rules.
 *
 * @typedef {Object} MediaLightboxViewProps
 * @property {Array<Object>} mediaItems
 * @property {Object|null} activeMedia
 * @property {string} activeId
 * @property {string} modeLabel
 * @property {string} imageStudioHref
 * @property {boolean} allowDownload
 * @property {boolean} showStudioActions
 * @property {boolean} showDeleteAction
 * @property {boolean} showReassignAction
 * @property {boolean} isLiked
 * @property {boolean} isBookmarked
 * @property {string} shareMessage
 * @property {Array<{value:string,label:string}>} reportReasonOptions
 * @property {Object} detailsDialog
 * @property {Object} reassignDialog
 * @property {Object} reassignmentPresentation
 * @property {Object} reportDialog
 * @property {Function|null} onOpenReassign
 * @property {Function|null} onCloseReassign
 * @property {Function|null} onReassignDestinationChange
 * @property {Function|null} onSubmitReassign
 * @property {import("react").ElementType} LinkComponent
 */

export {};
