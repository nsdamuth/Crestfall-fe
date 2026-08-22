export const MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Portable presentation contract for the shared full-screen media viewer.
 *
 * BREAKING CHANGE, v2.0.0 (ED1G sw12, Brian ruling 4, 22 Aug 2026):
 * v1.1.0 shipped a prop removal as an additive minor bump, which SOP
 * section 5 classes as breaking. Reissued honestly as 2.0.0 with no
 * further prop-surface change from 1.1.0. `onDelete` is REMOVED and
 * replaced by three callbacks: `onRequestDelete` (opens the B5 confirm
 * panel), `onCancelDelete`, and `onConfirmDelete` (fires the real
 * delete). Any consumer still passing `onDelete` must migrate to the
 * three-callback set; the top-level `onDeleteItem` application prop
 * the Binding Shell and ViewModel accept is unaffected, only this
 * internal View-facing surface changed.
 *
 * B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
 * plan group G3): `deleteConfirmOpen` is new (the ViewModel's
 * deletion-confirmation state, now rendered in-surface instead of
 * through `window.confirm`). Layout moved from a two-sidebar shell
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
 * @property {((mediaId:string) => void)|null} onSelectMedia doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onClose doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onLike doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onBookmark doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onShare doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onRequestDelete opens the B5 confirm panel
 * @property {(() => void)|null} onCancelDelete
 * @property {(() => void)|null} onConfirmDelete fires the real delete
 * @property {(() => void)|null} onOpenDetails doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onCloseDetails doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onOpenReport doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onCloseReport doc-only addition (ED1G sw12), no further version bump.
 * @property {((key:string) => void)|null} onReportReasonKeyChange doc-only addition (ED1G sw12), no further version bump.
 * @property {((value:string) => void)|null} onReportReasonTextChange doc-only addition (ED1G sw12), no further version bump.
 * @property {(() => void)|null} onSubmitReport doc-only addition (ED1G sw12), no further version bump.
 * @property {import("react").ElementType} LinkComponent
 */

export {};
