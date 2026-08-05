"use client";

import { X } from "lucide-react";

export default function StoryRoomMobileDrawerView({
  title = "",
  onClose = null,
  children = null,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-3 xl:hidden">
      <div className="flex max-h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706]">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <p className="font-display text-2xl">{title}</p>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
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
