"use client";

import { useState } from "react";

import CameraPresetPickerModal from "./CameraPresetPickerModal";
import ImageStudioComposerView from "./image-studio-composer/ImageStudioComposer.view";
import { useImageStudioComposerViewModel } from "./image-studio-composer/useImageStudioComposerViewModel";

export default function ImageStudioComposer(props) {
  const [cameraPickerOpen, setCameraPickerOpen] = useState(false);
  const viewProps = useImageStudioComposerViewModel(props);

  return (
    <>
      <ImageStudioComposerView
        {...viewProps}
        onOpenCameraPresetPicker={() => setCameraPickerOpen(true)}
      />
      {cameraPickerOpen ? (
        <CameraPresetPickerModal
          selectedValue={viewProps.cameraPresetValue}
          onSelect={(value) => props.setCameraPreset?.(value)}
          onClose={() => setCameraPickerOpen(false)}
        />
      ) : null}
    </>
  );
}
