"use client";

import ImageStudioComposer from "@/components/studio/image-studio/ImageStudioComposer";
import IngredientPickerModal from "@/components/studio/image-studio/IngredientPickerModal";
import MediaHistoryGrid from "@/components/studio/image-studio/MediaHistoryGrid";
import SaveIngredientPresetModal from "@/components/studio/image-studio/SaveIngredientPresetModal";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";

import ImageStudioWorkbenchView from "./image-studio-workbench/ImageStudioWorkbench.view";
import { useImageStudioWorkbenchViewModel } from "./image-studio-workbench/useImageStudioWorkbenchViewModel";

export default function ImageStudioWorkbench() {
  const account = useStudioAccount();
  const viewProps = useImageStudioWorkbenchViewModel({ account });

  return (
    <ImageStudioWorkbenchView
      {...viewProps}
      MediaHistoryGridComponent={MediaHistoryGrid}
      ImageStudioComposerComponent={ImageStudioComposer}
      IngredientPickerModalComponent={IngredientPickerModal}
      SaveIngredientPresetModalComponent={SaveIngredientPresetModal}
    />
  );
}
