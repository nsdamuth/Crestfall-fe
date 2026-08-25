"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

import CreationStatsRow from "@/components/studio/creations/CreationStatsRow";
import CreationStatusBadges from "@/components/studio/creations/CreationStatusBadges";
import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import KitCredits from "@/components/kit/KitCredits";
import LorePublicCreationPage from "@/components/studio/creations/lore/LorePublicCreationPage";
import MediaLightbox from "@/components/studio/media/MediaLightbox";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";

import CreationProfilePageView from "./creation-profile-page/CreationProfilePage.view";
import { useCreationProfilePageViewModel } from "./creation-profile-page/useCreationProfilePageViewModel";

function StandardCreationProfilePage(props) {
  const router = useRouter();
  const viewModel = useCreationProfilePageViewModel({
    ...props,
    navigate: (href) => router.push(href),
  });

  if (!viewModel.shouldRender) return null;

  const creation = viewModel.creation;
  const mediaActionSlots = Object.fromEntries(
    viewModel.visibleMedia.map((item) => [
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
    <CreationProfilePageView
      {...viewModel}
      statusBadgesSlot={
        creation ? <CreationStatusBadges creation={creation.raw} /> : null
      }
      statsSlot={creation ? <CreationStatsRow stats={creation.stats} /> : null}
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
          <MediaLightbox
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
  );
}

export default function CreationProfilePage(props) {
  const creationType = String(props?.creation?.type || "").trim().toUpperCase();

  if (creationType === "LORE") {
    return <LorePublicCreationPage {...props} />;
  }

  return <StandardCreationProfilePage {...props} />;
}
