export const CREATION_FEATURED_IMAGE_PICKER_VIEW_CONTRACT_VERSION = "1.3.0";

/**
 * @typedef {Object} CreationFeaturedImagePickerViewItem
 * @property {string} id
 * @property {string} displayImageUrl
 * @property {string} altText
 * @property {string} metadataLabel
 * @property {string} [title]
 * @property {boolean} [isStockMedia]
 * @property {string} [description]
 * @property {string} [category]
 * @property {string} [orientationLabel]
 * @property {string[]} [tags]
 * @property {boolean} [isSelected]
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
 * @property {{id:string,label:string}[]} [sourceOptions]
 * @property {string} [activeSource]
 * @property {CreationFeaturedImagePickerViewItem[]} images
 * @property {boolean} isLoading
 * @property {string} loadErrorMessage
 * @property {string} saveMessage
 * @property {"notice"|"error"} saveMessageTone
 * @property {string|null} activeImageId
 * @property {boolean} hasMoreImages
 * @property {boolean} refreshDisabled
 * @property {string} [searchValue]
 * @property {string} [searchPlaceholder]
 * @property {{id:string,label:string}[]} [filterOptions]
 * @property {string} [activeFilter]
 * @property {string} [resultsLabel]
 * @property {boolean} [showClearFilters]
 * @property {string} [emptyTitle]
 * @property {string} [emptyMessage]
 * @property {string} [helperText]
 * @property {(() => void)|null} onClose
 * @property {(() => void)|null} onRefresh
 * @property {((sourceId: string) => void)|null} [onSourceChange]
 * @property {((value: string) => void)|null} [onSearchChange]
 * @property {((filterId: string) => void)|null} [onFilterChange]
 * @property {(() => void)|null} [onClearFilters]
 * @property {(() => void)|null} onLoadMore
 * @property {((imageId: string) => void)|null} onChooseImage
 */

export {};
