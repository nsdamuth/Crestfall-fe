"use client";

import MediaHistoryGridSkin from "./MediaHistoryGridSkin";
import { useMediaHistoryGridViewModel } from "./media-history-grid/useMediaHistoryGridViewModel";

// selectionBarSlot (ASSET-FOLDERS AF7, item 2, additive, default
// null): a render function called with this shell's own ViewModel
// output, rendered as a sibling of the grid skin. Absent (every
// consumer but the legacy workbench), the shell renders
// byte-identical. Lets a caller compose a bar against the same
// selectionMode, selectedCount, onToggleSelectionMode, and
// onConfirmBulkDelete this shell already computes, without lifting
// the hook call or touching the Kit-contracted grid View.
export default function MediaHistoryGrid({ selectionBarSlot = null, ...props }) {
  const viewProps = useMediaHistoryGridViewModel(props);

  return (
    <>
      <MediaHistoryGridSkin
        {...viewProps}
        mobilePrimaryActionLabel={props.mobilePrimaryActionLabel}
        onMobilePrimaryAction={props.onMobilePrimaryAction}
      />
      {selectionBarSlot ? selectionBarSlot(viewProps) : null}
    </>
  );
}
