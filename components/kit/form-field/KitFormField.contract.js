export const KIT_FORM_FIELD_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the shared field kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.8, field anatomy). Four slots
 * plus the input: label, input bed, helper line, error line, and an
 * optional counter. An optional fold turns the field into a
 * disclosure header revealing a field group, matching the creator's
 * Advanced Creator Guidance and Advanced Prompting folds.
 *
 * The View owns only the fold's open/closed presentation state, the
 * long-form collapsed/expanded state (O1), and the focus flag driving
 * the counter's visibility (O4); all sanctioned presentation-only
 * local state. Value, error, and success are always caller-owned and
 * passed in.
 *
 * 1.1.0 (K1, 12 Aug 2026, additive only, all below optional):
 * `variant` selects the field's shape; the four slots, states, and
 * every 1.0.0 prop are unchanged and behave identically when
 * `variant` is omitted or "text".
 *
 * O1 (ratified option A, docs/plans/FABLE-GATE-PLAN.md): a
 * `variant="textarea"` field rests collapsed at one control height,
 * showing a single-line preview of the entered value (or the
 * placeholder when empty) so a filled field is always visibly filled
 * at a glance. It expands to a real multi-row textarea on focus or
 * tap and returns to the collapsed preview on blur. `startExpanded`
 * only seeds the initial state, mirroring `isFolded`'s seed pattern;
 * it never controls the state after mount.
 *
 * O4 (ratified option A): the counter is hidden at rest. It appears
 * while the field is focused, and independently whenever the count
 * is past 80% of `maxLength`; at or over `maxLength` it takes
 * --status-danger and appends the word "limit". The fold-header
 * group budget counter is unaffected by O4 and stays always visible,
 * per 2.8's "combined budget line" rule.
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
 *   per the O4 visibility rule
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
 *   native input type, "text" variant only; ignored by "textarea",
 *   "select", and "number" variants
 * @property {"text"|"textarea"|"select"|"number"} [variant] (added
 *   1.1.0) defaults "text"
 * @property {boolean} [mono] (added 1.1.0) renders the entered value
 *   in the codebase's standard `font-mono` utility; legal on any
 *   variant
 * @property {boolean} [startExpanded] (added 1.1.0) "textarea"
 *   variant only, seeds the initial collapsed/expanded state (O1);
 *   default collapsed
 * @property {import("../dropdown/KitDropdown.contract").KitDropdownOption[]}
 *   [options] (added 1.1.0) "select" variant only, passed through to
 *   KitDropdown's option grammar unchanged, including its sheet
 *   behavior under 700px
 * @property {((value: string) => void)|null} [onSelect] (added
 *   1.1.0) "select" variant only, fires the chosen option's value
 * @property {((value: string) => void)|null} onChange
 */

export {};
