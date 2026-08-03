"use client";

import CreationCard from "@/components/studio/creations/CreationCard";
import CreationTagFilterRow from "@/components/studio/creations/CreationTagFilterRow";
import CreatorCard from "@/components/studio/community/CreatorCard";
import CreatorListRow from "@/components/studio/community/CreatorListRow";
import ResponsiveFilterPanel from "@/components/studio/ui/ResponsiveFilterPanel";
import CrestfallSelect from "@/components/ui/CrestfallSelect";

import CommunityHubView from "./community-hub/CommunityHub.view";
import { useCommunityHubViewModel } from "./community-hub/useCommunityHubViewModel";

export default function CommunityHub(props) {
  const viewProps = useCommunityHubViewModel(props);

  return (
    <CommunityHubView
      {...viewProps}
      FilterPanelComponent={ResponsiveFilterPanel}
      SelectComponent={CrestfallSelect}
      TagFilterComponent={CreationTagFilterRow}
      CreationCardComponent={CreationCard}
      CreatorCardComponent={CreatorCard}
      CreatorListRowComponent={CreatorListRow}
    />
  );
}
