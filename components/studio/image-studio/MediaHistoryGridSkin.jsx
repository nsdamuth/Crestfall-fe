"use client";

// The application-owned skin over MediaHistoryGridView: the three
// injected controls (filter pill, tile quick actions, lightbox). Split
// out of MediaHistoryGrid.jsx on 6 Sep 2026 (FE/FILTERS) so a page can
// call useMediaHistoryGridViewModel itself, own the shared filter bar,
// and still render the grid with its injections.
import FilterPill from "./FilterPill";
import MediaLightbox from "@/components/studio/media/MediaLightbox";
import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";

import MediaHistoryGridView from "./media-history-grid/MediaHistoryGrid.view";

export default function MediaHistoryGridSkin(props) {
  return (
    <MediaHistoryGridView
      {...props}
      FilterPillComponent={FilterPill}
      renderQuickActions={(quickActionProps) => <MediaTileQuickActions {...quickActionProps} />}
      renderLightbox={(lightboxProps) => <MediaLightbox {...lightboxProps} />}
    />
  );
}
