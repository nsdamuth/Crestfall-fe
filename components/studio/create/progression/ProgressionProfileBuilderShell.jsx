"use client";

import ProgressionProfileBuilderView from "./progression-profile-builder/ProgressionProfileBuilder.view";
import { useProgressionProfileBuilderViewModel } from "./progression-profile-builder/useProgressionProfileBuilderViewModel";

export default function ProgressionProfileBuilderShell(props) {
  const viewProps = useProgressionProfileBuilderViewModel(props);
  return <ProgressionProfileBuilderView {...viewProps} />;
}
