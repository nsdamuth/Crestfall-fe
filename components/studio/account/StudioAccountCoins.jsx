"use client";

import StudioAccountCoinsView from "./studio-account-coins/StudioAccountCoins.view";
import { useStudioAccountCoinsViewModel } from "./studio-account-coins/useStudioAccountCoinsViewModel";

export default function StudioAccountCoins(props) {
  const viewProps = useStudioAccountCoinsViewModel(props);

  return <StudioAccountCoinsView {...viewProps} />;
}
