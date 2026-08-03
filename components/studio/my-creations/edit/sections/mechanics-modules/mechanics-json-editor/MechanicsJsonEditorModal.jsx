"use client";

import MechanicsJsonEditorModalView from "./MechanicsJsonEditorModal.view";
import { useMechanicsJsonEditorViewModel } from "./useMechanicsJsonEditorViewModel";

export default function MechanicsJsonEditorModal(props) {
  const viewProps = useMechanicsJsonEditorViewModel(props);

  return <MechanicsJsonEditorModalView {...viewProps} />;
}
