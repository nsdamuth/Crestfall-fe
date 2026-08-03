export const CREATION_REFERENCE_IMAGE_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} CreationReferenceImagePickerViewItem
 * @property {string} id
 * @property {string} displayImageUrl
 * @property {string} altText
 * @property {string} metadataLabel
 */

/**
 * Stable UI boundary for the portable visual-reference picker View.
 *
 * The View must not know Crestfall image-library payloads, output-ID field
 * variants, eligibility rules, URL fallback rules, form storage, or how a
 * selected reference is persisted. It renders display-ready image cards and
 * emits semantic user actions only.
 *
 * @typedef {Object} CreationReferenceImagePickerModalViewProps
 * @property {string} referenceLabel
 * @property {CreationReferenceImagePickerViewItem[]} images
 * @property {boolean} isLoading
 * @property {string} loadErrorMessage
 * @property {boolean} hasMoreImages
 * @property {boolean} refreshDisabled
 * @property {(() => void)|null} onClose
 * @property {(() => void)|null} onRefresh
 * @property {(() => void)|null} onLoadMore
 * @property {((imageId: string) => void)|null} onChooseImage
 */

export {};
