"use client";

import PublicProfileEngagementActionsView from "./public-profile-engagement-actions/PublicProfileEngagementActions.view";
import { usePublicProfileEngagementActionsViewModel } from "./public-profile-engagement-actions/usePublicProfileEngagementActionsViewModel";

export default function PublicProfileEngagementActions(props) {
  const viewProps = usePublicProfileEngagementActionsViewModel(props);

  return <PublicProfileEngagementActionsView {...viewProps} />;
}
