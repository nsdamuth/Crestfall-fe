export const KIT_ALERT_STRIP_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared alert strip kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.11, alert tones). A full-width
 * in-flow strip carrying exactly four tones per the status usage law
 * (three statuses, a word beside every use, deliberately NO info
 * color; neutral IS the info tone, rendered through ink on the
 * `--fill-whisper` bed, the proof's one sanctioned explainer
 * container).
 *
 * The View renders the tone it is given; it does not decide when an
 * alert should show or what triggered it.
 *
 * @typedef {Object} KitAlertStripViewProps
 * @property {"success"|"warning"|"danger"|"neutral"} tone
 * @property {string} title lead word or short lead line
 * @property {string} [body] supporting copy
 * @property {string} [actionLabel] optional inline action; when
 *   present with onAction the strip renders a text action button
 *   carrying all five states
 * @property {(() => void)|null} [onAction]
 * @property {(() => void)|null} [onDismiss] optional dismiss
 *   control, all five states, rendered when present
 */

export {};
