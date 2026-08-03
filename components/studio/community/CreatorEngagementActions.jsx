"use client";

import CreatorEngagementActionsView from "./creator-engagement-actions/CreatorEngagementActions.view";
import { useCreatorEngagementActionsViewModel } from "./creator-engagement-actions/useCreatorEngagementActionsViewModel";

export default function CreatorEngagementActions(props) {
  const viewProps = useCreatorEngagementActionsViewModel(props);

  return <CreatorEngagementActionsView {...viewProps} />;
}
