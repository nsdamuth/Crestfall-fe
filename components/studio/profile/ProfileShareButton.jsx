"use client";

import ProfileShareButtonView from "./profile-share-button/ProfileShareButton.view";
import { useProfileShareButtonViewModel } from "./profile-share-button/useProfileShareButtonViewModel";

export default function ProfileShareButton(props) {
  const viewProps = useProfileShareButtonViewModel(props);

  return <ProfileShareButtonView {...viewProps} />;
}
