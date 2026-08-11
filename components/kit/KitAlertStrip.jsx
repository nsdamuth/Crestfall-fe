"use client";

import KitAlertStripView from "./alert-strip/KitAlertStrip.view";
import { useKitAlertStripViewModel } from "./alert-strip/useKitAlertStripViewModel";

export default function KitAlertStrip(props) {
  const viewProps = useKitAlertStripViewModel(props);

  return <KitAlertStripView {...viewProps} />;
}
