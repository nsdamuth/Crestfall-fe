"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

import CreationStatsRow from "@/components/studio/creations/CreationStatsRow";
import CreationStatusBadges from "@/components/studio/creations/CreationStatusBadges";
import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import CreationProfileImageViewer from "@/components/studio/creations/CreationProfileImageViewer";
import KitCredits from "@/components/kit/KitCredits";
import LorePublicCreationPage from "@/components/studio/creations/lore/LorePublicCreationPage";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";
import StoryLaunchRequirementsSheet from "@/components/studio/story-rooms/StoryLaunchRequirementsSheet";
import { useStoryLaunchController } from "@/components/studio/story-rooms/hooks/useStoryLaunchController";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import {
  EDIT_RUN_COIN_COST,
  UPSCALE_COIN_COST,
} from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";

import CreationProfilePageView from "./creation-profile-page/CreationProfilePage.view";
import { useCreationProfilePageViewModel } from "./creation-profile-page/useCreationProfilePageViewModel";

// The viewer's costs come from the two workbench constants, the one
// place each is defined (docs/handoffs/MEDIA-STUDIO-BACKEND.md, COSTS),
// the way the Media Studio page reads them through viewerCoinCosts.
const VIEWER_COIN_COSTS = {
  upscale: UPSCALE_COIN_COST,
  editRun: EDIT_RUN_COIN_COST,
};

function StandardCreationProfilePage(props) {
  const router = useRouter();
  const launchController = useStoryLaunchController();
  // Coin balance for the unlock confirmation (FIX 6, 12 Sep 2026):
  // the same account context the sidebar economy widget reads.
  const { coinBalance, accountStatus } = useStudioAccount();
  const viewModel = useCreationProfilePageViewModel({
    ...props,
    coinBalance,
    accountStatus,
    navigate: (href) => router.push(href),
    refreshPage: () => router.refresh(),
    onStartStory: launchController.launch,
    storyLaunchError: launchController.launchError,
  });

  if (!viewModel.shouldRender) return null;

  const creation = viewModel.creation;
  const mediaActionSlots = Object.fromEntries(
    viewModel.visibleMedia
      .filter((item) => !item.isLocked)
      .map((item) => [
        item.id,
        <MediaTileQuickActions
          key={`actions-${item.id}`}
          liked={item.liked}
          bookmarked={item.bookmarked}
          onToggleLike={() => viewModel.onToggleLike(item)}
          onToggleBookmark={() => viewModel.onToggleBookmark(item)}
          onExpand={() => viewModel.onOpenMedia(item.id)}
        />,
      ])
  );

  return (
    <>
      <CreationProfilePageView
      {...viewModel}
      statusBadgesSlot={
        creation ? <CreationStatusBadges creation={creation.raw} /> : null
      }
      statsSlot={
        creation ? (
          <CreationStatsRow
            creationType={creation.type}
            usageMetrics={creation.usageMetrics}
            stats={creation.stats}
          />
        ) : null
      }
      creatorLinkSlot={
        creation?.creatorProfileHref ? (
          <Link
            href={creation.creatorProfileHref}
            className="text-[var(--ink)] transition hover:text-[var(--gold-ornament)]"
          >
            {creation.creatorHandle}
          </Link>
        ) : null
      }
      generateLinkSlot={
        creation ? (
          <Link
            href={creation.imageStudioHref}
            className="cf-btn cf-btn--secondary"
          >
            <Camera size={14} />
            Generate
          </Link>
        ) : null
      }
      shareButtonSlot={
        creation ? (
          <CreationShareButton href={creation.catalogueHref} label="Share" />
        ) : null
      }
      creditsSlot={
        creation?.credits?.length ? (
          <KitCredits credits={creation.credits} showHeading={false} />
        ) : null
      }
      mediaActionSlots={mediaActionSlots}
      lightboxSlot={
        viewModel.activePreviewItem && creation ? (
          <CreationProfileImageViewer
            viewerCoinCosts={VIEWER_COIN_COSTS}
            items={viewModel.filteredMedia}
            activeItemId={viewModel.activePreviewItem.id}
            onSelectItem={viewModel.onSelectPreviewItem}
            onClose={viewModel.onCloseMedia}
            modeLabel="Public Catalogue"
            imageStudioHref={creation.imageStudioHref}
            allowDownload
            showStudioActions
            isItemLiked={viewModel.isItemLiked}
            isItemBookmarked={viewModel.isItemBookmarked}
            onToggleLike={viewModel.onToggleLike}
            onToggleBookmark={viewModel.onToggleBookmark}
          />
        ) : null
      }
      />
      <StoryLaunchRequirementsSheet picker={launchController.picker} />
    </>
  );
}

export default function CreationProfilePage(props) {
  const creationType = String(props?.creation?.type || "").trim().toUpperCase();

  if (creationType === "LORE") {
    return <LorePublicCreationPage {...props} />;
  }

  return <StandardCreationProfilePage {...props} />;
}
