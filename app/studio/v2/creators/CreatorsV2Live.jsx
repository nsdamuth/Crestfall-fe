"use client";

import { useMemo } from "react";

import { projectCommunityCreators } from "@/lib/shared/presentation/creatorPresentation";
import {
  EDIT_RUN_COIN_COST,
  UPSCALE_COIN_COST,
} from "@/components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel";
import CreatorsV2Mockup from "./CreatorsV2Mockup";

// The viewer's costs come from the two workbench constants, the one
// place each is defined (docs/handoffs/MEDIA-STUDIO-BACKEND.md, COSTS),
// the way the Media Studio and creation pages read them through
// viewerCoinCosts (fe/updates follow-up 1, FIX 1, 13 Sep 2026).
const VIEWER_COIN_COSTS = {
  upscale: UPSCALE_COIN_COST,
  editRun: EDIT_RUN_COIN_COST,
};

export default function CreatorsV2Live({
  creators = [],
  creations = [],
  viewerUsername = null,
  followingUsernames = [],
  loadError = null,
} = {}) {
  const items = useMemo(
    () =>
      projectCommunityCreators(creators, {
        creations,
        viewerUsername,
        followingUsernames,
      }),
    [creators, creations, viewerUsername, followingUsernames]
  );

  return (
    <CreatorsV2Mockup
      live
      creators={items}
      viewerUsername={viewerUsername}
      loadError={loadError}
      viewerCoinCosts={VIEWER_COIN_COSTS}
    />
  );
}
