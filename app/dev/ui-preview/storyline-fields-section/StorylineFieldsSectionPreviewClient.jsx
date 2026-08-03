"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Globe2, GitBranch, Plus } from "lucide-react";

import StorylineFieldsSectionView from "@/components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.view";
import {
  storylineFieldsOpenWorldFixture,
  storylineFieldsSequenceFixture,
  storylineFieldsTransitionsFixture,
} from "@/components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.fixtures";

const PREVIEW_STATES = {
  sequence: { label: "Sequence", props: storylineFieldsSequenceFixture },
  transitions: {
    label: "Transitions",
    props: storylineFieldsTransitionsFixture,
  },
  openWorld: {
    label: "Open World",
    props: storylineFieldsOpenWorldFixture,
  },
};

export default function StorylineFieldsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("sequence");
  const [feedback, setFeedback] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];

  const editorSlot = useMemo(() => {
    if (activeStateKey === "openWorld") {
      return <MockOpenWorldEditor onAction={setFeedback} />;
    }

    return (
      <MockSequenceEditor
        mode={activeStateKey}
        onAction={setFeedback}
      />
    );
  }, [activeStateKey]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Storyline Fields Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Storyline section boundary without
            loading saved Stories, Scenarios, or the application reference
            picker.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => {
                  setActiveStateKey(stateKey);
                  setFeedback(`Showing ${state.label}.`);
                }}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {feedback}
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
          <StorylineFieldsSectionView
            {...activeState.props}
            editorSlot={editorSlot}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Section copy is portable. Storyline normalization, reference
            loading, node editing, trigger editing, and open-world persistence
            remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}

function MockSequenceEditor({ mode, onAction }) {
  const transitionsOnly = mode === "transitions";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/25 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {transitionsOnly ? "Node Transitions" : "Narrative Sequence"}
          </p>
          <h3 className="mt-2 font-display text-3xl">2 Storyline Nodes</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {transitionsOnly
              ? "Define how each node completes and how the following node becomes eligible."
              : "The first node loads when the Storyline starts. Later nodes follow the authored order shown here."}
          </p>
        </div>
        {!transitionsOnly ? (
          <button
            type="button"
            onClick={() => onAction("Open Story or Scenario picker.")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
          >
            <Plus size={15} />
            Add Story or Scenario
          </button>
        ) : null}
      </div>

      {["The Brasswhisker Opening", "Mirror Drift Investigation"].map(
        (title, index) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-black/30 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 font-display text-xl text-[var(--muted-gold)]">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                    {index === 0 ? "Story" : "Scenario"}
                    {index === 1 ? " · Final Node" : ""}
                  </p>
                  <h4 className="mt-1 font-display text-3xl">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    A fixture node demonstrating the authored sequence and
                    transition boundary.
                  </p>
                </div>
              </div>
              {!transitionsOnly ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAction(`Move ${title} up.`)}
                    className="rounded-lg border border-white/10 p-2 text-[var(--muted)]"
                    aria-label="Move node up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction(`Move ${title} down.`)}
                    className="rounded-lg border border-white/10 p-2 text-[var(--muted)]"
                    aria-label="Move node down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              ) : null}
            </div>

            {transitionsOnly ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 text-[var(--muted-gold)]">
                  <GitBranch size={16} />
                  <span className="text-xs uppercase tracking-[0.18em]">
                    {index === 1 ? "Complete Storyline" : "Open World Until Trigger"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {index === 1
                    ? "The final node completes the Storyline while preserving the same chat."
                    : "Return to open-world play until an authored trigger validates the next node."}
                </p>
              </div>
            ) : null}
          </article>
        )
      )}
    </div>
  );
}

function MockOpenWorldEditor({ onAction }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Globe2 size={22} className="mt-1 text-[var(--muted-gold)]" />
        <div>
          <h3 className="font-display text-3xl">Open-World Interludes</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Same chat, participants, world state, Mechanics, and memory remain
            continuous between authored nodes.
          </p>
        </div>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Default Transition
        </span>
        <select
          defaultValue="OPEN_WORLD_UNTIL_TRIGGER"
          onChange={(event) =>
            onAction(`Default transition: ${event.target.value}.`)
          }
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
        >
          <option value="OPEN_WORLD_UNTIL_TRIGGER">
            OPEN WORLD UNTIL TRIGGER
          </option>
          <option value="IMMEDIATE">IMMEDIATE</option>
          <option value="OPTIONAL">OPTIONAL</option>
          <option value="MANUAL">MANUAL</option>
        </select>
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Open-World Guidance
        </span>
        <textarea
          rows={4}
          defaultValue="Keep the workshop, market district, unresolved charm mystery, cast relationships, and persistent consequences available between nodes."
          onChange={() => onAction("Open-world guidance updated.")}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
        />
      </label>
    </div>
  );
}
