"use client";

import { useState } from "react";

import ModalShellView from "@/components/ui/modal-shell/ModalShell.view";
import { modalShellFixtures } from "@/components/ui/modal-shell/ModalShell.fixtures";

export default function ModalShellPreviewClient() {
  const [activeId, setActiveId] = useState(modalShellFixtures[0].id);
  const [feedback, setFeedback] = useState("Fixture preview ready.");

  const active =
    modalShellFixtures.find((fixture) => fixture.id === activeId) ??
    modalShellFixtures[0];

  return (
    <main className="min-h-screen bg-[var(--canvas)] p-8 text-[var(--ink)]">
      <div className="relative z-[100] mx-auto max-w-3xl">
        <div className="mb-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-3)] p-4">
          <p className="text-[var(--text-label)] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Modal Shell Preview
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {modalShellFixtures.map((fixture) => (
              <button
                key={fixture.id}
                type="button"
                onClick={() => {
                  setActiveId(fixture.id);
                  setFeedback(`${fixture.label} fixture loaded.`);
                }}
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
          <p className="mt-3 text-[var(--text-ui)] text-[var(--ink-dim)]">
            {feedback}
          </p>
        </div>
      </div>

      <h1 id="modal-shell-fixture-title" className="sr-only">
        Modal Shell Fixture
      </h1>

      <ModalShellView
        className="p-4"
        {...active.props}
        onBackdropMouseDown={() => setFeedback("Backdrop dismiss fired.")}
      />
    </main>
  );
}
