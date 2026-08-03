"use client";

import ViewModeToggle from "@/components/studio/ViewModeToggle";

import GamesHubView from "./games-hub/GamesHub.view";
import { useGamesHubViewModel } from "./games-hub/useGamesHubViewModel";

export default function GamesHub(props) {
  const viewProps = useGamesHubViewModel(props);

  return (
    <GamesHubView
      {...viewProps}
      ViewModeToggleComponent={ViewModeToggle}
    />
  );
}
