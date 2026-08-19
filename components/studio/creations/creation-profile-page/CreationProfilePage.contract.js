export const CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION =
  "creation-profile-page.view.v2";

/**
 * Portable Creation Profile Page contract.
 *
 * The View receives only display-ready creation/media models, semantic
 * callbacks, and application-owned slots. It does not interpret raw Creation
 * JSONB, call media/story clients, or navigate through Next.js.
 *
 * @typedef {Object} CreationProfilePageViewProps
 * @property {boolean} shouldRender
 * @property {string} loadErrorMessage
 * @property {Object|null} creation
 * @property {Object|null} description
 * @property {Array<Object>} mediaTabs
 * @property {string} query
 * @property {Array<Object>} visibleMedia
 * @property {boolean} hasMoreMedia
 * @property {boolean} startingChat
 * @property {string} chatError
 * @property {Object|null=} openingLocationPicker
 * @property {Object|null} libraryPassPanel
 * @property {Object|null} libraryPassModal
 * @property {string} libraryPassMessage
 * @property {string} libraryPassMessageTone
 * @property {import("react").ReactNode} statusBadgesSlot
 * @property {import("react").ReactNode} statsSlot
 * @property {import("react").ReactNode} creatorLinkSlot
 * @property {import("react").ReactNode} generateLinkSlot
 * @property {import("react").ReactNode} shareButtonSlot
 * @property {import("react").ReactNode} sortControlSlot
 * @property {Record<string, import("react").ReactNode>} mediaActionSlots
 * @property {import("react").ReactNode} lightboxSlot
 * @property {Function|null} onOpenLibraryPassPurchase
 * @property {Function|null} onCloseLibraryPassPurchase
 * @property {Function|null} onConfirmLibraryPassPurchase
 */

export const CREATION_PROFILE_PAGE_LAYER_OWNERSHIP = Object.freeze({
  rawCreationAndMediaNormalization: "ViewModel",
  mediaFilteringAndPagination: "ViewModel",
  reactionsAndStoryStart: "ViewModel",
  libraryPassStatePurchaseAndAccess: "ViewModel",
  accountBalanceContext: "ViewModel",
  nextNavigationAndApplicationComponents: "Binding Shell",
  visualComposition: "Portable View",
});
