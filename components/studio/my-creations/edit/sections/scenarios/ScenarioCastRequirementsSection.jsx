"use client";

import ScenarioReferencePickerModal from "@/components/studio/create/scenario/ScenarioReferencePickerModal";
import ScenarioCastRequirementsSectionView from "./scenario-cast-requirements-section/ScenarioCastRequirementsSection.view";
import { useScenarioCastRequirementsSectionViewModel } from "./scenario-cast-requirements-section/useScenarioCastRequirementsSectionViewModel";

export default function ScenarioCastRequirementsSection(props) {
  const { viewProps, referencePickerProps } =
    useScenarioCastRequirementsSectionViewModel(props);

  return (
    <>
      <ScenarioCastRequirementsSectionView {...viewProps} />

      {referencePickerProps ? (
        <ScenarioReferencePickerModal {...referencePickerProps} />
      ) : null}
    </>
  );
}
