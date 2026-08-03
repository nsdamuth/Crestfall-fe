export const STORY_ROOM_MOBILE_DRAWER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Story Room mobile drawer.
 *
 * The View owns the mobile-only overlay, drawer frame, title presentation,
 * scroll container, and close-button presentation. It does not own which
 * Story Room panel is open, the drawer title, the supplied panel content,
 * Story Room state, API calls, routing, or persistence.
 *
 * @typedef {Object} StoryRoomMobileDrawerViewProps
 * @property {string} title
 * @property {(() => void)|null} onClose
 * @property {import("react").ReactNode|null} children
 */

export {};
