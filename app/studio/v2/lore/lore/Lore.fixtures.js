// Local, deterministic View-shaped fixtures (docs/FRONTEND-SOP.md
// section 1, LOOM item 5): the four states named by docs/SPRINT-H-
// PLAN.md's Lore brief (default, empty, pending-approval, longest
// content). Built directly from useLoreViewModel's shape rather than
// re-deriving from loreContent.mock.js, so these exercise the View in
// isolation (preview route) without mounting the hook.
import {
  LORE_APPROVAL_OPTIONS,
  LORE_WORLD_OPTIONS,
  LORE_RECENCY_OPTIONS,
  LORE_COMMUNITY_ITEMS,
  LORE_MINE_ITEMS,
} from "./loreContent.mock";

const noop = () => {};

function decorate(item, { showApprovalBadge }) {
  const badges = [];
  if (item.approvalState === "canon") {
    badges.push({ label: "Canon", variant: "canon" });
  } else if (showApprovalBadge) {
    const label = LORE_APPROVAL_OPTIONS.find((option) => option.value === item.approvalState)?.label ?? "Draft";
    badges.push({ label, variant: "status" });
  }

  return {
    cardKind: "creation",
    assetKind: "lore",
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    badges,
    stats: item.stats,
    liked: false,
    bookmarked: false,
    onOpenAssetDetail: noop,
    onLike: noop,
    onBookmark: noop,
  };
}

const TOP_BANNER = {
  eyebrow: "Lore",
  title: "Write into the world.",
  ctaLabel: "Write lore",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
  onCtaClick: noop,
};

const BOTTOM_BANNER = {
  eyebrow: "Loop",
  title: "Back to where every session starts.",
  ctaLabel: "Return to Home",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
  onCtaClick: noop,
};

const FILTER_BAR = {
  searchValue: "",
  searchPlaceholder: "Search Lore",
  onSearchChange: noop,
  filterGroups: [
    {
      id: "approval",
      label: "Approval state",
      isMultiSelect: true,
      options: LORE_APPROVAL_OPTIONS.map((option) => ({ ...option, count: null })),
    },
    {
      id: "world",
      label: "World or faction",
      isMultiSelect: true,
      options: LORE_WORLD_OPTIONS.map((option) => ({ ...option, count: null })),
    },
    {
      id: "recency",
      label: "Recency",
      isMultiSelect: true,
      options: LORE_RECENCY_OPTIONS.map((option) => ({ ...option, count: null })),
    },
  ],
  selectedValues: {},
  onFilterToggle: noop,
};

const COMMUNITY_LOAD_MORE = {
  isLoading: false,
  hasMore: true,
  remainingCount: 3,
  onLoadMore: noop,
};

const CREATE_MODAL_CLOSED = {
  title: "",
  onTitleChange: noop,
  titleError: "",
  world: "",
  onWorldChange: noop,
  content: "",
  onContentChange: noop,
  onSubmit: noop,
  onClose: noop,
  onOpenAdvancedEditor: noop,
};

// Default: both sections populated, community grid mid-catalog with
// load-more available.
export const loreDefaultFixture = {
  topBanner: TOP_BANNER,
  filterBar: FILTER_BAR,
  communityItems: LORE_COMMUNITY_ITEMS.slice(0, 4).map((item) => decorate(item, { showApprovalBadge: false })),
  communityEmptyMessage: null,
  communityLoadMore: COMMUNITY_LOAD_MORE,
  mineItems: LORE_MINE_ITEMS.map((item) => decorate(item, { showApprovalBadge: true })),
  mineEmptyMessage: null,
  errorMessage: null,
  bottomBanner: BOTTOM_BANNER,
  isCreateModalOpen: false,
  createModal: CREATE_MODAL_CLOSED,
  notice: null,
  onCloseNotice: noop,
};

// Empty: nothing published, nothing drafted. Ruled empty-state law
// (matching Adventures' empty-catalog precedent): a message, not a
// fabricated placeholder card, in both sections.
export const loreEmptyFixture = {
  ...loreDefaultFixture,
  communityItems: [],
  communityEmptyMessage: "No published Lore matches these filters yet.",
  communityLoadMore: { ...COMMUNITY_LOAD_MORE, hasMore: false, remainingCount: null },
  mineItems: [],
  mineEmptyMessage: "Nothing of yours matches these filters yet.",
};

// Pending approval: the creator's own section filtered to drafts
// awaiting review, community section empty (nothing pending is
// public by definition).
export const lorePendingApprovalFixture = {
  ...loreDefaultFixture,
  filterBar: { ...FILTER_BAR, selectedValues: { approval: ["pending"] } },
  communityItems: [],
  communityEmptyMessage: "No published Lore matches these filters yet.",
  communityLoadMore: { ...COMMUNITY_LOAD_MORE, hasMore: false, remainingCount: null },
  mineItems: LORE_MINE_ITEMS.filter((item) => item.approvalState === "pending").map((item) =>
    decorate(item, { showApprovalBadge: true })
  ),
  mineEmptyMessage: null,
};

// Longest content: the full catalog visible, load-more exhausted, the
// longest title/subtitle fixture present in both sections, and the
// creation modal open with its longest states: a filled world/lore
// draft plus the title validation error.
export const loreLongestContentFixture = {
  ...loreDefaultFixture,
  communityItems: LORE_COMMUNITY_ITEMS.map((item) => decorate(item, { showApprovalBadge: false })),
  communityLoadMore: { isLoading: false, hasMore: false, remainingCount: null, onLoadMore: noop },
  mineItems: LORE_MINE_ITEMS.map((item) => decorate(item, { showApprovalBadge: true })),
  isCreateModalOpen: true,
  createModal: {
    ...CREATE_MODAL_CLOSED,
    title: "",
    titleError: "Give your lore a title before submitting.",
    world: "The Sundered Choir",
    content:
      "Before the Choir fractured, its seven voices sang the wards that kept Aethelgard's border quiet. What broke first was not the song, but the silence between verses that no one thought to guard.",
  },
};

// Error: load failed (10 Aug 2026 parity audit, section 2 fix). A
// KitAlertStrip danger banner replaces both grids; no page had this
// state before this pass.
export const loreErrorFixture = {
  ...loreDefaultFixture,
  communityItems: [],
  communityEmptyMessage: null,
  communityLoadMore: { ...COMMUNITY_LOAD_MORE, hasMore: false, remainingCount: null },
  mineItems: [],
  mineEmptyMessage: null,
  errorMessage: "Lore could not be loaded.",
};
