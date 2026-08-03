"use client";

import CreationShareButtonView from "./creation-share-button/CreationShareButton.view";
import { useCreationShareButtonViewModel } from "./creation-share-button/useCreationShareButtonViewModel";

export default function CreationShareButton(props) {
  const viewProps = useCreationShareButtonViewModel(props);

  return <CreationShareButtonView {...viewProps} />;
}
