"use client";

import KitGlobalSearchView from "./global-search/KitGlobalSearch.view";
import { useKitGlobalSearchViewModel } from "./global-search/useKitGlobalSearchViewModel";

export default function KitGlobalSearch(props) {
  const viewProps = useKitGlobalSearchViewModel(props);
  return <KitGlobalSearchView {...viewProps} />;
}
