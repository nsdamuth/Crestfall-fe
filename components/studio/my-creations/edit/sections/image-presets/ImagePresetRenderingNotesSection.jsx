"use client";

import ImagePresetRenderingNotesSectionView from "./image-preset-rendering-notes-section/ImagePresetRenderingNotesSection.view";
import { useImagePresetRenderingNotesSectionViewModel } from "./image-preset-rendering-notes-section/useImagePresetRenderingNotesSectionViewModel";

export default function ImagePresetRenderingNotesSection(props) {
  const viewProps = useImagePresetRenderingNotesSectionViewModel(props);

  return <ImagePresetRenderingNotesSectionView {...viewProps} />;
}
