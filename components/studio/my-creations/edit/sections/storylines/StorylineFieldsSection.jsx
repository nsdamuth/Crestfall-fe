"use client";

import StorylineNodeListEditor from "@/components/studio/storylines/StorylineNodeListEditor";
import StorylineOpenWorldSettings from "@/components/studio/storylines/StorylineOpenWorldSettings";
import StorylineFieldsSectionView from "@/components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.view";
import { useStorylineFieldsSectionViewModel } from "@/components/studio/my-creations/edit/sections/storylines/storyline-fields-section/useStorylineFieldsSectionViewModel";

export default function StorylineFieldsSection({
  section,
  form,
  updateDataField,
}) {
  const viewModel = useStorylineFieldsSectionViewModel({
    section,
    form,
    updateDataField,
  });

  const editorSlot = viewModel.isOpenWorldSection ? (
    <StorylineOpenWorldSettings
      data={viewModel.storylineData}
      onChange={viewModel.onReplaceStorylineData}
    />
  ) : (
    <StorylineNodeListEditor
      data={viewModel.storylineData}
      onChange={viewModel.onReplaceStorylineData}
      stories={viewModel.stories}
      scenarios={viewModel.scenarios}
      loadError={viewModel.loadError}
      mode={viewModel.editorMode}
    />
  );

  return (
    <StorylineFieldsSectionView
      activeSection={viewModel.activeSection}
      sectionEyebrow={viewModel.sectionEyebrow}
      sectionTitle={viewModel.sectionTitle}
      sectionDescription={viewModel.sectionDescription}
      editorSlot={editorSlot}
    />
  );
}
