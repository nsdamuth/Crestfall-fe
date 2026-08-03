"use client";

import LocationParentPickerModal from "@/components/studio/my-creations/edit/sections/locations/LocationParentPickerModal";
import LocationRegistryAttachmentsSection from "@/components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection";
import LocationRuntimeModulesSection from "@/components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection";
import LocationSensoryEnvironmentFields from "@/components/studio/my-creations/edit/sections/locations/LocationSensoryEnvironmentFields";
import LocationBuilderView from "./location-builder/LocationBuilder.view";
import { useLocationBuilderViewModel } from "./location-builder/useLocationBuilderViewModel";

export default function LocationBuilderShell(props) {
  const { viewProps, applicationContentProps } =
    useLocationBuilderViewModel(props);
  const {
    sensoryEnvironmentProps,
    runtimeModulesProps,
    registryAttachmentsProps,
    parentPickerProps,
  } = applicationContentProps;

  return (
    <LocationBuilderView
      {...viewProps}
      sensoryEnvironmentContent={
        <LocationSensoryEnvironmentFields {...sensoryEnvironmentProps} />
      }
      runtimeModulesContent={
        <LocationRuntimeModulesSection {...runtimeModulesProps} />
      }
      registryAttachmentsContent={
        <LocationRegistryAttachmentsSection {...registryAttachmentsProps} />
      }
      parentPickerContent={
        parentPickerProps ? (
          <LocationParentPickerModal {...parentPickerProps} />
        ) : null
      }
    />
  );
}
