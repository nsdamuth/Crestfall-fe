"use client";

import { X } from "lucide-react";

import {
  isStoryRoomSwipeInteractiveTarget,
  resolveStoryRoomMobileSwipe,
} from "../story-room-chat-shell/storyRoomMobileSwipe";

export default function StoryRoomMobileDrawerView({
  title = "",
  side = "left",
  onClose = null,
  children = null,
}) {
  const normalizedSide = side === "right" ? "right" : "left";

  function handleSwipeStart(event) {
    if (isStoryRoomSwipeInteractiveTarget(event.target)) {
      event.currentTarget.dataset.storyRoomSwipeStartX = "";
      event.currentTarget.dataset.storyRoomSwipeStartY = "";
      return;
    }

    const touch = event.touches?.[0];
    if (!touch) return;
    event.currentTarget.dataset.storyRoomSwipeStartX = String(touch.clientX);
    event.currentTarget.dataset.storyRoomSwipeStartY = String(touch.clientY);
  }

  function handleSwipeEnd(event) {
    const startXRaw = event.currentTarget.dataset.storyRoomSwipeStartX;
    const startYRaw = event.currentTarget.dataset.storyRoomSwipeStartY;
    const touch = event.changedTouches?.[0];

    event.currentTarget.dataset.storyRoomSwipeStartX = "";
    event.currentTarget.dataset.storyRoomSwipeStartY = "";

    if (!startXRaw || !startYRaw || !touch) return;

    const startX = Number(startXRaw);
    const startY = Number(startYRaw);
    if (!Number.isFinite(startX) || !Number.isFinite(startY)) return;

    const action = resolveStoryRoomMobileSwipe({
      panel: normalizedSide === "left" ? "cast" : "state",
      deltaX: touch.clientX - startX,
      deltaY: touch.clientY - startY,
    });

    if (action === "CLOSE") onClose?.();
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex bg-black/75 xl:hidden ${
        normalizedSide === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <button
        type="button"
        aria-label="Close panel overlay"
        onClick={() => onClose?.()}
        className="absolute inset-0"
      />

      <div
        data-drawer-side={normalizedSide}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
        className={`relative z-10 flex h-full w-[min(22rem,88vw)] flex-col overflow-hidden border-[var(--gold-ornament)]/25 bg-[#080706] shadow-[var(--shadow-modal)] ${
          normalizedSide === "right"
            ? "border-l rounded-l-[var(--radius-lg)]"
            : "border-r rounded-r-[var(--radius-lg)]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <p className="font-display text-2xl">{title}</p>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
