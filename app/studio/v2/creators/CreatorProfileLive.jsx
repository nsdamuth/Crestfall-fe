"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CreatorProfileView from "./creator-profile/CreatorProfile.view";
import { projectLiveCreatorProfile } from "@/lib/shared/presentation/creatorProfilePresentation";
import { useCreationEngagementState } from "@/components/studio/engagement/hooks/useCreationEngagementState";
import {
  fetchProfileReactions,
  setProfileBookmark,
  setProfileLike,
} from "@/lib/client/studio/engagement/profileReactionClient";
import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";
import { donateProfileCoins } from "@/lib/client/studio/profile/creatorDonationClient";
import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import PublicProfileActivityFeedView from "@/components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.view";
import { buildPublicProfileActivityFeedViewProps } from "@/components/studio/profile/public-profile-activity-feed/usePublicProfileActivityFeedViewModel";
import PublicProfileBadgesView from "@/components/studio/profile/public-profile-badges/PublicProfileBadges.view";
import { buildPublicProfileBadgesViewProps } from "@/components/studio/profile/public-profile-badges/usePublicProfileBadgesViewModel";

const PAGE_SIZE = 8;
const MIN_DONATION = 100;
const EMPTY_DONATION = { amount: "", message: "", isAnonymous: false };

function canonBadges(item) {
  return item.isCanon ? [{ label: "Canon", variant: "canon" }] : [];
}

