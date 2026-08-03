export const ROOM_TEMPLATE_PACKAGE_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} RoomTemplatePackagePickerItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} type
 * @property {string} contentRating
 * @property {string|null} imageUrl
 */

/**
 * Stable UI boundary for the portable room-template package picker.
 *
 * The View must not receive raw Crestfall creations, profile records,
 * room-template form state, scenario recommendation structures, or
 * application callback routing. It renders display-ready cards and emits a
 * semantic item-ID selection only.
 *
 * @typedef {Object} RoomTemplatePackagePickerModalViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {"characters"|"scenario"|"narrator"|"location"|"players"} iconName
 * @property {RoomTemplatePackagePickerItem[]} items
 * @property {string[]} selectedIds
 * @property {string[]} recommendedIds
 * @property {string} searchPlaceholder
 * @property {string} emptyMessage
 * @property {(() => void)|null} onClose
 * @property {((itemId: string) => void)|null} onChooseItem
 */

export {};
