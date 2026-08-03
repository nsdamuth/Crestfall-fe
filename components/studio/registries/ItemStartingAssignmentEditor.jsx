"use client";

import RegistryLinkedCreationPickerModal from "@/components/studio/create/structured-registry/RegistryLinkedCreationPickerModal";
import ItemStartingAssignmentEditorView from "@/components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.view";
import { useItemStartingAssignmentEditorViewModel } from "@/components/studio/registries/item-starting-assignment-editor/useItemStartingAssignmentEditorViewModel";

export default function ItemStartingAssignmentEditor(props) {
  const { viewProps, applicationContentProps } =
    useItemStartingAssignmentEditorViewModel(props);

  const pickerSlot = applicationContentProps.isPickerOpen ? (
    <RegistryLinkedCreationPickerModal
      title={applicationContentProps.pickerTitle}
      body={applicationContentProps.pickerBody}
      allowedTypes={applicationContentProps.pickerAllowedTypes}
      selectedCreationIds={applicationContentProps.selectedCreationIds}
      onClose={applicationContentProps.onClosePicker}
      onSelect={applicationContentProps.onSelectCreation}
    />
  ) : null;

  return (
    <ItemStartingAssignmentEditorView
      {...viewProps}
      pickerSlot={pickerSlot}
    />
  );
}
