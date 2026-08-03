"use client";

import LocationParentPickerModal from "@/components/studio/my-creations/edit/sections/locations/LocationParentPickerModal";
import LocationRegistryAttachmentsSection from "@/components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection";
import LocationRuntimeModulesSection from "@/components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection";
import AssetBuilderView from "./asset-builder/AssetBuilder.view";
import { useAssetBuilderViewModel } from "./asset-builder/useAssetBuilderViewModel";

export default function AssetBuilderShell(props) {
  const {
    locationRuntimeProps,
    locationRegistryProps,
    parentPickerProps,
    ...viewProps
  } = useAssetBuilderViewModel(props);

  return (
    <AssetBuilderView
      {...viewProps}
      locationRuntimeContent={
        locationRuntimeProps ? (
          <LocationRuntimeModulesSection {...locationRuntimeProps} />
        ) : null
      }
      locationRegistryContent={
        locationRegistryProps ? (
          <LocationRegistryAttachmentsSection {...locationRegistryProps} />
        ) : null
      }
      parentPickerContent={
        parentPickerProps ? (
          <LocationParentPickerModal {...parentPickerProps} />
        ) : null
      }
    />
  );
}
