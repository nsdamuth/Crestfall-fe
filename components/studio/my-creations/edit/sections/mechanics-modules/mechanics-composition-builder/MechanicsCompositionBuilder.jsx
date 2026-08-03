"use client";

import MechanicsProgressionProfileFields from "../mechanics-progression-profile/MechanicsProgressionProfileFields";
import MechanicsCompositionBuilderView from "./MechanicsCompositionBuilder.view";
import { useMechanicsCompositionBuilderViewModel } from "./useMechanicsCompositionBuilderViewModel";

export default function MechanicsCompositionBuilder(props) {
  const viewProps = useMechanicsCompositionBuilderViewModel(props);
  return (
    <MechanicsCompositionBuilderView
      {...viewProps}
      ProgressionProfileFieldsComponent={MechanicsProgressionProfileFields}
    />
  );
}
