"use client";

import StorylineReferencePickerModal from "@/components/studio/storylines/StorylineReferencePickerModal";
import StorylineNodeListEditorView from "@/components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view";
import { useStorylineNodeListEditorViewModel } from "@/components/studio/storylines/storyline-node-list-editor/useStorylineNodeListEditorViewModel";

export default function StorylineNodeListEditor(props) {
  const viewModel = useStorylineNodeListEditorViewModel(props);

  const referencePickerSlot = viewModel.isReferencePickerOpen ? (
    <StorylineReferencePickerModal
      stories={viewModel.stories}
      scenarios={viewModel.scenarios}
      selectedReferenceIds={viewModel.selectedReferenceIds}
      onSelect={viewModel.onSelectReference}
      onClose={viewModel.onCloseReferencePicker}
    />
  ) : null;

  return (
    <StorylineNodeListEditorView
      headerEyebrow={viewModel.headerEyebrow}
      headerDescription={viewModel.headerDescription}
      nodeCountLabel={viewModel.nodeCountLabel}
      addReferenceLabel={viewModel.addReferenceLabel}
      showStructureControls={viewModel.showStructureControls}
      showTransitionControls={viewModel.showTransitionControls}
      loadError={viewModel.loadError}
      emptyStateMessage={viewModel.emptyStateMessage}
      nodes={viewModel.nodes}
      validationErrors={viewModel.validationErrors}
      visibleWarnings={viewModel.visibleWarnings}
      errorsTitle={viewModel.errorsTitle}
      warningsTitle={viewModel.warningsTitle}
      onOpenReferencePicker={viewModel.onOpenReferencePicker}
      onMoveNodeUp={viewModel.onMoveNodeUp}
      onMoveNodeDown={viewModel.onMoveNodeDown}
      onRemoveNode={viewModel.onRemoveNode}
      onChangeCompletionGuidance={viewModel.onChangeCompletionGuidance}
      onChangeTransitionPolicy={viewModel.onChangeTransitionPolicy}
      onChangeTriggerMode={viewModel.onChangeTriggerMode}
      onAddTrigger={viewModel.onAddTrigger}
      onChangeTriggerType={viewModel.onChangeTriggerType}
      onChangeTriggerLabel={viewModel.onChangeTriggerLabel}
      onChangeTriggerDescription={viewModel.onChangeTriggerDescription}
      onRemoveTrigger={viewModel.onRemoveTrigger}
      onChangeOpenWorldGuidance={viewModel.onChangeOpenWorldGuidance}
      onChangePressureGuidance={viewModel.onChangePressureGuidance}
      referencePickerSlot={referencePickerSlot}
    />
  );
}
