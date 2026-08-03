"use client";

import { useEffect, useState } from "react";

import StoryRulesCodexAttachmentsSectionView from "@/components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.view";
import {
  storyRulesCodexAttachmentsEmptyFixture,
  storyRulesCodexAttachmentsLegacyFixture,
  storyRulesCodexAttachmentsLongContentFixture,
  storyRulesCodexAttachmentsMissingCallbacksFixture,
  storyRulesCodexAttachmentsPopulatedFixture,
} from "@/components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: storyRulesCodexAttachmentsPopulatedFixture,
  },
  empty: { label: "Empty", props: storyRulesCodexAttachmentsEmptyFixture },
  legacy: { label: "Legacy ID", props: storyRulesCodexAttachmentsLegacyFixture },
  longContent: {
    label: "Long Content",
    props: storyRulesCodexAttachmentsLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: storyRulesCodexAttachmentsMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function StoryRulesCodexAttachmentsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.populated.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  function removeAttachment(attachmentId) {
    setViewProps((current) => ({
      ...current,
      attachments: (current.attachments || []).filter(
        (attachment) => attachment.id !== attachmentId
      ),
    }));
    setFeedback(`Remove Rules Codex intent: ${attachmentId}`);
  }

  function changeNotes(attachmentId, notes) {
    setViewProps((current) => ({
      ...current,
      attachments: (current.attachments || []).map((attachment) =>
        attachment.id === attachmentId
          ? { ...attachment, notes }
          : attachment
      ),
    }));
    setFeedback(`Rules Codex notes changed: ${attachmentId}`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Rules Codex Attachments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story attachment View directly from
            contract-shaped fixtures. All changes remain preview-local.
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
                onClick={() => setActiveStateKey(stateKey)}
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
        </section>

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <StoryRulesCodexAttachmentsSectionView
              {...viewProps}
              onOpenPicker={
                callbacksEnabled
                  ? () => setFeedback("Open Rules Codex picker intent.")
                  : null
              }
              onRemoveAttachment={
                callbacksEnabled ? removeAttachment : null
              }
              onChangeAttachmentNotes={
                callbacksEnabled ? changeNotes : null
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 2xl:sticky 2xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready attachment cards only. Creation
              loading, RULES_CODEX filtering, storage fields, Story saving,
              runtime selection, and prompt composition remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
