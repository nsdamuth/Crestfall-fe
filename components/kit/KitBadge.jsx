"use client";

import KitBadgeView from "./badge/KitBadge.view";
import { useKitBadgeViewModel } from "./badge/useKitBadgeViewModel";

export default function KitBadge(props) {
  const viewProps = useKitBadgeViewModel(props);

  return <KitBadgeView {...viewProps} />;
}
