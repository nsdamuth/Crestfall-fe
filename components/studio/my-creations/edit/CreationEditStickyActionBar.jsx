"use client";

import CreationEditStickyActionBarView from "./creation-edit-sticky-action-bar/CreationEditStickyActionBar.view";
import { useCreationEditStickyActionBarViewModel } from "./creation-edit-sticky-action-bar/useCreationEditStickyActionBarViewModel";

export default function CreationEditStickyActionBar(props) {
  const viewProps = useCreationEditStickyActionBarViewModel(props);

  return <CreationEditStickyActionBarView {...viewProps} />;
}
