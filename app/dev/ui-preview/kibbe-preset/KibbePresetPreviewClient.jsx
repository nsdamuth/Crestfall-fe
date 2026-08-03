"use client";

import { useMemo, useState } from "react";

import KibbePresetModalView from "@/components/studio/create/character/kibbe-preset/KibbePresetModal.view";
import {
  kibbePresetModalEmptyFixture,
  kibbePresetModalOpenFixture,
} from "@/components/studio/create/character/kibbe-preset/KibbePresetModal.fixtures";

const DEFAULT_PRESET_VALUE = kibbePresetModalOpenFixture.pendingValue;

function findIdentityOption(value) {
  return (
    kibbePresetModalOpenFixture.identityOptions.find(
      (option) => option?.value === value
    ) || kibbePresetModalEmptyFixture.pendingPreset
  );
}

export default function KibbePresetPreviewClient() {
  const [open, setOpen] = useState(false);
  const [committedValue, setCommittedValue] = useState(DEFAULT_PRESET_VALUE);
  const [pendingValue, setPendingValue] = useState(DEFAULT_PRESET_VALUE);
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Crestfall character data is connected."
  );

  const committedPreset = useMemo(
    () => findIdentityOption(committedValue),
    [committedValue]
  );

  const pendingPreset = useMemo(
    () => findIdentityOption(pendingValue),
    [pendingValue]
  );

  const suggestionRows = pendingValue
    ? kibbePresetModalOpenFixture.suggestionRows
    : [];

  function openModal() {
    setPendingValue(committedValue);
    setOpen(true);
  }

  function closeModal() {
    setPendingValue(committedValue);
    setOpen(false);
    setLastAction("Modal closed without committing the pending fixture selection.");
  }

  function commitPreviewAction(actionLabel) {
    const nextPreset = findIdentityOption(pendingValue);

    setCommittedValue(pendingValue);
    setOpen(false);
    setLastAction(
      `${actionLabel}: ${nextPreset?.label || "Not chosen"}. This was fixture-only and was not saved.`
    );
  }

  function loadSelectedFixture() {
    setCommittedValue(DEFAULT_PRESET_VALUE);
    setPendingValue(DEFAULT_PRESET_VALUE);
    setOpen(true);
    setLastAction("Loaded the selected-preset fixture.");
  }

  function loadEmptyFixture() {
    setCommittedValue("");
    setPendingValue("");
    setOpen(true);
    setLastAction("Loaded the empty-selection fixture.");
  }

  function resetPreview() {
    setCommittedValue(DEFAULT_PRESET_VALUE);
    setPendingValue(DEFAULT_PRESET_VALUE);
    setOpen(false);
    setLastAction("Preview reset to the closed Soft Dramatic fixture.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Kibbe Preset Modal View
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from fixture props. It
            does not load the character creator, call an API, authenticate a
            user, or save application data.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadSelectedFixture}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20"
            >
              Open Selected Fixture
            </button>

            <button
              type="button"
              onClick={loadEmptyFixture}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            >
              Open Empty Fixture
            </button>

            <button
              type="button"
              onClick={resetPreview}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            >
              Reset Closed State
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Isolated View
          </p>

          <KibbePresetModalView
            {...kibbePresetModalOpenFixture}
            open={open}
            selectedPresetLabel={committedPreset?.label || "Not chosen"}
            pendingValue={pendingValue}
            pendingPreset={pendingPreset}
            suggestionRows={suggestionRows}
            onOpen={openModal}
            onClose={closeModal}
            onSelectIdentity={setPendingValue}
            onSaveIdentityOnly={() => commitPreviewAction("Save Identity Only")}
            onFillEmptyFields={() => commitPreviewAction("Fill Empty Fields")}
            onReplaceBodyTraits={() => commitPreviewAction("Replace Body Traits")}
          />

          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            The suggested trait rows are intentionally fixture data. Selecting a
            different identity exercises the View contract but does not run the
            Crestfall preset resolver.
          </p>
        </section>
      </div>
    </main>
  );
}
