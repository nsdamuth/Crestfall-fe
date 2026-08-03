export const CREATION_PUBLISHING_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

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
 */

export {};
