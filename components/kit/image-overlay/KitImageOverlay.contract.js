export const KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Converted onto the unified modal frame (docs/BUILD-BLUEPRINT.md
 * section 2.5) this pass, per docs/SPRINT-A-PLAN.md section 4. The
 * interim `0.1.0-interim` marker's own meaning ("this shape is
 * expected to change") stops being true once the conversion lands,
 * and `onClose` leaves the VIEW's prop surface (the frame owns
 * dismissal), which is a removal; both are sufficient reasons for the
 * version to move to 1.0.0.
 *
 * The PACKAGE's public props through the shell are unchanged:
 * `imageSrc`, `title`, `isLoved`, `isSaved`, `onLove`, `onSave`,
 * `onShare`, `onClose`. `onClose` is consumed by the shell and
 * forwarded to the composed `KitModalFrame`.
 *
 * The destination every "image"-kind media card and every creator
 * card thumbnail opens (docs/BUILD-BLUEPRINT.md section 2.14). Three
 * actions only: love, save, share. No download, details, report, or
 * remix; those live on the production `MediaLightbox`
 * (`components/studio/media/media-lightbox`) and are reconciled at
 * that surface's own conversion, not duplicated here.
 *
 * @typedef {Object} KitImageOverlayViewProps
 * @property {string|null} imageSrc
 * @property {string} title
 * @property {boolean} isLoved
 * @property {boolean} isSaved
 * @property {(() => void)|null} onLove
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onShare
 */

export {};
