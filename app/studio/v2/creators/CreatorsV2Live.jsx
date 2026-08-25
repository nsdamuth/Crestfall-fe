"use client";

import { useMemo } from "react";

import { projectCommunityCreators } from "@/lib/shared/presentation/creatorPresentation";
import CreatorsV2Mockup from "./CreatorsV2Mockup";

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
    />
  );
}
