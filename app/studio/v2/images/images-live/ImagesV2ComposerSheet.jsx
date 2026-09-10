"use client";

// Mobile composer, browser review 9 Sep 2026 item 9: the composer
// opens as a bottom sheet, the same KitModalFrame variant="sheet" the
// dropdowns and the filter panel use under 700px, never a centered
// modal. The sheet gets a bounded height so the composer's own scroll
// region scrolls while its footer (count row and Generate) stays
// pinned to the sheet bottom; the frame's panel never has to scroll.
import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import KitModalFrame from "@/components/kit/KitModalFrame";

export default function ImagesV2ComposerSheet({ panelProps = {}, onClose = null }) {
  return (
    <KitModalFrame
      variant="sheet"
      sheetGrabber
      ariaLabel="Media Studio composer"
      onClose={onClose}
    >
      <div className="flex h-[78dvh] min-h-0 w-full flex-col">
        <KitImageCreatorPanel {...panelProps} />
      </div>
    </KitModalFrame>
  );
}
