"use client";

import ImageStudioComposerView from "./image-studio-composer/ImageStudioComposer.view";
import { useImageStudioComposerViewModel } from "./image-studio-composer/useImageStudioComposerViewModel";

export default function ImageStudioComposer(props) {
  const viewProps = useImageStudioComposerViewModel(props);

  return <ImageStudioComposerView {...viewProps} />;
}
