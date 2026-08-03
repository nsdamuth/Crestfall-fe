"use client";

import { useState } from "react";

import MediaTileQuickActions from "@/components/studio/media/MediaTileQuickActions";
import MediaTileQuickActionsView from "@/components/studio/media/media-tile-quick-actions/MediaTileQuickActions.view";
import {
  mediaTileQuickActionsActiveFixture,
  mediaTileQuickActionsReadOnlyFixture,
} from "@/components/studio/media/media-tile-quick-actions/MediaTileQuickActions.fixtures";

function PreviewCard({ title, children }) {
  return (
    <article className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/15 p-6">
      <div className="flex h-full items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            Media Tile
          </p>
          <h2 className="mt-2 font-display text-3xl">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Hover the card or tab into its actions to reveal the controls.
          </p>
        </div>
      </div>
      {children}
    </article>
  );
}

function InteractivePreview() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [lastAction, setLastAction] = useState("None");

  return (
    <div>
      <PreviewCard title="Interactive Binding Shell">
        <MediaTileQuickActions
          liked={liked}
          bookmarked={bookmarked}
          onToggleLike={() => {
            setLiked((current) => !current);
            setLastAction(liked ? "Unlike" : "Like");
          }}
          onToggleBookmark={() => {
            setBookmarked((current) => !current);
            setLastAction(bookmarked ? "Remove bookmark" : "Bookmark");
          }}
          onExpand={() => setLastAction("Expand")}
        />
      </PreviewCard>

      <p className="mt-3 text-sm text-[var(--muted)]">
        Last action: <span className="text-[var(--foreground)]">{lastAction}</span>
      </p>
    </div>
  );
}

export default function MediaTileQuickActionsPreviewClient() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--foreground)] md:px-10">
      <div className="mx-auto max-w-6xl space-y-12">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            LOOM Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Media Tile Quick Actions</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            Shared portable Like, Bookmark, and Expand controls used by media surfaces throughout Crestfall.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <InteractivePreview />

          <PreviewCard title="Active Fixture">
            <MediaTileQuickActionsView
              {...mediaTileQuickActionsActiveFixture}
            />
          </PreviewCard>

          <PreviewCard title="Read-Only Fixture">
            <MediaTileQuickActionsView
              {...mediaTileQuickActionsReadOnlyFixture}
            />
          </PreviewCard>
        </div>
      </div>
    </main>
  );
}
