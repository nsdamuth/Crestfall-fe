"use client";

import KitFilterChipView from "./filter-chip/KitFilterChip.view";
import { useKitFilterChipViewModel } from "./filter-chip/useKitFilterChipViewModel";

export default function KitFilterChip(props) {
  const viewProps = useKitFilterChipViewModel(props);

  return <KitFilterChipView {...viewProps} />;
}
