export const KIT_NOTICE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared confirmation-note kit
 * piece (ASSET-FOLDERS plan, package AF1). One transient line
 * announcing that a create, rename, move, add, remove, or delete
 * happened, in words a screen reader carries without the user asking.
 * The View renders the message it is given and never decides when a
 * mutation happened or what triggered it; a consumer times the note's
 * own lifetime (see `useKitNoticeAutoClear` in the ViewModel file, the
 * same 1600ms window `components/kit/share/useKitShareController.js`
 * uses for its status line).
 *
 * Two tones only: `neutral` for a plain confirmation (create, rename,
 * move, add, remove), `danger` for a delete. No third tone, no icon
 * set, no stacking; a consumer mounting more than one note at a time
 * is out of contract for this package.
 *
 * @typedef {Object} KitNoticeViewProps
 * @property {string} message the confirmation line; an empty message
 *   renders nothing
 * @property {"neutral"|"danger"} [tone] default "neutral"
 * @property {(() => void)|null} [onDismiss] optional dismiss control,
 *   44px target, rendered only when present
 */

export {};
