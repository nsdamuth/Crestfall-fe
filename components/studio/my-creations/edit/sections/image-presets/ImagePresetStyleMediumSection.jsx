"use client";

import ImagePresetStyleMediumSectionView from "./image-preset-style-medium-section/ImagePresetStyleMediumSection.view";
import { useImagePresetStyleMediumSectionViewModel } from "./image-preset-style-medium-section/useImagePresetStyleMediumSectionViewModel";

export default function ImagePresetStyleMediumSection(props) {
  const viewProps = useImagePresetStyleMediumSectionViewModel(props);

  return <ImagePresetStyleMediumSectionView {...viewProps} />;
}
