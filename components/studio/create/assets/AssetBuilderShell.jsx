"use client";

import LocationParentPickerModal from "@/components/studio/my-creations/edit/sections/locations/LocationParentPickerModal";
import LocationRegistryAttachmentsSection from "@/components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection";
import LocationRuntimeModulesSection from "@/components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection";
import PoseIdentitySection from "@/components/studio/my-creations/edit/sections/poses/PoseIdentitySection";
import PoseBodyPositionSection from "@/components/studio/my-creations/edit/sections/poses/PoseBodyPositionSection";
import PoseMotionStagingSection from "@/components/studio/my-creations/edit/sections/poses/PoseMotionStagingSection";
import PosePromptGuidanceSection from "@/components/studio/my-creations/edit/sections/poses/PosePromptGuidanceSection";
import AssetBuilderView from "./asset-builder/AssetBuilder.view";
import { useAssetBuilderViewModel } from "./asset-builder/useAssetBuilderViewModel";

export default function AssetBuilderShell(props) {
  const {
    poseEditorProps,
    locationRuntimeProps,
    locationRegistryProps,
    parentPickerProps,
    ...viewProps
  } = useAssetBuilderViewModel(props);

  return (
    <AssetBuilderView
      {...viewProps}
      poseEditorContent={
        poseEditorProps ? (
          <div className="divide-y divide-[var(--line-whisper)]">
            <div className="pb-6">
              <PoseIdentitySection {...poseEditorProps} />
            </div>
            <div className="py-6">
              <PoseBodyPositionSection {...poseEditorProps} />
            </div>
            <div className="py-6">
              <PoseMotionStagingSection {...poseEditorProps} />
            </div>
            <div className="pt-6">
              <PosePromptGuidanceSection {...poseEditorProps} />
            </div>
          </div>
        ) : null
      }
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
