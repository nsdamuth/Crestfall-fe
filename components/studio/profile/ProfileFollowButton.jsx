"use client";

import ProfileFollowButtonView from "./profile-follow-button/ProfileFollowButton.view";
import { useProfileFollowButtonViewModel } from "./profile-follow-button/useProfileFollowButtonViewModel";

export default function ProfileFollowButton(props) {
  const viewProps = useProfileFollowButtonViewModel(props);

  return <ProfileFollowButtonView {...viewProps} />;
}
