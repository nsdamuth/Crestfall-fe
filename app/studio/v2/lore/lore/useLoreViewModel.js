"use client";

// Normalizes loreContent.mock.js into Lore.view.jsx props and owns
// every piece of presentation-only local state: the three filter
// groups (approval state, world or faction, recency), the community
// section's load-more batch size, and the R4 fixture-action notice.
// Routing is not owned here: the Shell passes onNavigate (real
// Next.js navigation for built destinations) and this hook decides,
// per control, whether to call it or open the honest stub notice
// instead.
//
// Item 39, RULED 10 Aug 2026: the write-new-lore action is the top
// banner CTA, "Write lore," opening the creation modal (modal-frame
// plus KitFormField fields and KitAlertStrip approval notices). Wired
// this pass now that waves H2a (form-field) and H2c (alert-strip)
// have landed. Submission itself still stubs with the R4 notice: no
// services-api exists to submit to (CR-015 pipeline confirmation
// stays open with Nick, non-blocking, per docs/SPRINT-G-PLAN.md
// section 4).
import { useMemo, useState } from "react";

import {
  LORE_APPROVAL_OPTIONS,
  LORE_WORLD_OPTIONS,
  LORE_RECENCY_OPTIONS,
  LORE_COMMUNITY_ITEMS,
  LORE_MINE_ITEMS,
} from "./loreContent.mock";

const PAGE_SIZE = 4;

const CREATE_FIELDS_INITIAL = { title: "", world: "", content: "" };

const TOP_BANNER = {
  eyebrow: "Lore",
  title: "Write into the world.",
  ctaLabel: "Write lore",
};

// Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
// banner-audit sitting): Dalethia.png, reassigned off
// athelgard-ampitheater-profile.png so Lore does not share a banner
// with Home (one click apart, see docs/reviews/BANNER-AUDIT.md).
const BOTTOM_BANNER = {
  eyebrow: "Loop",
  title: "Back to where every session starts.",
  ctaLabel: "Return to Home",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Dalethia.png"),
};

function recencyTier(daysAgo) {
  if (daysAgo <= 7) return "week";
  if (daysAgo <= 30) return "month";
  return "all";
}

function withinRecency(daysAgo, selectedTiers) {
  if (!selectedTiers.length) return true;
  const tier = recencyTier(daysAgo);
  if (selectedTiers.includes("all")) return true;
  return selectedTiers.includes(tier);
}

