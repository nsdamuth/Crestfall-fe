"use client";

import StructuredRegistrySampleLibraryModalView from "./StructuredRegistrySampleLibraryModal.view";
import { useStructuredRegistrySampleLibraryViewModel } from "./useStructuredRegistrySampleLibraryViewModel";

export default function StructuredRegistrySampleLibraryModal(props) {
  const viewProps = useStructuredRegistrySampleLibraryViewModel(props);
  return <StructuredRegistrySampleLibraryModalView {...viewProps} />;
}
