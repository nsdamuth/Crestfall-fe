"use client";

import KitPromoBannerView from "./promo-banner/KitPromoBanner.view";
import { useKitPromoBannerViewModel } from "./promo-banner/useKitPromoBannerViewModel";

export default function KitPromoBanner(props) {
  const viewProps = useKitPromoBannerViewModel(props);

  return <KitPromoBannerView {...viewProps} />;
}
