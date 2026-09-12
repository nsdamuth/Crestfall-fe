export const CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION =
  "creation-profile-page.view.v1";

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
 * @property {Array<{label: string, href?: string}>} [breadcrumbs] added
 *   12 Sep 2026 (eight-fix package FIX 4), optional and additive:
 *   Community, then the creation title, rendered above the header card.
 * @property {Object|null} description
 * @property {Array<Object>} mediaTabs
 * @property {string} query
 * @property {Object|null} libraryPassPanel Server-projected Library Pass state and purchase presentation.
 * @property {import("react").ReactNode} creditsSlot Conditional resolved attribution tab content.
 * @property {Array<Object>} visibleMedia
 * @property {boolean} hasMoreMedia
 * @property {boolean} startingChat
 * @property {string} chatError
 * @property {import("react").ReactNode} statusBadgesSlot
 * @property {import("react").ReactNode} statsSlot
 * @property {import("react").ReactNode} creatorLinkSlot
 * @property {import("react").ReactNode} generateLinkSlot
 * @property {import("react").ReactNode} shareButtonSlot
 * @property {Record<string, import("react").ReactNode>} mediaActionSlots
 * @property {import("react").ReactNode} lightboxSlot
 * @property {((tabId:string) => void)|null} [onSelectTab] doc-only addition (ED1G sw12), no version bump.
 * @property {((value:string) => void)|null} [onQueryChange] doc-only addition (ED1G sw12), no version bump.
 * @property {(() => void)|null} [onLoadMore] doc-only addition (ED1G sw12), no version bump.
 * @property {((media:Object) => void)|null} [onOpenMedia] doc-only addition (ED1G sw12), no version bump.
 * @property {(() => void)|null} [onPurchaseLibraryPass] Starts the idempotent Library Pass purchase flow. Since 12 Sep 2026 (eight-fix package FIX 6) this is the unlock dialog's primary handler and the only path that charges; the CTA opens the dialog instead.
 * @property {Object|null} [unlockDialog] added 12 Sep 2026 (FIX 6): display-ready state for the "Unlock full library?" confirmation (isOpen, title, summary, costLabel, balanceLabel, isBalanceKnown, canAfford, confirmLabel, isBusy, errorMessage). Cost comes from the served Library Pass state, balance from the account context; the View computes neither.
 * @property {(() => void)|null} [onOpenUnlockDialog] added 12 Sep 2026 (FIX 6): opened by the Unlock CTA and, since FIX 7, by every locked Library Pass tile.
 * @property {(() => void)|null} [onCloseUnlockDialog] added 12 Sep 2026 (FIX 6).
 * @property {boolean} [isBuyCoinsInfoOpen] added 12 Sep 2026 (FIX 6): the existing Buy Coins path, opened from the dialog when the balance is below the cost.
 * @property {(() => void)|null} [onOpenBuyCoinsInfo] added 12 Sep 2026 (FIX 6).
 * @property {(() => void)|null} [onCloseBuyCoinsInfo] added 12 Sep 2026 (FIX 6).
 * @property {(() => void)|null} [onToggleDescription] doc-only addition (ED1G sw12), no version bump.
 * @property {(() => void)|null} [onStartChat] doc-only addition (ED1G sw12), no version bump.
 */

export const CREATION_PROFILE_PAGE_LAYER_OWNERSHIP = Object.freeze({
  rawCreationAndMediaNormalization: "ViewModel",
  mediaFilteringAndPagination: "ViewModel",
  reactionsAndStoryStart: "ViewModel",
  libraryPassPurchaseAndLockedMediaPolicy: "ViewModel",
  nextNavigationAndApplicationComponents: "Binding Shell",
  visualComposition: "Portable View",
});
