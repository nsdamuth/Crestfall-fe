export const POSE_BODY_POSITION_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Pose body-position View.
 *
 * The View must not inspect a creation form, know Pose JSON storage fields, or
 * decide how body-position edits are persisted. It renders display-ready field
 * values and emits semantic edit intent only.
 *
 * @typedef {Object} PoseBodyPositionSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} postureLabel
 * @property {string} postureValue
 * @property {string} bodyOrientationLabel
 * @property {string} bodyOrientationValue
 * @property {string} armHandPositionLabel
 * @property {string} armHandPositionValue
 * @property {string} legFootPositionLabel
 * @property {string} legFootPositionValue
 * @property {string} facialExpressionLabel
 * @property {string} facialExpressionValue
 * @property {string} balanceWeightLabel
 * @property {string} balanceWeightValue
 * @property {string} bodyPositionNotesLabel
 * @property {string} bodyPositionNotesValue
 * @property {string} bodyPositionNotesPlaceholder
 * @property {((value: string) => void)|null} onChangePosture
 * @property {((value: string) => void)|null} onChangeBodyOrientation
 * @property {((value: string) => void)|null} onChangeArmHandPosition
 * @property {((value: string) => void)|null} onChangeLegFootPosition
 * @property {((value: string) => void)|null} onChangeFacialExpression
 * @property {((value: string) => void)|null} onChangeBalanceWeight
 * @property {((value: string) => void)|null} onChangeBodyPositionNotes
 */

export {};
