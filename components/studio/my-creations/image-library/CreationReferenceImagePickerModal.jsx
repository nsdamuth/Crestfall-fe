"use client";

import CreationReferenceImagePickerModalView from "./creation-reference-image-picker/CreationReferenceImagePickerModal.view";
import { useCreationReferenceImagePickerViewModel } from "./creation-reference-image-picker/useCreationReferenceImagePickerViewModel";

export default function CreationReferenceImagePickerModal(props) {
  const viewProps = useCreationReferenceImagePickerViewModel(props);

  return <CreationReferenceImagePickerModalView {...viewProps} />;
}
