"use client";

import Link from "next/link";

import PublicProfileActivityFeedView from "./public-profile-activity-feed/PublicProfileActivityFeed.view";
import { usePublicProfileActivityFeedViewModel } from "./public-profile-activity-feed/usePublicProfileActivityFeedViewModel";

export default function PublicProfileActivityFeed(props) {
  const viewProps = usePublicProfileActivityFeedViewModel(props);

  return <PublicProfileActivityFeedView {...viewProps} LinkComponent={Link} />;
}
