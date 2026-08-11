"use client";

import KitDestinationTileView from "./destination-tile/KitDestinationTile.view";
import { useKitDestinationTileViewModel } from "./destination-tile/useKitDestinationTileViewModel";

export default function KitDestinationTile(props) {
  const viewProps = useKitDestinationTileViewModel(props);

  return <KitDestinationTileView {...viewProps} />;
}
