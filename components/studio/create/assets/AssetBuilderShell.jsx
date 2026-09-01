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
          <div className="grid gap-6">
            <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/25 p-5">
              <PoseIdentitySection {...poseEditorProps} />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/25 p-5">
              <PoseBodyPositionSection {...poseEditorProps} />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/25 p-5">
              <PoseMotionStagingSection {...poseEditorProps} />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/25 p-5">
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
