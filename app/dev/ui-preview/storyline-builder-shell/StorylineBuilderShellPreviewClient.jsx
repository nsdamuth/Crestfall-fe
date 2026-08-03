"use client";

import { useMemo, useState } from "react";

import StorylineNodeListEditor from "@/components/studio/storylines/StorylineNodeListEditor";
import StorylineOpenWorldSettings from "@/components/studio/storylines/StorylineOpenWorldSettings";
import StorylineBuilderShellView from "@/components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view";
import {
  storylineBuilderEmptyFixture,
  storylineBuilderErrorFixture,
  storylineBuilderReadyFixture,
  storylineBuilderSavingFixture,
} from "@/components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.fixtures";
import { getStorylineBuilderShellViewProps } from "@/components/studio/storylines/storyline-builder-shell/useStorylineBuilderShellViewModel";
import { storylineNodeListReferenceFixture } from "@/components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.fixtures";

const PREVIEW_STATES = Object.freeze({
  ready: { label: "Ready", fixture: storylineBuilderReadyFixture },
  empty: { label: "Empty", fixture: storylineBuilderEmptyFixture },
  saving: { label: "Saving", fixture: storylineBuilderSavingFixture },
  error: { label: "Error", fixture: storylineBuilderErrorFixture },
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function StorylineBuilderShellPreviewClient() {
  const [activeKey, setActiveKey] = useState("ready");
  const [form, setForm] = useState(() =>
    clone(PREVIEW_STATES.ready.fixture.form)
  );
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  function selectState(nextKey) {
    const state = PREVIEW_STATES[nextKey] || PREVIEW_STATES.ready;
    setActiveKey(nextKey);
    setForm(clone(state.fixture.form));
    setSaveStatus(state.fixture.saveStatus);
    setSaveMessage(state.fixture.saveMessage);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveDraft() {
    setSaveStatus("saved");
    setSaveMessage("Preview draft captured without persistence.");
  }

  const viewProps = useMemo(
    () =>
      getStorylineBuilderShellViewProps({
        form,
        saveStatus,
        saveMessage,
        updateField,
        saveDraft,
      }),
    [form, saveStatus, saveMessage]
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Storyline Builder Shell
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercise the portable builder layout with the real Storyline node
            editor and open-world settings while persistence remains disabled.
          </p>
        </header>

        <section className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-black/25 p-5">
          {Object.entries(PREVIEW_STATES).map(([key, state]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectState(key)}
              className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                activeKey === key
                  ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                  : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              }`}
            >
              {state.label}
            </button>
          ))}
        </section>

        <StorylineBuilderShellView
          {...viewProps}
          nodeEditorSlot={
            <StorylineNodeListEditor
              data={form.data}
              onChange={(data) => updateField("data", data)}
              stories={storylineNodeListReferenceFixture.stories}
              scenarios={storylineNodeListReferenceFixture.scenarios}
              loadError=""
              mode="full"
            />
          }
          openWorldSettingsSlot={
            <StorylineOpenWorldSettings
              data={form.data}
              onChange={(data) => updateField("data", data)}
            />
          }
        />
      </div>
    </main>
  );
}
