"use client";

import ProfileBackButtonView from "./profile-back-button/ProfileBackButton.view";
import { useProfileBackButtonViewModel } from "./profile-back-button/useProfileBackButtonViewModel";

export default function ProfileBackButton(props) {
  const viewProps = useProfileBackButtonViewModel(props);

  return <ProfileBackButtonView {...viewProps} />;
}
