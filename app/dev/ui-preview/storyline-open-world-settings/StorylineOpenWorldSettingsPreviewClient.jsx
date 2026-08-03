"use client";

import { useState } from "react";

import StorylineOpenWorldSettings from "@/components/studio/storylines/StorylineOpenWorldSettings";
import {
  storylineOpenWorldConfiguredFixture,
  storylineOpenWorldDefaultFixture,
  storylineOpenWorldLegacyFixture,
} from "@/components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.fixtures";

const PREVIEW_STATES = Object.freeze({
  configured: {
    label: "Configured",
    data: storylineOpenWorldConfiguredFixture,
  },
  defaults: {
    label: "Defaults",
    data: storylineOpenWorldDefaultFixture,
  },
  legacy: {
    label: "Legacy Input",
    data: storylineOpenWorldLegacyFixture,
  },
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function StorylineOpenWorldSettingsPreviewClient() {
  const [activeKey, setActiveKey] = useState("configured");
  const [data, setData] = useState(() =>
    clone(PREVIEW_STATES.configured.data)
  );
  const [lastPayload, setLastPayload] = useState(null);

  function selectState(nextKey) {
    const safeKey = PREVIEW_STATES[nextKey] ? nextKey : "configured";
    setActiveKey(safeKey);
    setData(clone(PREVIEW_STATES[safeKey].data));
    setLastPayload(null);
  }

  function handleChange(nextData) {
    setData(nextData);
    setLastPayload(nextData);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Storyline Open-World Settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route exercises the real Binding Shell while keeping Creation
            loading and persistence outside the preview.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
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
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
            <StorylineOpenWorldSettings data={data} onChange={handleChange} />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Last normalized payload
            </p>
            <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[var(--muted)]">
              {lastPayload
                ? JSON.stringify(lastPayload, null, 2)
                : "Change a setting to inspect the normalized Storyline payload."}
            </pre>
          </aside>
        </section>
      </div>
    </main>
  );
}
