"use client";

import StatsPoolsJsonEditorModalView from "./StatsPoolsJsonEditorModal.view";
import { useStatsPoolsJsonEditorViewModel } from "./useStatsPoolsJsonEditorViewModel";

export default function StatsPoolsJsonEditorModal(props) {
  const viewProps = useStatsPoolsJsonEditorViewModel(props);
  return <StatsPoolsJsonEditorModalView {...viewProps} />;
}
