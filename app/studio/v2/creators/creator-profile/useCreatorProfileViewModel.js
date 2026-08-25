"use client";

// Normalizes creatorProfileContent.mock.js into CreatorProfile.view.jsx
// props and owns every piece of presentation-only local state: follow/
// like/bookmark/mute toggles, the works grid's load-more batch size,
// the donate modal's fields, and the R4 fixture-action notice. Routing
// is not owned here: the Shell passes onNavigate and onGoBack; this
// hook decides, per control, whether to call one of them or open the
// honest stub notice instead.
import { useMemo, useState } from "react";

import { CREATOR_PROFILE_LONGEST, resolveCreatorProfile } from "./creatorProfileContent.mock";

const PAGE_SIZE = 4;
// Activity list cap, RULED 11 Aug 2026: renders at most five entries,
// then the same batch-then-append KitLoadMoreView pattern the works
// grid already uses. Local honest floor; platform-wide high-volume
// list behavior is a queued Fable gate, not decided here.
const ACTIVITY_PAGE_SIZE = 5;
const DONATE_FIELDS_INITIAL = { amount: "", message: "", isAnonymous: false };

// Banner art, RULED 11 Aug 2026 (banner-anchor ruling, CC5
// banner-audit sitting): Crash Santosa.png, reassigned off Lilith.png
// so Creator Profile does not share a banner with Creators, Creator
// Connections, Community, and Vault, all one click apart. Rachel
// Sentry.png was tried first and rendered checked at 1440: her
// downward gaze crops out at the eyes under the ruled default anchor,
// leaving only chin and jewelry visible, so it was swapped for a
// forward-facing portrait instead (see docs/reviews/BANNER-AUDIT.md).
const BOTTOM_BANNER = {
  eyebrow: "Next stop",
  title: "Read the world this creator is writing into.",
  ctaLabel: "Read the lore",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Crash Santosa.png"),
};

