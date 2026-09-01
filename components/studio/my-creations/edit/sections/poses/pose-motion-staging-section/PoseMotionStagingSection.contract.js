export const POSE_MOTION_STAGING_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the portable Pose motion/staging View.
 *
 * The View must not inspect a creation form, know Pose JSON storage fields, or
 * decide how motion/staging edits are persisted. It renders display-ready
 * field values and emits semantic edit intent only.
 *
 * @typedef {Object} PoseMotionStagingSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} actionMotionLabel
 * @property {string} actionMotionValue
 * @property {string} actionMotionHelper
 * @property {string} energyLevelLabel
 * @property {string} energyLevelValue
 * @property {Array<{value:string,label:string}>} energyOptions
 * @property {string} energyLevelHelper
 * @property {string} viewerRelationLabel
 * @property {string} viewerRelationValue
 * @property {Array<{value:string,label:string}>} viewerRelationOptions
 * @property {string} viewerRelationHelper
 * @property {string} propInteractionLabel
 * @property {string} propInteractionValue
 * @property {string} propInteractionHelper
 * @property {string} sceneFitLabel
 * @property {string} sceneFitValue
 * @property {string} sceneFitHelper
 * @property {string} moodAttitudeLabel
 * @property {string} moodAttitudeValue
 * @property {string} moodAttitudeHelper
 * @property {string} stagingNotesLabel
 * @property {string} stagingNotesValue
 * @property {string} stagingNotesPlaceholder
 * @property {((value: string) => void)|null} onChangeActionMotion
 * @property {((value: string) => void)|null} onChangeEnergyLevel
 * @property {((value: string) => void)|null} onChangeViewerRelation
 * @property {((value: string) => void)|null} onChangePropInteraction
 * @property {((value: string) => void)|null} onChangeSceneFit
 * @property {((value: string) => void)|null} onChangeMoodAttitude
 * @property {((value: string) => void)|null} onChangeStagingNotes
 */

export {};
