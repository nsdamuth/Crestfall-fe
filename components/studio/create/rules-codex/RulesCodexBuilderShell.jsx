"use client";

import RulesCodexBuilderView from "./rules-codex-builder/RulesCodexBuilder.view";
import { useRulesCodexBuilderViewModel } from "./rules-codex-builder/useRulesCodexBuilderViewModel";

export default function RulesCodexBuilderShell(props) {
  const viewProps = useRulesCodexBuilderViewModel(props);

  return <RulesCodexBuilderView {...viewProps} />;
}