export function useLoreViewModel({ fixtureMode = "full", onNavigate = null } = {}) {
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState({});
  const [visibleCommunityCount, setVisibleCommunityCount] = useState(PAGE_SIZE);
  const [notice, setNotice] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFields, setCreateFields] = useState(CREATE_FIELDS_INITIAL);
  const [createTitleError, setCreateTitleError] = useState("");

  function toggleId(setter) {
    return (id) =>
      setter((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  const toggleLiked = toggleId(setLikedIds);
  const toggleSaved = toggleId(setSavedIds);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function navigateOrStub(route, label) {
    if (route) {
      onNavigate?.(route);
      return;
    }
    openNotice(label, `${label} opens once this section is built. Nothing was opened in this preview.`);
  }

  const communitySource =
    fixtureMode === "empty" || fixtureMode === "error"
      ? []
      : fixtureMode === "pendingApproval"
        ? []
        : LORE_COMMUNITY_ITEMS;
  const mineSource =
    fixtureMode === "empty" || fixtureMode === "error"
      ? []
      : fixtureMode === "pendingApproval"
        ? LORE_MINE_ITEMS.filter((item) => item.approvalState === "pending")
        : LORE_MINE_ITEMS;

  const filterGroups = useMemo(
    () => [
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
    []
  );

  function matchesFilters(item) {
    const approvalValues = selectedValues.approval || [];
    const worldValues = selectedValues.world || [];
    const recencyValues = selectedValues.recency || [];
    const query = searchValue.trim().toLowerCase();
    if (query && !item.title.toLowerCase().includes(query)) return false;
    if (approvalValues.length && !approvalValues.includes(item.approvalState)) return false;
    if (worldValues.length && !worldValues.includes(item.world)) return false;
    if (!withinRecency(item.daysAgo, recencyValues)) return false;
    return true;
  }

  const filteredCommunity = useMemo(
    () => communitySource.filter(matchesFilters),
    [communitySource, selectedValues, searchValue]
  );
  const filteredMine = useMemo(
    () => mineSource.filter(matchesFilters),
    [mineSource, selectedValues, searchValue]
  );

  // Lore edit door, RULED 10 Aug 2026 (h-restore ruling 4): the "Your
  // Lore" grid is the only edit door; its cards open the advanced lore
  // page directly, single path, no fork, the same way the Vault popup
  // opens the advanced editor. The advanced page exists at
  // /studio/create/lore (the standalone chapters/sections/blocks
  // builder) but only as a create-mode address, no per-id edit route;
  // navigating there from an existing card opens the builder honestly
  // rather than that item's saved content, the same CR-007/CR-008
  // reopen-in-place gap already carried for Vault. Community Lore
  // cards stay read-only (no advanced-editor path, no community/browse
  // list surface per ruling 4).
  function decorate(item, { showApprovalBadge, isMine }) {
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
      liked: likedIds.includes(item.id),
      bookmarked: savedIds.includes(item.id),
      onOpenAssetDetail: isMine
        ? () => onNavigate?.("/studio/create/lore")
        : () => openNotice(item.title, `Reading "${item.title}" opens once the Lore reading surface is built.`),
      onLike: () => toggleLiked(item.id),
      onBookmark: () => toggleSaved(item.id),
    };
  }

  const visibleCommunityItems = filteredCommunity.slice(0, visibleCommunityCount);
  const communityItems = visibleCommunityItems.map((item) =>
    decorate(item, { showApprovalBadge: false, isMine: false })
  );
  const mineItems = filteredMine.map((item) => decorate(item, { showApprovalBadge: true, isMine: true }));

  const communityHasMore = visibleCommunityCount < filteredCommunity.length;
  const communityRemainingCount = communityHasMore ? filteredCommunity.length - visibleCommunityCount : null;

  const communityEmptyMessage =
    filteredCommunity.length === 0 && fixtureMode !== "error"
      ? "No published Lore matches these filters yet."
      : null;
  const mineEmptyMessage =
    filteredMine.length === 0 && fixtureMode !== "error"
      ? "Nothing of yours matches these filters yet."
      : null;

  // Error state (10 Aug 2026 parity audit, section 2): no v2 page had
  // one; this restores the KitAlertStrip danger banner every fixture-
  // driven page now carries under fixtureMode "error".
  const errorMessage = fixtureMode === "error" ? "Lore could not be loaded." : null;

  const filterBar = {
    searchValue,
    searchPlaceholder: "Search Lore",
    onSearchChange: (value) => {
      setSearchValue(value);
      setVisibleCommunityCount(PAGE_SIZE);
    },
    filterGroups,
    selectedValues,
    onFilterToggle: (groupId, value) => {
      setSelectedValues((current) => {
        const currentValues = current[groupId] || [];
        const nextValues = currentValues.includes(value)
          ? currentValues.filter((entry) => entry !== value)
          : [...currentValues, value];
        return { ...current, [groupId]: nextValues };
      });
      setVisibleCommunityCount(PAGE_SIZE);
    },
  };

  const communityLoadMore = {
    isLoading: false,
    hasMore: communityHasMore,
    remainingCount: communityRemainingCount,
    onLoadMore: () => setVisibleCommunityCount((current) => current + PAGE_SIZE),
  };

  // Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
  // banner-audit sitting): The Seer.png, reassigned off
  // lilith-lux-eden-confrontation.png so Lore does not share a banner
  // with Home and Studio (see docs/reviews/BANNER-AUDIT.md); the
  // oracle character also reads well against "Write into the world."
  const topBanner = {
    ...TOP_BANNER,
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/The Seer.png"),
    onCtaClick: () => setIsCreateModalOpen(true),
  };

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => navigateOrStub("/studio/v2/home", "Return to Home"),
  };

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    setCreateFields(CREATE_FIELDS_INITIAL);
    setCreateTitleError("");
  }

  function setCreateField(field) {
    return (value) => {
      setCreateFields((current) => ({ ...current, [field]: value }));
      if (field === "title" && createTitleError) setCreateTitleError("");
    };
  }

  function submitCreateModal() {
    if (!createFields.title.trim()) {
      setCreateTitleError("Give your lore a title before submitting.");
      return;
    }
    closeCreateModal();
    openNotice(
      "Write lore",
      "Submission opens for review once the live approval pipeline is wired (CR-015). Nothing was published in this preview."
    );
  }

  const createModal = {
    title: createFields.title,
    onTitleChange: setCreateField("title"),
    titleError: createTitleError,
    world: createFields.world,
    onWorldChange: setCreateField("world"),
    content: createFields.content,
    onContentChange: setCreateField("content"),
    onSubmit: submitCreateModal,
    onClose: closeCreateModal,
    onOpenAdvancedEditor: () => onNavigate?.("/studio/create/lore"),
  };

  return {
    topBanner,
    filterBar,
    communityItems,
    communityEmptyMessage,
    communityLoadMore,
    mineItems,
    mineEmptyMessage,
    errorMessage,
    bottomBanner,
    isCreateModalOpen,
    createModal,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
