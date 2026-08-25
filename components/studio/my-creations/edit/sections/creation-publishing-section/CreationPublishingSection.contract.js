export const CREATION_PUBLISHING_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

// Version note, 1.0.0 -> 1.1.0 (additive, ED1,
// docs/plans/FABLE-GATE-2-STUDIO.md): the Unlist for Editing and
// Cancel Review actions move here from the retired sticky action bar
// (docs/DESIGN-TOKENS.md contract law s13; retirement recorded in
// edit/creation-edit-sticky-action-bar's own README). New optional
// props only; every existing prop and callback is unchanged. All
// three review-family buttons (public review, canon review, unlist)
// now arm a local two-step confirm before firing their callback,
// UI-only state that adds no new props.
/**
 * Stable UI boundary for the portable Creation Publishing View.
 *
 * The View receives display-ready select values, template-management copy,
 * review action labels, disabled decisions, messages, and semantic callbacks.
 * It must not inspect a creation form, interpret lifecycle or canon values,
 * choose review eligibility, or know Crestfall persistence field names.
 *
 * @typedef {Object} CreationPublishingOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} CreationPublishingTemplateAction
 * @property {string} id
 * @property {string} label
 * @property {boolean} disabled
 * @property {"primary"|"secondary"} emphasis
 *
 * @typedef {Object} CreationPublishingSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} visibilityLabel
 * @property {string} visibilityValue
 * @property {CreationPublishingOption[]} visibilityOptions
 * @property {string} contentRatingLabel
 * @property {string} contentRatingValue
 * @property {CreationPublishingOption[]} contentRatingOptions
 * @property {string} templateEyebrow
 * @property {string} templateTitle
 * @property {string} templateDescription
 * @property {CreationPublishingTemplateAction[]} templateActions
 * @property {string} publicReviewTitle
 * @property {string} publicReviewDescription
 * @property {string} publicReviewButtonLabel
 * @property {boolean} publicReviewDisabled
 * @property {string} canonReviewTitle
 * @property {string} canonReviewDescription
 * @property {string} canonReviewButtonLabel
 * @property {boolean} canonReviewDisabled
 * @property {string} reviewMessage
 * @property {"success"|"error"} reviewMessageTone
 * @property {((value: string) => void)|null} onSelectVisibility
 * @property {((value: string) => void)|null} onSelectContentRating
 * @property {(() => void)|null} onSubmitPublicReview
 * @property {(() => void)|null} onSubmitCanonReview
 * @property {string} [unlistTitle] default "Unlist for Editing"
 * @property {string} [unlistDescription]
 * @property {boolean} [showUnlist] default false; true only when the
 *   creation's current visibility is PUBLIC (the Chassis computes
 *   this from `form.visibility`, the View never inspects the form)
 * @property {string} [unlistButtonLabel] default "Unlist for editing"
 * @property {boolean} [unlistDisabled] default false
 * @property {(() => void)|null} [onUnlistForEditing]
 * @property {boolean} [showCancelReview] default false; true only
 *   while a review submission is pending
 * @property {string} [cancelReviewButtonLabel] default "Cancel review"
 * @property {boolean} [cancelReviewDisabled] default false
 * @property {(() => void)|null} [onCancelReview]
 */

export {};
