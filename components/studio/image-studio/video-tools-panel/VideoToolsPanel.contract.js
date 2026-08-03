export const VIDEO_TOOLS_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready select option supplied to the portable View.
 *
 * @typedef {Object} VideoToolsPanelOptionViewItem
 * @property {string} value
 * @property {string} label
 */

/**
 * Display-ready future video-tool card supplied to the portable View.
 *
 * @typedef {Object} VideoToolsPanelCardViewItem
 * @property {string} id
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} body
 */

/**
 * Stable UI boundary for the portable Video Tools Panel View.
 *
 * The View must not know Image Studio state ownership, composer modes, option
 * registries, future video-generation requests, media persistence, or API
 * behavior. It receives display-ready controls and emits semantic edit intent.
 *
 * @typedef {Object} VideoToolsPanelViewProps
 * @property {VideoToolsPanelCardViewItem[]} toolCards
 * @property {string} durationValue
 * @property {VideoToolsPanelOptionViewItem[]} durationOptions
 * @property {string} aspectRatioValue
 * @property {VideoToolsPanelOptionViewItem[]} aspectRatioOptions
 * @property {string} motionStyleValue
 * @property {VideoToolsPanelOptionViewItem[]} motionStyleOptions
 * @property {string} directionValue
 * @property {((nextValue: string) => void)|null} onChangeDuration
 * @property {((nextValue: string) => void)|null} onChangeAspectRatio
 * @property {((nextValue: string) => void)|null} onChangeMotionStyle
 * @property {((nextValue: string) => void)|null} onChangeDirection
 */

export {};
