"use client";

import { useState } from "react";

import MediaLightbox from "@/components/studio/media/MediaLightbox";
import { mediaLightboxFixtureItems } from "@/components/studio/media/media-lightbox/MediaLightbox.fixtures";

export default function MediaLightboxPreviewClient() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(mediaLightboxFixtureItems[0]);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState(() => new Set());
  const [lastAction, setLastAction] = useState("None");

  function toggle(setter, id, label) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setLastAction(label);
  }

  return (
    <main className="min-h-screen bg-black p-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          LOOM Preview
        </p>
        <h1 className="mt-2 font-display text-5xl">Media Lightbox</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Exercises the application Binding Shell with normalized media aliases,
          local reactions, selection, download, deletion confirmation, details,
          and reporting controls.
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
        >
          Open Lightbox
        </button>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Last action: <span className="text-[var(--foreground)]">{lastAction}</span>
        </p>
      </div>

      {open ? (
        <MediaLightbox
          items={mediaLightboxFixtureItems}
          activeItemId={activeItem?.id}
          onSelectItem={(item) => {
            setActiveItem(item);
            setLastAction(`Selected ${item?.title || item?.label || "media"}`);
          }}
          onClose={() => setOpen(false)}
          modeLabel="LOOM Preview"
          imageStudioHref="/studio/image-studio"
          allowDownload
          showStudioActions
          isItemLiked={(item) => likedIds.has(item?.id)}
          isItemBookmarked={(item) => bookmarkedIds.has(item?.id)}
          onToggleLike={(item) => toggle(setLikedIds, item?.id, "Toggled Like")}
          onToggleBookmark={(item) =>
            toggle(setBookmarkedIds, item?.id, "Toggled Bookmark")
          }
          onDeleteItem={(item) => setLastAction(`Delete ${item?.title || "media"}`)}
        />
      ) : null}
    </main>
  );
}
