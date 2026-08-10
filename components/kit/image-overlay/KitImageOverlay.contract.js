export const KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION = "0.1.0-interim";

/**
 * INTERIM contract. This is a fixture-level overlay only; it
 * converts to the unified modal frame (docs/BUILD-BLUEPRINT.md
 * section 2.5) in batch 2. The 0.1.0-interim version marks that this
 * shape is expected to change, unlike every other kit contract's
 * 1.0.0 starting point.
 *
 * The destination every "image"-kind media card and every creator
 * card thumbnail opens (docs/BUILD-BLUEPRINT.md section 2.14). Three
 * actions only this batch: love, save, share. No download, details,
 * report, or remix; those belong to the live MediaLightbox and are
 * reconciled at the batch-2 conversion.
 *
 * @typedef {Object} KitImageOverlayViewProps
 * @property {string|null} imageSrc
 * @property {string} title
 * @property {boolean} isLoved
 * @property {boolean} isSaved
 * @property {(() => void)|null} onLove
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onShare
 * @property {(() => void)|null} onClose
 */

export {};
