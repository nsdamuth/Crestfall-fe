"use client";

import KitLoadMoreView from "./load-more/KitLoadMore.view";
import { useKitLoadMoreViewModel } from "./load-more/useKitLoadMoreViewModel";

export default function KitLoadMore(props) {
  const viewProps = useKitLoadMoreViewModel(props);

  return <KitLoadMoreView {...viewProps} />;
}
