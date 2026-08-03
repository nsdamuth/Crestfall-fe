export const NARRATOR_MODULES_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Narrator Modules edit-section View.
 *
 * The View must not inspect a creation form, know legacy or current JSON field
 * names, merge module defaults, merge response-direction defaults, or decide
 * how a module selection is persisted. It renders the section heading and a
 * direct child NarratorModuleSelector View contract only.
 *
 * `moduleSelector` must match the validated
 * NarratorModuleSelectorViewProps contract.
 *
 * @typedef {Object} NarratorModulesSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {Object} moduleSelector
 */

export {};
