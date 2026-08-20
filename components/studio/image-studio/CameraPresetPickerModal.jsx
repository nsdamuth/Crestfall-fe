"use client";

import { useState } from "react";

import KitPickerModal from "@/components/kit/KitPickerModal";
import {
  normalizeCameraPresetPresentationValue,
  projectCameraPresetPickerPresentation,
} from "./camera-presets/CameraPresetPresentation.contract";

export default function CameraPresetPickerModal({
  selectedValue = "AUTO",
  onSelect = null,
  onClose = null,
} = {}) {
  const [searchValue, setSearchValue] = useState("");
  const selected = normalizeCameraPresetPresentationValue(selectedValue);
  const presentation = projectCameraPresetPickerPresentation({
    selectedValue: selected,
    searchValue,
  });

  function handleSelect(id) {
    onSelect?.(normalizeCameraPresetPresentationValue(id));
    onClose?.();
  }

  return (
    <KitPickerModal
      {...presentation.picker}
      onSearchChange={setSearchValue}
      onToggleItem={handleSelect}
      onConfirm={null}
      onClose={onClose}
    />
  );
}
