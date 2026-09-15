"use client";

import KitSelectionBar from "@/components/kit/KitSelectionBar";
import ImageStudioComposer from "@/components/studio/image-studio/ImageStudioComposer";
import IngredientPickerModal from "@/components/studio/image-studio/IngredientPickerModal";
import MediaHistoryGrid from "@/components/studio/image-studio/MediaHistoryGrid";
import SaveIngredientPresetModal from "@/components/studio/image-studio/SaveIngredientPresetModal";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";

import ImageStudioWorkbenchView from "./image-studio-workbench/ImageStudioWorkbench.view";
import { useImageStudioWorkbenchViewModel } from "./image-studio-workbench/useImageStudioWorkbenchViewModel";

const LEGACY_ITEM_NOUN = "image";

function pluralNoun(count) {
  return count === 1 ? LEGACY_ITEM_NOUN : `${LEGACY_ITEM_NOUN}s`;
}

// KitSelectionBar (ASSET-FOLDERS plan, package AF7, 14 Sep 2026, item
// 2): Select mode on this legacy page lost its actions when AF5
// removed the grid View's own bulk section; this bar runs the grid's
// existing selection handlers (selectionMode, onToggleSelectionMode,
// onConfirmBulkDelete) through the shell's additive selectionBarSlot,
// the same handlers V2 Media wired, unchanged. No folders exist on
// this page: Add to folder carries no folder tree (folders={[]}) and
// no write (onAddToFolder is null), so the picker opens empty; Remove
// from folder never activates (removeFromFolderName stays empty).
// Download ships Soon, matching the Vault ruling (M3) for a page with
// no bulk download wired.
function legacySelectionBarSlot(grid) {
  if (!grid.selectionMode) return null;

  return (
    <KitSelectionBar
      selectedCount={grid.selectedCount}
      itemNoun={LEGACY_ITEM_NOUN}
      folders={[]}
      onAddToFolder={null}
      onDownload={null}
      isDownloadSoon
      onDelete={grid.onConfirmBulkDelete}
      onDone={grid.onToggleSelectionMode}
      isBusy={grid.isBulkDeleting}
      deleteBody={`This removes ${grid.selectedCount} selected ${pluralNoun(grid.selectedCount)} from Image Studio, connected creation libraries, and featured image slots. This cannot be undone.`}
    />
  );
}

export default function ImageStudioWorkbench() {
  const account = useStudioAccount();
  const viewProps = useImageStudioWorkbenchViewModel({ account });

  return (
    <ImageStudioWorkbenchView
      {...viewProps}
      mediaHistoryProps={{
        ...viewProps.mediaHistoryProps,
        selectionBarSlot: legacySelectionBarSlot,
      }}
      MediaHistoryGridComponent={MediaHistoryGrid}
      ImageStudioComposerComponent={ImageStudioComposer}
      IngredientPickerModalComponent={IngredientPickerModal}
      SaveIngredientPresetModalComponent={SaveIngredientPresetModal}
    />
  );
}
