"use client";

import StorylineReferencePickerModalView from "./storyline-reference-picker/StorylineReferencePickerModal.view";
import { useStorylineReferencePickerViewModel } from "./storyline-reference-picker/useStorylineReferencePickerViewModel";

export default function StorylineReferencePickerModal(props) {
  const viewProps = useStorylineReferencePickerViewModel(props);

  return <StorylineReferencePickerModalView {...viewProps} />;
}
