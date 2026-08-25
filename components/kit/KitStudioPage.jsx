"use client";

import KitStudioPageView from "./studio-page/KitStudioPage.view";
import { useKitStudioPageViewModel } from "./studio-page/useKitStudioPageViewModel";

export default function KitStudioPage(props) {
  const viewProps = useKitStudioPageViewModel(props);

  return <KitStudioPageView {...viewProps} />;
}
