export const ROOM_REGISTRY_ATTACHMENTS_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} RoomRegistryAttachmentViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} typeLabel
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} notes
 * @property {string} removeAriaLabel
 */

/**
 * @typedef {Object} RoomRegistryAttachmentGroupViewItem
 * @property {string} id
 * @property {string} label
 * @property {string} body
 * @property {string} addLabel
 * @property {string} emptyLabel
 * @property {RoomRegistryAttachmentViewItem[]} attachments
 */

/**
 * Stable UI boundary for the portable Story registry-attachment View.
 *
 * The View must not know bound-registry storage field names, legacy ID-only
 * attachment behavior, linked-creation payloads, picker type filters,
 * deduplication rules, registry mutation semantics, or Story persistence. It
 * renders display-ready registry groups and emits semantic attachment intent.
 *
 * @typedef {Object} RoomRegistryAttachmentsSectionViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} body
 * @property {RoomRegistryAttachmentGroupViewItem[]} groups
 * @property {((groupId: string) => void)|null} onOpenRegistryPicker
 * @property {((groupId: string, attachmentId: string) => void)|null} onRemoveRegistry
 * @property {((groupId: string, attachmentId: string, notes: string) => void)|null} onChangeRegistryNotes
 */

export {};
