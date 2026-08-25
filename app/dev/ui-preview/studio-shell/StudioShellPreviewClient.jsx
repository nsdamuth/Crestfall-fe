"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import { studioShellFixtures } from "@/components/studio/studio-shell/StudioShell.fixtures";

export default function StudioShellPreviewClient() {
  const [activeId, setActiveId] = useState(studioShellFixtures[0].id);

  const active =
    studioShellFixtures.find((fixture) => fixture.id === activeId) ??
    studioShellFixtures[0];

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <div className="fixed left-0 right-0 top-0 z-[100] border-b border-[var(--line)] bg-[var(--surface-3)] p-4">
        <p className="text-[var(--text-label)] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Studio Shell Preview
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {studioShellFixtures.map((fixture) => (
            <button
              key={fixture.id}
              type="button"
              onClick={() => setActiveId(fixture.id)}
              className={`rounded-[var(--radius-md)] border px-3 py-2 text-[var(--text-label)] uppercase tracking-[0.12em] ${
                activeId === fixture.id
                  ? "border-[var(--gold-action)]/60 text-[var(--ink)]"
                  : "border-[var(--line)] text-[var(--ink-dim)]"
              }`}
            >
              {fixture.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-24">
        <StudioShellView {...active.props} />
      </div>
    </div>
  );
}
