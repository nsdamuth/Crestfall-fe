"use client";

import StatsPoolsEditorView from "./stats-pools-editor/StatsPoolsEditor.view";
import { useStatsPoolsEditorViewModel } from "./stats-pools-editor/useStatsPoolsEditorViewModel";

export default function StatsPoolsEditor(props) {
  const viewProps = useStatsPoolsEditorViewModel(props);
  return <StatsPoolsEditorView {...viewProps} />;
}
