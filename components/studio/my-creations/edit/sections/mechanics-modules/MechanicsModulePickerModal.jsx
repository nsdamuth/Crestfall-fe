"use client";

import MechanicsModulePickerModalView from "./mechanics-module-picker/MechanicsModulePickerModal.view";
import { useMechanicsModulePickerViewModel } from "./mechanics-module-picker/useMechanicsModulePickerViewModel";

export default function MechanicsModulePickerModal(props) {
  const viewProps = useMechanicsModulePickerViewModel(props);

  return <MechanicsModulePickerModalView {...viewProps} />;
}
