"use client";

import CreationCard from "@/components/studio/creations/CreationCard";
import PublicProfileCreationGridView from "./public-profile-creation-grid/PublicProfileCreationGrid.view";
import { usePublicProfileCreationGridViewModel } from "./public-profile-creation-grid/usePublicProfileCreationGridViewModel";

export default function PublicProfileCreationGrid({ creations = [] }) {
  const {
    cardModels,
    onToggleLike,
    onToggleBookmark,
    ...viewProps
  } = usePublicProfileCreationGridViewModel({ creations });

  const creationSlots = cardModels.map((card) => (
    <CreationCard
      key={card.key}
      creation={card.creation}
      context="public"
      liked={card.liked}
      bookmarked={card.bookmarked}
      onToggleLike={onToggleLike}
      onToggleBookmark={onToggleBookmark}
    />
  ));

  return (
    <PublicProfileCreationGridView
      {...viewProps}
      creationSlots={creationSlots}
    />
  );
}
