export const KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
 * plan group G3), superseding the R2/R5 recomposition
 * (docs/BUILD-BLUEPRINT.md 2.16 (r)): contract bump 1.0.0 to 1.1.0,
 * additive. Six new optional callback props (`onDelete`, `onReport`,
 * `onDetails`, `onDownload`, `onGenerateVariant`, `onReassignAsset`)
 * join the unchanged `imageSrc`, `title`, `isLoved`, `isSaved`,
 * `onLove`, `onSave`, `onShare`, `onClose`; every existing caller
 * keeps working with the new actions absent (they no-op). `onClose`
 * is consumed by the shell and forwarded to the composed
 * `KitModalFrame`. `title` now renders as a visible centered line in
 * the header, resolving OPEN FOR BRIAN item 11; it is still forwarded
 * as the frame's `ariaLabel`.
 *
 * The destination every "image"-kind media card and every creator
 * card thumbnail opens (docs/BUILD-BLUEPRINT.md section 2.14 and
 * (r)). Six icon-row actions (delete, report, details, download,
 * bookmark, like) plus a three-action bottom bar (Generate Variant,
 * Reassign Asset, Share), matching the production `MediaLightbox`
 * (`components/studio/media/media-lightbox`) action set per B7.
 * `onDelete` fires only after the package's own B5 danger-confirm
 * step, never directly from the icon. `onReassignAsset` is live when
 * the caller supplies a callback and remains disabled when it does not.
 * Delete confirmation is intentionally permanent: the current runtime
 * does not expose the unresolved CR-054 recovery-window behavior.
 *
 * @typedef {Object} KitImageOverlayViewProps
 * @property {string|null} imageSrc
 * @property {string} title visible centered header line, also the accessible name
 * @property {boolean} isLoved
 * @property {boolean} isSaved
 * @property {(() => void)|null} onLove
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onShare
 * @property {(() => void)|null} onDelete fires after the B5 confirm step
 * @property {(() => void)|null} onReport
 * @property {(() => void)|null} onDetails
 * @property {(() => void)|null} onDownload
 * @property {(() => void)|null} onGenerateVariant
 * @property {(() => void)|null} onReassignAsset live reassignment intent; disabled when absent
 */

export {};
