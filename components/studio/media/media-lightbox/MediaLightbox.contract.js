export const MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable presentation contract for the shared full-screen media viewer.
 *
 * B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
 * plan group G3): contract bump 1.0.0 to 1.1.0, additive plus one
 * rename. `deleteConfirmOpen` is new (the ViewModel's deletion-
 * confirmation state, now rendered in-surface instead of through
 * `window.confirm`); `onDelete` is replaced by `onRequestDelete` (opens
 * the confirm panel), `onCancelDelete`, and `onConfirmDelete` (fires
 * the real delete). The top-level `onDeleteItem` application prop the
 * Binding Shell and ViewModel accept is unchanged; only this internal
 * View-facing surface renamed. Layout moved from a two-sidebar shell
 * to the B7 header/image/bottom-bar column shared with
 * `KitImageOverlay` (`components/kit/image-overlay`): a two-line glass
 * header (title, then the six-icon row: delete, report, details,
 * download, bookmark, like), and a gold-ink bottom bar (Generate
 * Variant, Reassign Asset, Share). `onReassignAsset` is not part of
 * this surface; Reassign Asset always renders as an honest stub
 * (CR-055), matching `KitImageOverlay`'s treatment.
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
 * @property {boolean} isLiked
 * @property {boolean} isBookmarked
 * @property {string} shareMessage
 * @property {Array<{value:string,label:string}>} reportReasonOptions
 * @property {Object} detailsDialog
 * @property {Object} reportDialog
 * @property {boolean} deleteConfirmOpen
 * @property {(() => void)|null} onRequestDelete opens the B5 confirm panel
 * @property {(() => void)|null} onCancelDelete
 * @property {(() => void)|null} onConfirmDelete fires the real delete
 * @property {import("react").ElementType} LinkComponent
 */

export {};
