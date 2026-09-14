"use client";

import Link from "next/link";

import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";
import {
  EDIT_RUN_COIN_COST,
  UPSCALE_COIN_COST,
} from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";

import CreationImageLibraryImageViewer from "./CreationImageLibraryImageViewer";
import CreationImageLibraryPageView from "./creation-image-library-page/CreationImageLibraryPage.view";
import { useCreationImageLibraryPageViewModel } from "./creation-image-library-page/useCreationImageLibraryPageViewModel";

// The viewer's costs come from the two workbench constants, the one
// place each is defined (docs/handoffs/MEDIA-STUDIO-BACKEND.md, COSTS),
// the way the Media Studio and creation pages read them through
// viewerCoinCosts.
const VIEWER_COIN_COSTS = {
  upscale: UPSCALE_COIN_COST,
  editRun: EDIT_RUN_COIN_COST,
};

export default function CreationImageLibraryPage(props) {
  const viewProps = useCreationImageLibraryPageViewModel(props);

  return (
    <CreationImageLibraryPageView
      {...viewProps}
      BackLinkComponent={Link}
      ShareButtonComponent={CreationShareButton}
      renderQuickActions={(quickActionProps) => (
        <MediaTileQuickActions {...quickActionProps} />
      )}
      renderLightbox={(lightboxProps) => (
        <CreationImageLibraryImageViewer
          viewerCoinCosts={VIEWER_COIN_COSTS}
          {...lightboxProps}
        />
      )}
    />
  );
}
