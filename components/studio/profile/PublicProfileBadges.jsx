"use client";

import PublicProfileBadgesView from "./public-profile-badges/PublicProfileBadges.view";
import { usePublicProfileBadgesViewModel } from "./public-profile-badges/usePublicProfileBadgesViewModel";

export default function PublicProfileBadges(props) {
  const viewProps = usePublicProfileBadgesViewModel(props);

  return <PublicProfileBadgesView {...viewProps} />;
}
