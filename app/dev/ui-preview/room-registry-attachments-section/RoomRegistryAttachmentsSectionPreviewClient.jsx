"use client";

import { useEffect, useState } from "react";

import RoomRegistryAttachmentsSectionView from "@/components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.view";
import {
  roomRegistryAttachmentsEmptyFixture,
  roomRegistryAttachmentsLegacyFixture,
  roomRegistryAttachmentsLongContentFixture,
  roomRegistryAttachmentsMissingCallbacksFixture,
  roomRegistryAttachmentsNoGroupsFixture,
  roomRegistryAttachmentsPopulatedFixture,
} from "@/components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.fixtures";

const PREVIEW_STATES = {
  populated: {
    label: "Populated",
    props: roomRegistryAttachmentsPopulatedFixture,
  },
  empty: {
    label: "Empty",
    props: roomRegistryAttachmentsEmptyFixture,
  },
  legacy: {
    label: "Legacy ID Link",
    props: roomRegistryAttachmentsLegacyFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomRegistryAttachmentsLongContentFixture,
  },
  noGroups: {
    label: "No Groups",
    props: roomRegistryAttachmentsNoGroupsFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: roomRegistryAttachmentsMissingCallbacksFixture,
  },
};

function cloneGroups(groups) {
  return (Array.isArray(groups) ? groups : []).map((group) => ({
    ...group,
    attachments: (Array.isArray(group?.attachments)
      ? group.attachments
      : []
    ).map((attachment) => ({ ...attachment })),
  }));
}

export default function RoomRegistryAttachmentsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("populated");
  const [groups, setGroups] = useState(() =>
    cloneGroups(PREVIEW_STATES.populated.props.groups)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setGroups(cloneGroups(activeState.props.groups));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  function removeAttachment(groupId, attachmentId) {
    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attachments: group.attachments.filter(
                (attachment) => attachment.id !== attachmentId
              ),
            }
          : group
      )
    );
    setFeedback(`Remove attachment intent: ${groupId} / ${attachmentId}`);
  }

  function changeNotes(groupId, attachmentId, notes) {
    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attachments: group.attachments.map((attachment) =>
                attachment.id === attachmentId
                  ? { ...attachment, notes }
                  : attachment
              ),
            }
          : group
      )
    );
    setFeedback(`Notes changed: ${groupId} / ${attachmentId}`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Registry Attachments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story registry-attachment surface
            directly from contract-shaped fixtures. Attach, remove, and notes
            actions remain local and never load or modify real creations.
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
            <RoomRegistryAttachmentsSectionView
              {...activeState.props}
              groups={groups}
              onOpenRegistryPicker={
                callbacksEnabled
                  ? (groupId) =>
                      setFeedback(`Open registry picker intent: ${groupId}`)
                  : null
              }
              onRemoveRegistry={
                callbacksEnabled ? removeAttachment : null
              }
              onChangeRegistryNotes={
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
              Fixtures contain display-ready groups and attachment cards only.
              Raw Story data fields, legacy ID links, picker configuration,
              linked-creation normalization, deduplication, and draft updates
              remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
