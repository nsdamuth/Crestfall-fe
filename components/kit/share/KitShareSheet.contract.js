export const KIT_SHARE_SHEET_VIEW_CONTRACT_VERSION = "2.0.0";

// Version note, 1.1.0 -> 2.0.0 (fe/share-og follow-up 2, RULED 13 Sep
// 2026, Brian's browser review: one gold Copy link, no native share).
// Removed: the native share capability flag, its callback, the
// "shared" status, and the Share... action. Copy link is the one share
// action, the gold primary, full width, 44px; on copy the status reads
// "Link copied" and clears after the existing timer. A breaking
// removal, so the major bumps.
//
// Version note, 1.0.0 -> 1.1.0 (fe/share-og follow-up 1, RULED 13 Sep
// 2026: sharing is public only). The `note` prop (the Internal note)
// is removed: an Internal creation now takes the blocked state, same
// as a private one. The blocked state gains a primary action, Submit
// for public review, driven by reviewState, reviewButtonLabel,
// reviewButtonDisabled, reviewMessage, and onSubmitForReview. The
// blocked sentence itself changes (SHARE_COPY.blockedNotPublic).
// previewImageLargeSrc is added for the image kind (the display
// derivative behind the medium preview). The kind enum gains "profile"
// (the creator profile's share: plain link preview, no card). Every
// other prop and callback is unchanged.

/**
 * Stable portable UI boundary for the share sheet kit piece
 * (fe/share-og brief 1, RULED 13 Sep 2026: D4, one Kit share package
 * keyed by asset type, mounted by every share button). The View
 * receives one share intent already resolved by the type rule
 * (shareTypeRule.js) and renders it: a preview, the link, the copy
 * action, and the status of the last action. It never builds a URL, never reads
 * the clipboard, never decides whether a share carries the card, and
 * never posts the review submission itself.
 *
 * Mounted on KitModalFrame (variant modal, panelWidth 36rem,
 * panelRadius the medium step): under 700px the frame is
 * bottom-anchored full width with the grabber and internal scroll; at
 * 700px and up it is a centered 36rem panel. The frame owns the close
 * control and the three dismissal paths. Every button is the recipe's
 * small variant (follow-up 2): Copy link full width; on a blocked
 * share Close left and Submit for public review right, equal widths
 * at 390, right-aligned at 700px and up.
 *
 * @typedef {Object} KitShareSheetViewProps
 * @property {"image"|"video"|"character"|"story"|"adventure"|"profile"|"link"} kind
 * @property {boolean} hasCard true only for a playable kind (the type
 *   rule); the sheet shows the card image when cardImageSrc is also
 *   set, else the plain link preview row
 * @property {string|null} cardImageSrc the share-card image route URL
 *   for a playable public creation; null for media and link
 * @property {string} previewImageSrc the plain preview image (the
 *   creation's card derivative, or the medium derivative of a shared
 *   image); empty renders a quiet placeholder tile
 * @property {string} previewImageLargeSrc the display derivative of a
 *   shared image, never the original; empty for every other kind
 * @property {string} title
 * @property {string} byline "by @maker", the creator, never the sharer;
 *   "@handle" on the profile kind
 * @property {string} shareUrl the absolute link, ref included
 * @property {"idle"|"copied"|"error"} status
 * @property {string} statusMessage display-ready line for the status
 *   chip; empty renders no chip
 * @property {string|null} blockedMessage when set, the sheet renders
 *   only the eyebrow, the title, the sentence, the review action, and
 *   Close (a private or Internal creation; sharing is public only)
 * @property {"idle"|"submitting"|"submitted"|"error"} reviewState
 * @property {string} reviewButtonLabel display-ready label for the
 *   blocked sheet's primary ("Submit for public review", then
 *   "Submitted for review")
 * @property {boolean} reviewButtonDisabled true while submitting and
 *   once submitted
 * @property {string} reviewMessage display-ready failure line under
 *   the actions; empty renders nothing
 * @property {(() => void)|null} onCopyLink
 * @property {(() => void)|null} onSubmitForReview
 * @property {(() => void)|null} onClose
 */

export {};
