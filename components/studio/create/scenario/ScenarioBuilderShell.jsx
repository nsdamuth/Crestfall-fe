"use client";

import ScenarioReferencePickerModal from "@/components/studio/create/scenario/ScenarioReferencePickerModal";
import ScenarioBuilderView from "./scenario-builder/ScenarioBuilder.view";
import { useScenarioBuilderViewModel } from "./scenario-builder/useScenarioBuilderViewModel";

export default function ScenarioBuilderShell(props) {
  const { viewProps, applicationContentProps } =
    useScenarioBuilderViewModel(props);
  const { referencePickerProps } = applicationContentProps;

  return (
    <>
      <ScenarioBuilderView {...viewProps} />
      {referencePickerProps ? (
        <ScenarioReferencePickerModal {...referencePickerProps} />
      ) : null}
    </>
  );
}
