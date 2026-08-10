"use client";

import KitStudioFilterBarView from "./studio-filter-bar/KitStudioFilterBar.view";
import { useKitStudioFilterBarViewModel } from "./studio-filter-bar/useKitStudioFilterBarViewModel";

export default function KitStudioFilterBar(props) {
  const viewProps = useKitStudioFilterBarViewModel(props);

  return <KitStudioFilterBarView {...viewProps} />;
}
