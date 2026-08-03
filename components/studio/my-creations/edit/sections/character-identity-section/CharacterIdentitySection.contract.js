export const CHARACTER_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Character Identity View.
 *
 * The View receives display-ready identity values, selector options, semantic
 * callbacks, and application-rendered controls for the color palette and role
 * archetype pickers. It must not inspect a creation form, know JSON storage
 * keys, enforce persistence rules, or import those application picker Shells.
 *
 * @typedef {Object} CharacterIdentityOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} CharacterIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} characterNameLabel
 * @property {string} characterNameValue
 * @property {string} characterTitleLabel
 * @property {string} characterTitleValue
 * @property {string} speciesLabel
 * @property {string} speciesValue
 * @property {CharacterIdentityOption[]} speciesOptions
 * @property {boolean} showCustomSpecies
 * @property {string} customSpeciesLabel
 * @property {string} customSpeciesValue
 * @property {number} customIdentityMaxLength
 * @property {string} renderingStyleLabel
 * @property {string} renderingStyleValue
 * @property {CharacterIdentityOption[]} renderingStyleOptions
 * @property {string} ageLabel
 * @property {string} ageValue
 * @property {number} ageMinimum
 * @property {string} agePlaceholder
 * @property {string} ageHelpText
 * @property {string} genderPresentationLabel
 * @property {string} genderPresentationValue
 * @property {CharacterIdentityOption[]} genderPresentationOptions
 * @property {boolean} showCustomGenderPresentation
 * @property {string} customGenderPresentationLabel
 * @property {string} customGenderPresentationValue
 * @property {import("react").ReactNode|null} colorPaletteControl
 * @property {import("react").ReactNode|null} roleArchetypeControl
 * @property {string} creationTypeLabel
 * @property {string} creationTypeValue
 * @property {((value: string) => void)|null} onChangeCharacterName
 * @property {((value: string) => void)|null} onChangeCharacterTitle
 * @property {((value: string) => void)|null} onSelectSpecies
 * @property {((value: string) => void)|null} onChangeCustomSpecies
 * @property {((value: string) => void)|null} onSelectRenderingStyle
 * @property {((value: string) => void)|null} onChangeAge
 * @property {((value: string) => void)|null} onCommitAge
 * @property {((value: string) => void)|null} onSelectGenderPresentation
 * @property {((value: string) => void)|null} onChangeCustomGenderPresentation
 */

export {};
