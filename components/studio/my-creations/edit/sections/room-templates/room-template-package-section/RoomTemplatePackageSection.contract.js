export const ROOM_TEMPLATE_PACKAGE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready selection-card value.
 *
 * @typedef {Object} RoomTemplatePackageSelectionValue
 * @property {string} title
 * @property {string} subtitle
 */

/**
 * Display-ready Story package selection card.
 *
 * @typedef {Object} RoomTemplatePackageSelectionCard
 * @property {string} id
 * @property {"scenario"|"narrator"|"location"} iconName
 * @property {string} label
 * @property {RoomTemplatePackageSelectionValue|null} value
 * @property {string} placeholder
 * @property {(() => void)|null} onOpen
 */

/**
 * Stable UI boundary for the portable Story Package View.
 *
 * The View must not inspect a creation form, know room-template storage fields,
 * load Crestfall creations, resolve selected references, apply scenario
 * recommendations, merge registry attachments, or persist package changes. It
 * receives display-ready child-View props and emits semantic user intent only.
 *
 * @typedef {Object} RoomTemplatePackageSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {Object} selectedCharactersPanelProps
 * @property {boolean} showScenarioRecommendations
 * @property {Object} scenarioRecommendationsPanelProps
 * @property {RoomTemplatePackageSelectionCard[]} selectionCards
 * @property {string} referenceLoadError
 * @property {Object|null} pickerViewProps
 */

export {};
