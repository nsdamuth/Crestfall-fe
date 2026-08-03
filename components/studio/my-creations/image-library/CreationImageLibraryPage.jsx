"use client";

import Link from "next/link";

import MediaLightbox from "@/components/studio/media/MediaLightbox";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";

import CreationImageLibraryPageView from "./creation-image-library-page/CreationImageLibraryPage.view";
import { useCreationImageLibraryPageViewModel } from "./creation-image-library-page/useCreationImageLibraryPageViewModel";

export default function CreationImageLibraryPage(props) {
  const viewProps = useCreationImageLibraryPageViewModel(props);

  return (
    <CreationImageLibraryPageView
      {...viewProps}
      BackLinkComponent={Link}
      renderQuickActions={(quickActionProps) => (
        <MediaTileQuickActions {...quickActionProps} />
      )}
      renderLightbox={(lightboxProps) => <MediaLightbox {...lightboxProps} />}
    />
  );
}
