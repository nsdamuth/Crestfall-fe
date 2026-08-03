"use client";

import ImagePresetIdentitySectionView from "./image-preset-identity-section/ImagePresetIdentitySection.view";
import { useImagePresetIdentitySectionViewModel } from "./image-preset-identity-section/useImagePresetIdentitySectionViewModel";

export default function ImagePresetIdentitySection(props) {
  const viewProps = useImagePresetIdentitySectionViewModel(props);

  return <ImagePresetIdentitySectionView {...viewProps} />;
}
