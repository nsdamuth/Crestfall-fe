"use client";

// Binding Shell. Wires the fixture-first owned-creations mock
// (pending CR-050) into the portable creation-picker View.
import { OWNED_CREATIONS_PICKER_MOCK } from "./creation-picker/ownedCreationsPicker.mock";
import CreationPickerView from "./creation-picker/CreationPicker.view";
import { useCreationPickerViewModel } from "./creation-picker/useCreationPickerViewModel";

export default function CreationPicker({
  title = "Choose a creation",
  onSelect = null,
  onClose = null,
  onCreateNew = null,
}) {
  const viewProps = useCreationPickerViewModel({
    creations: OWNED_CREATIONS_PICKER_MOCK,
    title,
    onSelect,
    onClose,
    onCreateNew,
  });

  return <CreationPickerView {...viewProps} />;
}
