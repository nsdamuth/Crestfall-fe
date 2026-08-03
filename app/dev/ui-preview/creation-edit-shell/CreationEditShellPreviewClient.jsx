"use client";

import { useMemo, useState } from "react";

import CreationEditShellView from "@/components/studio/my-creations/creation-edit-shell/CreationEditShell.view";
import {
  creationEditShellFixtureStates,
} from "@/components/studio/my-creations/creation-edit-shell/CreationEditShell.fixtures";

const STATE_OPTIONS = [
  { id: "playerCharacter", label: "Player Character" },
  { id: "lore", label: "Lore Asset" },
  { id: "mechanicsModule", label: "Mechanics Module shell" },
];

export default function CreationEditShellPreviewClient() {
  const [stateKey, setStateKey] = useState("playerCharacter");
  const [activeSection, setActiveSection] = useState(
    creationEditShellFixtureStates.playerCharacter.activeSection
  );
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  const fixture = creationEditShellFixtureStates[stateKey];

  const activeFixture = useMemo(
    () => ({
      ...fixture,
      activeSection,
    }),
    [activeSection, fixture]
  );

  function selectState(nextStateKey) {
    const nextFixture = creationEditShellFixtureStates[nextStateKey];
    setStateKey(nextStateKey);
    setActiveSection(nextFixture.activeSection);
    setPickerOpen(false);
    setSaveStatus("idle");
  }

  function simulateDefaultPc() {
    setSettingDefaultPc(true);
    window.setTimeout(() => setSettingDefaultPc(false), 500);
  }

  function simulateSave() {
    setSaveStatus("saving");
    window.setTimeout(() => setSaveStatus("saved"), 500);
  }

  return (
    <main className="min-h-screen bg-[#050403] p-4 text-[var(--foreground)] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Development-only LOOM preview
          </p>
          <h1 className="mt-2 font-display text-3xl">
            Creation Edit Shell
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercises the portable editor frame with fixture-owned content.
            No Creation is loaded or persisted.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectState(option.id)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                  stateKey === option.id
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15"
                    : "border-white/10 bg-black/25 text-[var(--muted)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <CreationEditShellView
          {...activeFixture}
          settingDefaultPc={settingDefaultPc}
          onSetDefaultPc={simulateDefaultPc}
          onSelectSection={setActiveSection}
          backAction={
            <button
              type="button"
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]"
            >
              ← My Creations
            </button>
          }
          mediaPanel={
            <PreviewPanel
              eyebrow="Featured Media"
              title="Four-slot media rail"
              body="The production shell injects CreationEditMediaPanel here."
            >
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-xl border border-[var(--muted-gold)]/30 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]"
              >
                Replace active slot
              </button>
            </PreviewPanel>
          }
          mechanicsQuickNav={
            <PreviewPanel
              eyebrow="Runtime Fields"
              title="Mechanics quick navigation"
              body="The existing browser-event navigation remains application-owned and is only injected for Mechanics Fields."
            />
          }
          sectionContent={
            <PreviewSectionContent
              stateKey={stateKey}
              activeSection={activeSection}
            />
          }
          stickyActionBar={
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--muted-gold)]/20 bg-black/90 p-3 backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                <p className="text-xs text-[var(--muted)]">
                  {saveStatus === "saving"
                    ? "Saving fixture..."
                    : saveStatus === "saved"
                      ? "Fixture saved."
                      : "Fixture changes are local only."}
                </p>
                <button
                  type="button"
                  onClick={simulateSave}
                  disabled={saveStatus === "saving"}
                  className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] disabled:opacity-50"
                >
                  {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          }
          featuredImagePicker={
            pickerOpen ? (
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4">
                <div className="w-full max-w-lg rounded-2xl border border-[var(--muted-gold)]/30 bg-[#080706] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                    Fixture image picker
                  </p>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Production injects CreationFeaturedImagePickerModal here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(false)}
                    className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null
          }
        />
      </div>
    </main>
  );
}

function PreviewPanel({ eyebrow, title, body, children }) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function PreviewSectionContent({ stateKey, activeSection }) {
  const labels = {
    playerCharacter: "Player Character editor composition",
    lore: "Lore editor composition",
    mechanicsModule: "Mechanics Module composition remains unchanged",
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {activeSection}
      </p>
      <h3 className="mt-2 font-display text-3xl">
        {labels[stateKey]}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        Production injects the existing type-specific section component here.
        The portable shell does not import Creation clients, editor sections,
        persistence helpers, Next.js navigation, or Mechanics internals.
      </p>
    </div>
  );
}
