"use client";

import StudioAccountMetricsView from "./studio-account-metrics/StudioAccountMetrics.view";
import { useStudioAccountMetricsViewModel } from "./studio-account-metrics/useStudioAccountMetricsViewModel";

export default function StudioAccountMetrics(props) {
  const viewProps = useStudioAccountMetricsViewModel(props);

  return <StudioAccountMetricsView {...viewProps} />;
}
