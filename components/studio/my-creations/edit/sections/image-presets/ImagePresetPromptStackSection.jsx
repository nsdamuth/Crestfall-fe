"use client";

import ImagePresetPromptStackSectionView from "./image-preset-prompt-stack-section/ImagePresetPromptStackSection.view";
import { useImagePresetPromptStackSectionViewModel } from "./image-preset-prompt-stack-section/useImagePresetPromptStackSectionViewModel";

export default function ImagePresetPromptStackSection(props) {
  const viewProps = useImagePresetPromptStackSectionViewModel(props);

  return <ImagePresetPromptStackSectionView {...viewProps} />;
}
