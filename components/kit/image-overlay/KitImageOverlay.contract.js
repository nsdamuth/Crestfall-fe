export const KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Recomposed onto the modal frame's `viewer` variant (R2/R5, 10 Aug
 * 2026, kit polish 3 pass, docs/BUILD-BLUEPRINT.md 2.16 (r)):
 * presentation-only recomposition, the package's prop surface is
 * unchanged (contract law: presentation may change, reporting may
 * not), so the contract stays 1.0.0.
 *
 * The PACKAGE's public props through the shell are unchanged:
 * `imageSrc`, `title`, `isLoved`, `isSaved`, `onLove`, `onSave`,
 * `onShare`, `onClose`. `onClose` is consumed by the shell and
 * forwarded to the composed `KitModalFrame`. `title` is now the
 * accessible name only (forwarded as the frame's `ariaLabel`); no
 * visible title line renders on the viewer, matching the witness's
 * chromeless intent (OPEN FOR BRIAN item 11, plan 1.2).
 *
 * The destination every "image"-kind media card and every creator
 * card thumbnail opens (docs/BUILD-BLUEPRINT.md section 2.14 and
 * (r)). Three actions only: love, save, share. No download, details,
 * report, or remix; those live on the production `MediaLightbox`
 * (`components/studio/media/media-lightbox`) and are reconciled at
 * that surface's own conversion, not duplicated here.
 *
 * @typedef {Object} KitImageOverlayViewProps
 * @property {string|null} imageSrc
 * @property {string} title accessible name only (no visible line)
 * @property {boolean} isLoved
 * @property {boolean} isSaved
 * @property {(() => void)|null} onLove
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onShare
 */

export {};
