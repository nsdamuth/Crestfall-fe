"use client";

import PublicProfileDonateButtonView from "./public-profile-donate-button/PublicProfileDonateButton.view";
import { usePublicProfileDonateButtonViewModel } from "./public-profile-donate-button/usePublicProfileDonateButtonViewModel";

export default function PublicProfileDonateButton(props) {
  const viewProps = usePublicProfileDonateButtonViewModel(props);

  return <PublicProfileDonateButtonView {...viewProps} />;
}
