"use client";

import StudioEconomyWidgetView from "./studio-economy-widget/StudioEconomyWidget.view";
import { useStudioEconomyWidgetViewModel } from "./studio-economy-widget/useStudioEconomyWidgetViewModel";

export default function StudioEconomyWidget(props) {
  const viewProps = useStudioEconomyWidgetViewModel(props);

  return <StudioEconomyWidgetView {...viewProps} />;
}
