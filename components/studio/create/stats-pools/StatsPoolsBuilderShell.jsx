"use client";

import StatsPoolsBuilderView from "./stats-pools-builder/StatsPoolsBuilder.view";
import { useStatsPoolsBuilderViewModel } from "./stats-pools-builder/useStatsPoolsBuilderViewModel";

export default function StatsPoolsBuilderShell(props) {
  const viewProps = useStatsPoolsBuilderViewModel(props);
  return <StatsPoolsBuilderView {...viewProps} />;
}
