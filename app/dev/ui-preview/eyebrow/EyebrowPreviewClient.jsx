"use client";

import { useState } from "react";

import EyebrowView from "@/components/ui/eyebrow/Eyebrow.view";
import { eyebrowFixtures } from "@/components/ui/eyebrow/Eyebrow.fixtures";

export default function EyebrowPreviewClient() {
  const [activeId, setActiveId] = useState(eyebrowFixtures[0].id);

  const active =
    eyebrowFixtures.find((fixture) => fixture.id === activeId) ??
    eyebrowFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] p-8 text-[var(--ink)]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-3)] p-4">
          <p className="text-[var(--text-label)] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Eyebrow Preview
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {eyebrowFixtures.map((fixture) => (
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

        <div className="max-w-sm rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-6">
          <EyebrowView {...active.props} />
        </div>
      </div>
    </main>
  );
}
