export const ROOM_TEMPLATE_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} RoomTemplatePickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} type
 * @property {string} imageUrl
 * @property {string} contentRating
 */

/**
 * Stable UI boundary for the portable Story reference picker View.
 *
 * The View must not know room-template form state, raw Crestfall creation
 * payloads, scenario recommendation structures, or which application callback
 * handles a selected character, scenario, narrator, or location. It renders
 * display-ready references and emits semantic item-ID selections only.
 *
 * @typedef {Object} RoomTemplatePickerModalViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {"characters"|"scenario"|"narrator"|"location"|"openingLocations"|"reference"} iconName
 * @property {RoomTemplatePickerViewItem[]} items
 * @property {string[]} selectedIds
 * @property {string[]} recommendedIds
 * @property {string} searchPlaceholder
 * @property {string} emptyMessage
 * @property {(() => void)|null} onClose
 * @property {((itemId: string) => void)|null} onChooseItem
 */

export {};
