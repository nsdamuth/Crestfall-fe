export const CREATION_EDIT_MEDIA_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready featured-media slot supplied to the portable View.
 *
 * @typedef {Object} CreationEditFeaturedSlotViewItem
 * @property {string} id
 * @property {string} label
 * @property {string|null} imageUrl
 * @property {number} index
 * @property {boolean} isActive
 */

/**
 * Stable UI boundary for the portable Creation Edit Media Panel View.
 *
 * The View must not know the Creation Edit form shape, creation IDs, featured
 * slot storage keys, picker state, image-library routing rules, or persistence.
 * It receives display-ready media and emits semantic slot-selection intent.
 *
 * `imageLibraryHref` remains a host-provided navigation target so the current
 * Next.js Link behavior can be preserved without exposing route construction.
 *
 * @typedef {Object} CreationEditMediaPanelViewProps
 * @property {string} creationTitle
 * @property {string} fallbackInitial
 * @property {CreationEditFeaturedSlotViewItem|null} activeMedia
 * @property {CreationEditFeaturedSlotViewItem[]} featuredSlots
 * @property {string} imageLibraryHref
 * @property {boolean} supportsChatMedia
 * @property {string} nonChatContextTitle
 * @property {string} nonChatContextDescription
 * @property {((slotIndex: number) => void)|null} onSelectFeaturedSlot
 * @property {(() => void)|null} onReplaceActiveSlot
 */

export {};
