"use client";

// Mobile composer, browser review 9 Sep 2026 item 9: the composer
// opens as a bottom sheet, the same KitModalFrame variant="sheet" the
// dropdowns and the filter panel use under 700px, never a centered
// modal. The sheet gets a bounded height so the composer's own scroll
// region scrolls while its footer (count row and Generate) stays
// pinned to the sheet bottom; the frame's panel never has to scroll.
import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitModalFrame from "@/components/kit/KitModalFrame";

// `remix` mirrors the desktop rail's explicit pass: the sheet is the
// second surface of the same composer, so the Remix stage reaches the
// panel here by name as well (guarded by the live adapter diagnostics).
export default function ImagesV2ComposerSheet({ panelProps = {}, remix = null, onClose = null }) {
  return (
    <KitModalFrame
      variant="sheet"
      sheetGrabber
      ariaLabel="Media Studio composer"
      onClose={onClose}
    >
      <div className="flex h-[78dvh] min-h-0 w-full flex-col">
        <KitImageCreatorPanel {...panelProps} remix={remix ?? panelProps.remix ?? null} />
      </div>
    </KitModalFrame>
  );
}
