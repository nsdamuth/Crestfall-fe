export const KIT_FORM_FIELD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared field kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.8, field anatomy). Four slots
 * plus the input: label, input bed, helper line, error line, and an
 * optional counter. An optional fold turns the field into a
 * disclosure header revealing a field group, matching the creator's
 * Advanced Creator Guidance and Advanced Prompting folds.
 *
 * The View owns only the fold's open/closed presentation state
 * (sanctioned presentation-only local state); value, error, and
 * success are always caller-owned and passed in.
 *
 * @typedef {Object} KitFormFieldViewProps
 * @property {string} label
 * @property {string} value
 * @property {string} [placeholder]
 * @property {string} [helper] helper line, shown when neither error
 *   nor success is present
 * @property {string} [error] error line; when present the input
 *   border takes --status-danger-border and the bed may take
 *   --status-danger-bed
 * @property {string} [success] success confirmation line, same
 *   triad treatment as error, success tone
 * @property {number|null} [maxLength] when set, the counter renders
 * @property {number|null} [count] current character count; the View
 *   never derives this from value, the caller supplies it (folded
 *   groups combine multiple inputs into one budget count)
 * @property {boolean} [isFolded] when defined the field renders as a
 *   disclosure header over a field group instead of a plain input
 * @property {(() => void)|null} [onToggleFold]
 * @property {import("react").ReactNode} [children] the folded field
 *   group content, rendered under the disclosure header when open
 * @property {boolean} isDisabled
 * @property {"text"|"search"|"email"|"password"|"number"} [type]
 * @property {((value: string) => void)|null} onChange
 */

export {};