export default function CreatorProfileLive({ pageData = {} } = {}) {
  const router = useRouter();
  const projected = useMemo(() => projectLiveCreatorProfile(pageData), [pageData]);
  const { profile, stats, followState, works, badges } = projected;
  const engagementState = useCreationEngagementState(pageData.creations || []);

  const [isFollowing, setIsFollowing] = useState(followState.isFollowing);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [visibleWorksCount, setVisibleWorksCount] = useState(PAGE_SIZE);
  const [activeProfileTab, setActiveProfileTab] = useState("creations");
  const [notice, setNotice] = useState(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateFields, setDonateFields] = useState(EMPTY_DONATION);
  const [donateAmountError, setDonateAmountError] = useState("");

  useEffect(() => {
    if (!profile.id) return undefined;
    let cancelled = false;

    fetchProfileReactions([profile.id])
      .then((reactions) => {
        if (cancelled) return;
        setIsLiked(reactions.some((item) => item.profileId === profile.id && item.reactionType === "LIKE"));
        setIsBookmarked(
          reactions.some((item) => item.profileId === profile.id && item.reactionType === "BOOKMARK")
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  function openNotice(label, message) {
    setNotice({ label, message });
  }

  async function toggleFollow() {
    if (!followState.canFollow || !profile.handle) return;
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      await setProfileFollowByUsername({ username: profile.handle, active: next });
      router.refresh();
    } catch (error) {
      setIsFollowing(!next);
      openNotice("Follow", error?.message || "Follow state could not be saved.");
    }
  }

  async function toggleProfileLike() {
    if (!profile.id) return;
    const next = !isLiked;
    setIsLiked(next);
    try {
      await setProfileLike(profile.id, next);
      router.refresh();
    } catch (error) {
      setIsLiked(!next);
      openNotice("Like", error?.message || "Creator like could not be saved.");
    }
  }

  async function toggleProfileBookmark() {
    if (!profile.id) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      await setProfileBookmark(profile.id, next);
    } catch (error) {
      setIsBookmarked(!next);
      openNotice("Save", error?.message || "Creator save could not be saved.");
    }
  }

  async function shareProfile() {
    const href = `/studio/v2/creators/${encodeURIComponent(profile.handle)}`;
    const url = typeof window === "undefined" ? href : new URL(href, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({ title: profile.displayName, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        openNotice("Share", "Creator profile link copied.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        openNotice("Share", error?.message || "Creator profile could not be shared.");
      }
    }
  }

  async function submitDonation() {
    const amount = Number.parseInt(donateFields.amount, 10);
    if (!Number.isFinite(amount) || amount < MIN_DONATION) {
      setDonateAmountError(`Minimum donation is ${MIN_DONATION} coins.`);
      return;
    }

    try {
      const donation = await donateProfileCoins({
        recipientProfileId: profile.id,
        amountGross: amount,
        message: donateFields.message,
        isAnonymous: donateFields.isAnonymous,
      });
      setIsDonateModalOpen(false);
      setDonateFields(EMPTY_DONATION);
      setDonateAmountError("");
      openNotice(
        "Donate",
        `Donation sent. ${profile.displayName} received ${donation?.amountNet ?? amount} coins.`
      );
      router.refresh();
    } catch (error) {
      setDonateAmountError(error?.message || "Donation could not be completed.");
    }
  }

  async function playWork(item) {
    if (!isChatCapableCreationType(item.type)) {
      router.push(`/studio/creations/${encodeURIComponent(item.id)}`);
      return;
    }

    try {
      const payload = await startStoryFromCreation(item.rawCreation || item);
      const roomId = payload?.room?.id;
      if (!roomId) throw new Error("Story was created without a room id.");
      router.push(`/studio/story-rooms/${encodeURIComponent(roomId)}`);
    } catch (error) {
      openNotice("Start Story", error?.message || "Story could not be started.");
    }
  }

  const visibleWorks = works.slice(0, visibleWorksCount);
  const workItems = visibleWorks.map((item) => ({
    cardKind: "creation",
    layout: "grid",
    assetKind: item.assetKind,
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    badges: canonBadges(item),
    stats: {
      plays: item.plays,
      hearts: item.hearts,
      saves: item.saves,
      followers: null,
    },
    liked: engagementState.isCreationLiked(item),
    bookmarked: engagementState.isCreationBookmarked(item),
    onOpenAssetDetail: () => router.push(`/studio/creations/${encodeURIComponent(item.id)}`),
    onOpenImageOverlay: () => router.push(`/studio/creations/${encodeURIComponent(item.id)}`),
    onLike: () => engagementState.toggleCreationLike(item),
    onBookmark: () => engagementState.toggleCreationBookmark(item),
    onPlay: isChatCapableCreationType(item.type) ? () => playWork(item) : null,
  }));

  const worksHasMore = visibleWorksCount < works.length;
  const activityFeedProps = useMemo(
    () =>
      buildPublicProfileActivityFeedViewProps({
        profile: pageData.profile,
        creations: pageData.creations,
        donationEvents: pageData.donationEvents,
      }),
    [pageData.profile, pageData.creations, pageData.donationEvents]
  );
  const publicBadgesProps = useMemo(
    () => buildPublicProfileBadgesViewProps({ badges: pageData.badges }),
    [pageData.badges]
  );
  const partialLoadNotice = pageData.loadError || pageData.donationLoadError || null;

  return (
    <CreatorProfileView
      displayName={profile.displayName}
      handle={profile.handle}
      bio={profile.bio}
      avatarSrc={profile.avatarSrc}
      stats={stats}
      engagement={{
        isFollowing,
        canFollow: followState.canFollow,
        isOwnProfile: followState.isOwnProfile,
        onFollow: followState.canFollow ? toggleFollow : null,
        isLiked,
        onLike: toggleProfileLike,
        isBookmarked,
        onBookmark: toggleProfileBookmark,
        onShare: shareProfile,
        canDonate: !followState.isOwnProfile && Boolean(profile.id),
        onOpenDonate: () => setIsDonateModalOpen(true),
        showMute: false,
        isMuted: false,
        onToggleMute: null,
      }}
      onOpenFollowers={() =>
        router.push(`/studio/v2/creators/${encodeURIComponent(profile.handle)}/connections?tab=followers`)
      }
      onOpenFollowing={() =>
        router.push(`/studio/v2/creators/${encodeURIComponent(profile.handle)}/connections?tab=following`)
      }
      activeTab={activeProfileTab}
      onSelectTab={setActiveProfileTab}
      workItems={workItems}
      worksEmptyMessage={works.length ? null : "Nothing published yet."}
      worksLoadMore={{
        isLoading: false,
        hasMore: worksHasMore,
        remainingCount: worksHasMore ? works.length - visibleWorksCount : null,
        onLoadMore: () => setVisibleWorksCount((current) => current + PAGE_SIZE),
      }}
      activityContentSlot={
        <PublicProfileActivityFeedView {...activityFeedProps} LinkComponent={Link} />
      }
      activityItems={[]}
      activityEmptyMessage={null}
      activityLoadMore={{ isLoading: false, hasMore: false, remainingCount: null, onLoadMore: null }}
      badgesContentSlot={<PublicProfileBadgesView {...publicBadgesProps} />}
      badgeItems={badges}
      badgesEmptyMessage={null}
      errorMessage={!profile.id ? pageData.loadError || "This creator's profile could not be loaded." : null}
      isLoading={false}
      isDonateModalOpen={isDonateModalOpen}
      donateModal={{
        recipientDisplayName: profile.displayName,
        amount: donateFields.amount,
        onAmountChange: (value) => {
          setDonateFields((current) => ({ ...current, amount: value }));
          if (donateAmountError) setDonateAmountError("");
        },
        amountError: donateAmountError,
        message: donateFields.message,
        onMessageChange: (value) => setDonateFields((current) => ({ ...current, message: value })),
        isAnonymous: donateFields.isAnonymous,
        onAnonymousChange: (value) =>
          setDonateFields((current) => ({ ...current, isAnonymous: value })),
        onSubmit: submitDonation,
        onClose: () => {
          setIsDonateModalOpen(false);
          setDonateAmountError("");
        },
      }}
      bottomBanner={{
        eyebrow: "Next stop",
        title: "Read the world this creator is writing into.",
        ctaLabel: "Read the lore",
        imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Crash Santosa.png"),
        onCtaClick: () => router.push("/studio/v2/lore"),
      }}
      notice={notice || (partialLoadNotice
        ? { label: "Profile data", message: partialLoadNotice }
        : engagementState.engagementMessage
          ? { label: "Creation engagement", message: engagementState.engagementMessage }
          : null)}
      onCloseNotice={() => {
        setNotice(null);
        engagementState.setEngagementMessage("");
      }}
    />
  );
}
