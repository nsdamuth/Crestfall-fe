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
 * @property {Function} onClose
 * @property {Function} onToggleDescription
 * @property {Function} onSelectMedia
 * @property {Function} onPreviousMedia
 * @property {Function} onNextMedia
 * @property {Function=} onToggleLike
 * @property {Function=} onToggleBookmark
 * @property {Function} onStartStory
 * @property {Function} onSetDefaultPc
 * @property {import("react").ElementType} [LinkComponent] doc-only addition (ED1G sw12), no version bump.
 * @property {Object} [statusBadgesProps] doc-only addition (ED1G sw12), no version bump.
 * @property {Object} [statsRowProps] doc-only addition (ED1G sw12), no version bump.
 * @property {string} [moreSlideBackgroundImage] doc-only addition (ED1G sw12), no version bump.
 * @property {import("react").ElementType} [StatusBadgesComponent] doc-only addition (ED1G sw12): injected subcomponent, no version bump.
 * @property {import("react").ElementType} [StatsRowComponent] doc-only addition (ED1G sw12): injected subcomponent, no version bump.
 * @property {import("react").ElementType} [CreditsComponent] doc-only addition (ED1G sw12): injected subcomponent, no version bump.
 * @property {import("react").ElementType} [ShareButtonComponent] doc-only addition (ED1G sw12): injected subcomponent, no version bump.
 */

export const creationPreviewModalOwnership = Object.freeze({
  ownsNextNavigationAndApplicationComponents: "Binding Shell",
  ownsCreationNormalizationAndMediaProjection: "ViewModel",
  ownsStoryAndDefaultPlayerCharacterMutations: "ViewModel",
  ownsPortablePresentationAndSemanticActions: "Portable View",
});
