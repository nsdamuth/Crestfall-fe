"use client";

import CreationFeaturedImagePickerModalView from "./creation-featured-image-picker/CreationFeaturedImagePickerModal.view";
import { useCreationFeaturedImagePickerViewModel } from "./creation-featured-image-picker/useCreationFeaturedImagePickerViewModel";

export default function CreationFeaturedImagePickerModal(props) {
  const viewProps = useCreationFeaturedImagePickerViewModel(props);

  return <CreationFeaturedImagePickerModalView {...viewProps} />;
}
