export const CREATION_FEATURED_IMAGE_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} CreationFeaturedImagePickerViewItem
 * @property {string} id
 * @property {string} displayImageUrl
 * @property {string} altText
 * @property {string} metadataLabel
 */

/**
 * Stable UI boundary for the portable featured-image picker View.
 *
 * The View must not know Crestfall API payloads, image-library eligibility
 * rules, storage URL fallback rules, persistence fields, or save behavior. It
 * renders display-ready image cards and emits semantic user actions only.
 *
 * @typedef {Object} CreationFeaturedImagePickerModalViewProps
 * @property {string} slotLabel
 * @property {CreationFeaturedImagePickerViewItem[]} images
 * @property {boolean} isLoading
 * @property {string} loadErrorMessage
 * @property {string} saveMessage
 * @property {"notice"|"error"} saveMessageTone
 * @property {string|null} activeImageId
 * @property {boolean} hasMoreImages
 * @property {boolean} refreshDisabled
 * @property {(() => void)|null} onClose
 * @property {(() => void)|null} onRefresh
 * @property {(() => void)|null} onLoadMore
 * @property {((imageId: string) => void)|null} onChooseImage
 */

export {};
