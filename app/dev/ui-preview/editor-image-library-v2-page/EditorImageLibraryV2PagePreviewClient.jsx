"use client";

import { useState } from "react";

import ImageLibraryView from "@/app/studio/v2/editor/image-library/ImageLibrary.view";
import { IMAGE_LIBRARY_FIXTURE_STATES } from "@/app/studio/v2/editor/image-library/ImageLibrary.fixtures";

// Renders this wrapper's own View directly against its own fixtures
// (the pattern components/studio/my-creations/image-library/creation-image-library-page's
// own preview client uses): the composed CreationImageLibraryPage is
// exercised at its own preview, /dev/ui-preview/creation-image-library-page,
// not duplicated here.
const STATE_IDS = Object.keys(IMAGE_LIBRARY_FIXTURE_STATES);

export default function EditorImageLibraryV2PagePreviewClient() {
  const [stateId, setStateId] = useState(STATE_IDS[0]);
  const fixture = IMAGE_LIBRARY_FIXTURE_STATES[stateId];

  return (
    <main className="min-h-screen bg-[var(--canvas)] p-[var(--space-6)]">
      <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          Fixture state
        </span>
        {STATE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={stateId === id}
            onClick={() => setStateId(id)}
            className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
              stateId === id
                ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
            }`}
          >
            {IMAGE_LIBRARY_FIXTURE_STATES[id].label}
          </button>
        ))}
      </div>

      <ImageLibraryView
        creationId={fixture.creationId}
        backLabel={fixture.backLabel}
        onBack={() => {}}
        libraryPanel={
          <div className="mt-[var(--space-6)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-[var(--space-6)] text-center text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            {fixture.mockPanelLabel}
          </div>
        }
      />
    </main>
  );
}
