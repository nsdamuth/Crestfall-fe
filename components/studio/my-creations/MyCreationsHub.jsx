"use client";

import Link from "next/link";

import CreationCard from "@/components/studio/creations/CreationCard";
import CreationTagFilterRow from "@/components/studio/creations/CreationTagFilterRow";
import ResponsiveFilterPanel from "@/components/studio/ui/ResponsiveFilterPanel";
import MyCreationsHubView from "./my-creations-hub/MyCreationsHub.view";
import { useMyCreationsHubViewModel } from "./my-creations-hub/useMyCreationsHubViewModel";

export default function MyCreationsHub(props) {
  const viewProps = useMyCreationsHubViewModel(props);

  return (
    <MyCreationsHubView
      {...viewProps}
      InternalLinkComponent={Link}
      FilterPanelComponent={ResponsiveFilterPanel}
      TagFilterComponent={CreationTagFilterRow}
      CreationCardComponent={CreationCard}
    />
  );
}
