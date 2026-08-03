"use client";

import Link from "next/link";

import CreationEditMediaPanelView from "./creation-edit-media-panel/CreationEditMediaPanel.view";
import { useCreationEditMediaPanelViewModel } from "./creation-edit-media-panel/useCreationEditMediaPanelViewModel";

export default function CreationEditMediaPanel(props) {
  const viewProps = useCreationEditMediaPanelViewModel(props);

  return <CreationEditMediaPanelView {...viewProps} LinkComponent={Link} />;
}
