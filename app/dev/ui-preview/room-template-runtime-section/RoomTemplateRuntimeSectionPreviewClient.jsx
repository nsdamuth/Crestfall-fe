"use client";

import { useEffect, useState } from "react";

import RoomTemplateRuntimeSectionView from "@/components/studio/my-creations/edit/sections/room-templates/room-template-runtime-section/RoomTemplateRuntimeSection.view";
import {
  roomTemplateRuntimeEmptyFixture,
  roomTemplateRuntimeGuidanceOnlyFixture,
  roomTemplateRuntimeLegacyFixture,
  roomTemplateRuntimeLongContentFixture,
  roomTemplateRuntimeMissingCallbacksFixture,
  roomTemplateRuntimePopulatedFixture,
} from "@/components/studio/my-creations/edit/sections/room-templates/room-template-runtime-section/RoomTemplateRuntimeSection.fixtures";

const PREVIEW_STATES = {
  populated: { label: "Populated", props: roomTemplateRuntimePopulatedFixture },
  empty: { label: "Empty", props: roomTemplateRuntimeEmptyFixture },
  guidanceOnly: {
    label: "Guidance Only",
    props: roomTemplateRuntimeGuidanceOnlyFixture,
  },
  legacy: { label: "Legacy Link", props: roomTemplateRuntimeLegacyFixture },
  longContent: {
    label: "Long Content",
    props: roomTemplateRuntimeLongContentFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: roomTemplateRuntimeMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function RoomTemplateRuntimeSectionPreviewClient() {
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
  const rulesCodexAttachments = viewProps.rulesCodexAttachments || {};
  const registryAttachments = viewProps.registryAttachments || {};


  function removeRulesCodexAttachment(attachmentId) {
    setViewProps((current) => ({
      ...current,
      rulesCodexAttachments: {
        ...(current.rulesCodexAttachments || {}),
        attachments: (current.rulesCodexAttachments?.attachments || []).filter(
          (attachment) => attachment.id !== attachmentId
        ),
      },
    }));
    setFeedback(`Remove Rules Codex intent: ${attachmentId}`);
  }

  function changeRulesCodexNotes(attachmentId, notes) {
    setViewProps((current) => ({
      ...current,
      rulesCodexAttachments: {
        ...(current.rulesCodexAttachments || {}),
        attachments: (current.rulesCodexAttachments?.attachments || []).map(
          (attachment) =>
            attachment.id === attachmentId
              ? { ...attachment, notes }
              : attachment
        ),
      },
    }));
    setFeedback(`Rules Codex notes changed: ${attachmentId}`);
  }

  function removeAttachment(groupId, attachmentId) {
    setViewProps((current) => ({
      ...current,
      registryAttachments: {
        ...(current.registryAttachments || {}),
        groups: (current.registryAttachments?.groups || []).map((group) =>
          group.id === groupId
            ? {
                ...group,
                attachments: (group.attachments || []).filter(
                  (attachment) => attachment.id !== attachmentId
                ),
              }
            : group
        ),
      },
    }));
    setFeedback(`Remove registry intent: ${groupId} / ${attachmentId}`);
  }

  function changeNotes(groupId, attachmentId, notes) {
    setViewProps((current) => ({
      ...current,
      registryAttachments: {
        ...(current.registryAttachments || {}),
        groups: (current.registryAttachments?.groups || []).map((group) =>
          group.id === groupId
            ? {
                ...group,
                attachments: (group.attachments || []).map((attachment) =>
                  attachment.id === attachmentId
                    ? { ...attachment, notes }
                    : attachment
                ),
              }
            : group
        ),
      },
    }));
    setFeedback(`Registry notes changed: ${groupId} / ${attachmentId}`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Runtime Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story runtime-context section and
            nested Rules Codex and registry-attachments Views directly from
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
            <RoomTemplateRuntimeSectionView
              {...viewProps}
              rulesCodexAttachments={{
                ...rulesCodexAttachments,
                onOpenPicker: callbacksEnabled
                  ? () => setFeedback("Open Rules Codex picker intent.")
                  : null,
                onRemoveAttachment: callbacksEnabled
                  ? removeRulesCodexAttachment
                  : null,
                onChangeAttachmentNotes: callbacksEnabled
                  ? changeRulesCodexNotes
                  : null,
              }}
              registryAttachments={{
                ...registryAttachments,
                onOpenRegistryPicker: callbacksEnabled
                  ? (groupId) =>
                      setFeedback(`Open registry picker intent: ${groupId}`)
                  : null,
                onRemoveRegistry: callbacksEnabled ? removeAttachment : null,
                onChangeRegistryNotes: callbacksEnabled ? changeNotes : null,
              }}
              onChangePrivateGuidance={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        privateGuidance: value,
                      }));
                      setFeedback("Private Room Guidance changed.");
                    }
                  : null
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
              Fixtures contain direct Rules Codex and registry attachment View
              contracts plus display-ready Private Room Guidance. Raw Story
              data, picker configuration, linked creation records, runtime
              selection, saving, and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
