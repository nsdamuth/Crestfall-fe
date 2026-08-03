"use client";

import { useState } from "react";

import StorylineReferencePickerModal from "@/components/studio/storylines/StorylineReferencePickerModal";
import {
  storylineReferencePickerEmptyFixture,
  storylineReferencePickerFixture,
} from "@/components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.fixtures";

export default function StorylineReferencePickerPreviewClient() {
  const [isOpen, setIsOpen] = useState(true);
  const [useEmptyFixture, setUseEmptyFixture] = useState(false);
  const [lastSelection, setLastSelection] = useState("None");
  const fixture = useEmptyFixture
    ? storylineReferencePickerEmptyFixture
    : storylineReferencePickerFixture;

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          LOOM Development Preview
        </p>
        <h1 className="mt-2 font-display text-4xl">
          Storyline Reference Picker
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Open the modal, switch reference types, search, and select an available
          Story or Scenario. Escape and the close button should both dismiss it.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-3 text-sm"
          >
            Open Picker
          </button>
          <button
            type="button"
            onClick={() => {
              setUseEmptyFixture((current) => !current);
              setIsOpen(true);
            }}
            className="rounded-xl border border-white/15 px-4 py-3 text-sm"
          >
            {useEmptyFixture ? "Use Populated Fixture" : "Use Empty Fixture"}
          </button>
        </div>

        <p className="mt-5 text-sm text-[var(--muted)]">
          Last selection: <span className="text-white">{lastSelection}</span>
        </p>
      </div>

      {isOpen ? (
        <StorylineReferencePickerModal
          {...fixture}
          onSelect={(reference) => {
            setLastSelection(reference.title);
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </main>
  );
}
