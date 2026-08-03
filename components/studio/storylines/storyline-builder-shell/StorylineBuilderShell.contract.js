export const STORYLINE_BUILDER_SHELL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable LOOM boundary for Storyline creation.
 *
 * The portable View receives display-ready field values, semantic callbacks,
 * save state, and injected authoring slots. It does not receive the raw form,
 * inspect Storyline JSONB, load references, build creation payloads, call the
 * Storyline client, or navigate after persistence.
 *
 * @typedef {Object} StorylineBuilderSelectOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} StorylineBuilderShellViewProps
 * @property {string} eyebrow
 * @property {string} displayTitle
 * @property {string} description
 * @property {string} titleLabel
 * @property {string} titleValue
 * @property {(value: string) => void} onChangeTitle
 * @property {string} descriptionLabel
 * @property {string} descriptionValue
 * @property {(value: string) => void} onChangeDescription
 * @property {string} visibilityLabel
 * @property {string} visibilityValue
 * @property {StorylineBuilderSelectOption[]} visibilityOptions
 * @property {(value: string) => void} onChangeVisibility
 * @property {string} contentRatingLabel
 * @property {string} contentRatingValue
 * @property {StorylineBuilderSelectOption[]} contentRatingOptions
 * @property {(value: string) => void} onChangeContentRating
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {string} tagsPlaceholder
 * @property {(value: string) => void} onChangeTags
 * @property {string} saveButtonLabel
 * @property {boolean} saveDisabled
 * @property {() => void} onSaveDraft
 * @property {string} saveMessage
 * @property {"success"|"error"} saveMessageTone
 * @property {import("react").ReactNode} nodeEditorSlot
 * @property {import("react").ReactNode} openWorldSettingsSlot
 */

export {};
