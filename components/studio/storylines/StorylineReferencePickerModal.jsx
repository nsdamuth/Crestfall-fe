"use client";

import { createPortal } from "react-dom";

import StorylineReferencePickerModalView from "./storyline-reference-picker/StorylineReferencePickerModal.view";
import { useStorylineReferencePickerViewModel } from "./storyline-reference-picker/useStorylineReferencePickerViewModel";

export default function StorylineReferencePickerModal(props) {
  const { portalTarget, ...viewProps } =
    useStorylineReferencePickerViewModel(props);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <StorylineReferencePickerModalView {...viewProps} />,
    portalTarget
  );
}
