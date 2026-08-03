"use client";

import RegistryLinkedCreationPickerModalView from "./registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view";
import { useRegistryLinkedCreationPickerViewModel } from "./registry-linked-creation-picker/useRegistryLinkedCreationPickerViewModel";

export default function RegistryLinkedCreationPickerModal(props) {
  const viewProps = useRegistryLinkedCreationPickerViewModel(props);

  return <RegistryLinkedCreationPickerModalView {...viewProps} />;
}
