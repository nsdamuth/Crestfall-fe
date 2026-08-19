export const CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION =
  "creation-preview-modal.view.v1";

/**
 * @typedef {Object} CreationPreviewMediaItem
 * @property {string} id
 * @property {string} url
 * @property {string} title
 */

/**
 * @typedef {Object} CreationPreviewDescription
 * @property {string} text
 * @property {string} visibleText
 * @property {boolean} hasLongDescription
 * @property {string} toggleLabel
 */

/**
 * @typedef {Object} CreationPreviewOpeningLocationPicker
 * @property {boolean} open
 * @property {string} eyebrow
 * @property {string} description
 * @property {Array<{
 *   id: string,
 *   title: string,
 *   subtitle: string,
 *   imageUrl: string|null,
 *   selected: boolean,
 *   disabled: boolean,
 *   ariaPressed: boolean
 * }>} options
 * @property {string} selectedLocationId
 * @property {{title: string, message: string}|null} emptyState
 * @property {string} errorMessage
 * @property {{
 *   cancelLabel: string,
 *   confirmLabel: string,
 *   cancelDisabled: boolean,
 *   confirmDisabled: boolean,
 *   canConfirm: boolean
 * }} actions
 * @property {{
 *   onSelect: Function|null,
 *   onCancel: Function|null,
 *   onConfirm: Function|null
 * }} callbacks
 */

/**
 * @typedef {Object} CreationPreviewModalViewProps
 * @property {string} title
 * @property {string} subtitle
 * @property {string} titleInitial
 * @property {CreationPreviewDescription} description
 * @property {string[]} tags
 * @property {{handle: string, href: string}} creator
 * @property {Array<Object>} credits
 * @property {string} catalogueHref
 * @property {string} editHref
 * @property {CreationPreviewMediaItem[]} featuredMedia
 * @property {boolean} hasFeaturedMedia
 * @property {number} activeMediaIndex
 * @property {CreationPreviewMediaItem|null} activeMedia
 * @property {boolean} isMoreSlide
 * @property {Array<{id: string, index: number, label: string}>} mediaIndicators
 * @property {"owner"|"picker"|string} context
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {boolean} canLike
 * @property {boolean} canBookmark
 * @property {boolean} supportsChat
 * @property {boolean} canSetDefaultPc
 * @property {boolean} isShareable
 * @property {boolean} startingChat
 * @property {boolean} settingDefaultPc
 * @property {string} chatError
 * @property {string} defaultPcError
 * @property {string} defaultPcStatus
 * @property {CreationPreviewOpeningLocationPicker|null=} openingLocationPicker
 * @property {Function} onClose
 * @property {Function} onToggleDescription
 * @property {Function} onSelectMedia
 * @property {Function} onPreviousMedia
 * @property {Function} onNextMedia
 * @property {Function=} onToggleLike
 * @property {Function=} onToggleBookmark
 * @property {Function} onStartStory
 * @property {Function} onSetDefaultPc
 */

export const creationPreviewModalOwnership = Object.freeze({
  ownsNextNavigationAndApplicationComponents: "Binding Shell",
  ownsCreationNormalizationAndMediaProjection: "ViewModel",
  ownsStoryAndDefaultPlayerCharacterMutations: "ViewModel",
  ownsPortablePresentationAndSemanticActions: "Portable View",
});
