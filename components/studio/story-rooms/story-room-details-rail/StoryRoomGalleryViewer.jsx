"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { ImageFrame } from "@/components/kit/image-overlay/ImageFrame";

// The story gallery's full-screen viewer (decision D1, fe/chat-studio
// item 6): the viewer frame and the shared ImageFrame (gold hairline,
// zoom and pan, pinch on touch) with previous and next, nothing else.
// The frame owns the close control, the veil, and Escape.
export default function StoryRoomGalleryViewer({
  items = [],
  index = 0,
  onClose = null,
  onPrevious = null,
  onNext = null,
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const item = safeItems[index] || null;
  const hasMany = safeItems.length > 1;

  return (
    <KitModalFrame
      variant="viewer"
      onClose={onClose}
      ariaLabel={item?.altText || "Story image"}
    >
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-[var(--space-3)] p-[var(--space-4)]">
        <ImageFrame imageSrc={item?.url || null} title={item?.altText || "Story image"} />

        {hasMany ? (
          <div className="pointer-events-auto flex items-center gap-[var(--space-2)] rounded-[var(--radius-full)] bg-[var(--panel-glass)] px-[var(--space-2)] py-[var(--space-1)] backdrop-blur-[var(--blur-panel)]">
            <button
              type="button"
              onClick={() => onPrevious?.()}
              aria-label="Previous image"
              className="flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--art-ink)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--art-gold)]"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <span className="min-w-[4rem] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] tabular-nums text-[var(--art-ink)]">
              {index + 1} of {safeItems.length}
            </span>
            <button
              type="button"
              onClick={() => onNext?.()}
              aria-label="Next image"
              className="flex h-[var(--control-md)] w-[var(--control-md)] touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--art-ink)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--art-gold)]"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </KitModalFrame>
  );
}