export function useCreatorProfileViewModel({
  handle = "",
  fixtureMode = "default",
  onNavigate = null,
} = {}) {
  const record = useMemo(() => {
    if (fixtureMode === "longestContent") return CREATOR_PROFILE_LONGEST;
    return resolveCreatorProfile(handle) || resolveCreatorProfile("vermillion");
  }, [handle, fixtureMode]);

  const [isFollowing, setIsFollowing] = useState(record.isFollowing);
  const [isLiked, setIsLiked] = useState(record.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(record.isBookmarked);
  const [isMuted, setIsMuted] = useState(fixtureMode === "muted" ? true : record.isMuted);
  const [likedWorkIds, setLikedWorkIds] = useState([]);
  const [bookmarkedWorkIds, setBookmarkedWorkIds] = useState([]);
  const [visibleWorksCount, setVisibleWorksCount] = useState(PAGE_SIZE);
  const [activeTab, setActiveTab] = useState("creations");
  const [visibleActivityCount, setVisibleActivityCount] = useState(ACTIVITY_PAGE_SIZE);
  const [notice, setNotice] = useState(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(fixtureMode === "longestContent");
  const [donateFields, setDonateFields] = useState(
    fixtureMode === "longestContent"
      ? { amount: "25", message: "For the Sundered Choir chapters. Keep writing.", isAnonymous: true }
      : DONATE_FIELDS_INITIAL
  );
  const [donateAmountError, setDonateAmountError] = useState("");

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  function toggleWorkId(setter) {
    return (id) => setter((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }
  const toggleLikedWork = toggleWorkId(setLikedWorkIds);
  const toggleBookmarkedWork = toggleWorkId(setBookmarkedWorkIds);

  const worksSource = fixtureMode === "empty" || fixtureMode === "error" ? [] : record.works;
  const activitySource = fixtureMode === "empty" || fixtureMode === "error" ? [] : record.activity;
  const badgesSource = fixtureMode === "empty" || fixtureMode === "error" ? [] : record.badges;

  const visibleWorks = worksSource.slice(0, visibleWorksCount);
  const workItems = visibleWorks.map((item) => ({
    cardKind: "creation",
    assetKind: "character",
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    badges: item.badges || [],
    stats: item.stats,
    liked: likedWorkIds.includes(item.id),
    bookmarked: bookmarkedWorkIds.includes(item.id),
    onOpenAssetDetail: () =>
      openNotice(item.title, `Opening "${item.title}" opens once the creation-detail surface is built.`),
    onLike: () => toggleLikedWork(item.id),
    onBookmark: () => toggleBookmarkedWork(item.id),
  }));

  const worksHasMore = visibleWorksCount < worksSource.length;
  const worksLoadMore = {
    isLoading: false,
    hasMore: worksHasMore,
    remainingCount: worksHasMore ? worksSource.length - visibleWorksCount : null,
    onLoadMore: () => setVisibleWorksCount((current) => current + PAGE_SIZE),
  };

  const visibleActivity = activitySource.slice(0, visibleActivityCount);
  const activityHasMore = visibleActivityCount < activitySource.length;
  const activityLoadMore = {
    isLoading: false,
    hasMore: activityHasMore,
    remainingCount: activityHasMore ? activitySource.length - visibleActivityCount : null,
    onLoadMore: () => setVisibleActivityCount((current) => current + ACTIVITY_PAGE_SIZE),
  };

  const worksEmptyMessage = worksSource.length === 0 && fixtureMode !== "error" ? "Nothing published yet." : null;
  const activityEmptyMessage =
    activitySource.length === 0 && fixtureMode !== "error" ? "No activity yet." : null;
  const badgesEmptyMessage = badgesSource.length === 0 && fixtureMode !== "error" ? "No badges yet." : null;

  const errorMessage = fixtureMode === "error" ? "This creator's profile could not be loaded." : null;
  const isLoading = fixtureMode === "loading";

  function submitDonate() {
    const parsed = Number(donateFields.amount);
    if (!donateFields.amount || Number.isNaN(parsed) || parsed <= 0) {
      setDonateAmountError("Enter an amount greater than zero.");
      return;
    }
    setIsDonateModalOpen(false);
    setDonateFields(DONATE_FIELDS_INITIAL);
    setDonateAmountError("");
    openNotice(
      "Donate",
      "Donations are wired once the coin economy pipeline lands (CR pending, see report). Nothing was sent in this preview."
    );
  }

  function closeDonate() {
    setIsDonateModalOpen(false);
    setDonateFields(DONATE_FIELDS_INITIAL);
    setDonateAmountError("");
  }

  const donateModal = {
    recipientDisplayName: record.displayName,
    amount: donateFields.amount,
    onAmountChange: (value) => {
      setDonateFields((current) => ({ ...current, amount: value }));
      if (donateAmountError) setDonateAmountError("");
    },
    amountError: donateAmountError,
    message: donateFields.message,
    onMessageChange: (value) => setDonateFields((current) => ({ ...current, message: value })),
    isAnonymous: donateFields.isAnonymous,
    onAnonymousChange: (value) => setDonateFields((current) => ({ ...current, isAnonymous: value })),
    onSubmit: submitDonate,
    onClose: closeDonate,
  };

  const engagement = {
    isFollowing,
    onFollow: () => setIsFollowing((current) => !current),
    isLiked,
    onLike: () => setIsLiked((current) => !current),
    isBookmarked,
    onBookmark: () => setIsBookmarked((current) => !current),
    onShare: () =>
      openNotice("Share", "Sharing this profile is wired once the page goes live. Nothing was shared in this preview."),
    onOpenDonate: () => setIsDonateModalOpen(true),
    isMuted,
    onToggleMute: () => setIsMuted((current) => !current),
  };

  const bottomBanner = {
    ...BOTTOM_BANNER,
    onCtaClick: () => {
      if (onNavigate) {
        onNavigate("/studio/v2/lore");
        return;
      }
      openNotice("Read the lore", "This banner routes to Lore. Nothing was opened in this preview.");
    },
  };

  return {
    displayName: record.displayName,
    handle: record.handle,
    bio: record.bio,
    avatarSrc: record.avatarSrc,
    stats: record.stats,
    engagement,
    onOpenFollowers: () => {
      if (onNavigate) {
        onNavigate(`/studio/v2/creators/${record.handle}/connections?tab=followers`);
        return;
      }
      openNotice("Followers", "This tile opens the connections page once it is live. Nothing was opened in this preview.");
    },
    onOpenFollowing: () => {
      if (onNavigate) {
        onNavigate(`/studio/v2/creators/${record.handle}/connections?tab=following`);
        return;
      }
      openNotice("Following", "This tile opens the connections page once it is live. Nothing was opened in this preview.");
    },
    // RULED 11 Aug 2026 (Sprint H render review, item 6): no Plays
    // destination exists anywhere in the app yet, and surfacing one
    // needs an aggregate play-count-by-creator query the backend does
    // not expose today. Honest stub notice, same shape as every other
    // R4 not-yet-wired control on this page. CR-040 filed
    // (docs/CONTRACT-REQUESTS.md) for the needed backend support.
    onOpenPlays: () =>
      openNotice(
        "Plays",
        "A dedicated Plays view is not built yet; it needs a backend aggregate this creator's plays across every published work. CR-040 requests it. Nothing was opened in this preview."
      ),
    activeTab,
    onSelectTab: setActiveTab,
    workItems,
    worksEmptyMessage,
    worksLoadMore,
    activityItems: visibleActivity,
    activityEmptyMessage,
    activityLoadMore,
    badgeItems: badgesSource,
    badgesEmptyMessage,
    errorMessage,
    isLoading,
    isDonateModalOpen,
    donateModal,
    bottomBanner,
    notice,
    onCloseNotice: () => setNotice(null),
  };
}
