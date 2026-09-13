export const KIT_SHARE_SHEET_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the share sheet kit piece
 * (fe/share-og brief 1, RULED 13 Sep 2026: D4, one Kit share package
 * keyed by asset type, mounted by every share button). The View
 * receives one share intent already resolved by the type rule
 * (shareTypeRule.js) and renders it: a preview, the link, the copy
 * action, the native share action where the browser offers one, and
 * the status of the last action. It never builds a URL, never reads
 * the clipboard, never decides whether a share carries the card.
 *
 * Mounted on KitModalFrame (variant modal, panelWidth 36rem): under
 * 700px the frame is bottom-anchored full width with internal scroll;
 * at 700px and up it is a centered 36rem panel. The frame owns the
 * close control and the three dismissal paths.
 *
 * @typedef {Object} KitShareSheetViewProps
 * @property {"image"|"video"|"character"|"story"|"adventure"|"link"} kind
 * @property {boolean} hasCard true only for a playable kind (the type
 *   rule); the sheet shows the card image when cardImageSrc is also
 *   set, else the plain link preview row
 * @property {string|null} cardImageSrc the share-card image route URL
 *   for a playable public creation; null for media, link, and Internal
 * @property {string} previewImageSrc the plain preview image (the
 *   creation's card derivative, or the medium or large derivative of a
 *   shared image); empty renders a quiet placeholder tile
 * @property {string} title
 * @property {string} byline "by @maker", the creator, never the sharer
 * @property {string} shareUrl the absolute link, ref included
 * @property {boolean} canNativeShare true when navigator.share exists;
 *   renders the Share... action beside Copy link
 * @property {"idle"|"copied"|"shared"|"error"} status
 * @property {string} statusMessage display-ready line for the status
 *   chip; empty renders no chip
 * @property {string|null} blockedMessage when set, the sheet renders
 *   only the eyebrow, the message, and Close (a private creation)
 * @property {string|null} note a quiet sentence under the preview (the
 *   Internal note); null renders nothing
 * @property {(() => void)|null} onCopyLink
 * @property {(() => void)|null} onNativeShare
 * @property {(() => void)|null} onClose
 */

export {};
