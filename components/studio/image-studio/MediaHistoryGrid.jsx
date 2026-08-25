"use client";

import FilterPill from "./FilterPill";
import MediaLightbox from "@/components/studio/media/MediaLightbox";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";

import MediaHistoryGridView from "./media-history-grid/MediaHistoryGrid.view";
import { useMediaHistoryGridViewModel } from "./media-history-grid/useMediaHistoryGridViewModel";

export default function MediaHistoryGrid(props) {
  const viewProps = useMediaHistoryGridViewModel(props);

  return (
    <MediaHistoryGridView
      {...viewProps}
      mobilePrimaryActionLabel={props.mobilePrimaryActionLabel}
      onMobilePrimaryAction={props.onMobilePrimaryAction}
      FilterPillComponent={FilterPill}
      renderQuickActions={(quickActionProps) => (
        <MediaTileQuickActions {...quickActionProps} />
      )}
      renderLightbox={(lightboxProps) => <MediaLightbox {...lightboxProps} />}
    />
  );
}
