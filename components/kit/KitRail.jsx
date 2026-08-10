"use client";

import KitRailView from "./rail/KitRail.view";
import { useKitRailViewModel } from "./rail/useKitRailViewModel";

export default function KitRail(props) {
  const viewProps = useKitRailViewModel(props);

  return <KitRailView {...viewProps} />;
}
