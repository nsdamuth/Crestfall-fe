"use client";

import { useEffect, useState } from "react";

import RoomTemplateOpeningSectionView from "@/components/studio/my-creations/edit/sections/room-templates/room-template-opening-section/RoomTemplateOpeningSection.view";
import {
  roomTemplateOpeningSectionCustomCopyFixture,
  roomTemplateOpeningSectionDefaultFixture,
  roomTemplateOpeningSectionFallbackFixture,
  roomTemplateOpeningSectionLongContentFixture,
  roomTemplateOpeningSectionMissingCallbacksFixture,
  roomTemplateOpeningSectionNoCharacterSpeakersFixture,
  roomTemplateOpeningSectionSeveralMessagesFixture,
} from "@/components/studio/my-creations/edit/sections/room-templates/room-template-opening-section/RoomTemplateOpeningSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Single Message",
    props: roomTemplateOpeningSectionDefaultFixture,
  },
  several: {
    label: "Several Messages",
    props: roomTemplateOpeningSectionSeveralMessagesFixture,
  },
  fallback: {
    label: "Default Fallback",
    props: roomTemplateOpeningSectionFallbackFixture,
  },
  noCharacters: {
    label: "No Character Speakers",
    props: roomTemplateOpeningSectionNoCharacterSpeakersFixture,
  },
  longContent: {
    label: "Long Content",
    props: roomTemplateOpeningSectionLongContentFixture,
  },
  customCopy: {
    label: "Custom Copy",
    props: roomTemplateOpeningSectionCustomCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: roomTemplateOpeningSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function reindexMessages(messages) {
  return messages.map((message, index) => ({
    ...message,
    messageLabel: `Opening Message ${index + 1}`,
    canRemove: index !== 0,
  }));
}

export default function RoomTemplateOpeningSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Room Template Opening Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story opening editor directly from
            contract-shaped fixtures. Context, speaker, message, add, and
            removal actions update local preview state only.
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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <RoomTemplateOpeningSectionView
              {...viewProps}
              onChangePublicOpeningContext={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        publicOpeningContextValue: value,
                      }));
                      setFeedback(
                        `Public opening context changed: ${value || "(empty)"}`
                      );
                    }
                  : null
              }
              onChangeOpeningMessageSpeaker={
                callbacksEnabled
                  ? (messageId, value) => {
                      setViewProps((current) => ({
                        ...current,
                        openingMessages: current.openingMessages.map(
                          (message) =>
                            message.id === messageId
                              ? { ...message, speakerValue: value }
                              : message
                        ),
                      }));
                      setFeedback(
                        `${messageId} speaker changed: ${value || "(empty)"}`
                      );
                    }
                  : null
              }
              onChangeOpeningMessageBody={
                callbacksEnabled
                  ? (messageId, value) => {
                      setViewProps((current) => ({
                        ...current,
                        openingMessages: current.openingMessages.map(
                          (message) =>
                            message.id === messageId
                              ? { ...message, bodyValue: value }
                              : message
                        ),
                      }));
                      setFeedback(
                        `${messageId} body changed: ${value || "(empty)"}`
                      );
                    }
                  : null
              }
              onAddOpeningMessage={
                callbacksEnabled
                  ? () => {
                      setViewProps((current) => {
                        const nextIndex = current.openingMessages.length + 1;
                        const nextMessages = [
                          ...current.openingMessages,
                          {
                            id: `preview-message-${nextIndex}`,
                            messageLabel: `Opening Message ${nextIndex}`,
                            speakerValue: "Narrator",
                            bodyValue: "",
                            canRemove: true,
                          },
                        ];

                        return {
                          ...current,
                          openingMessages: reindexMessages(nextMessages),
                        };
                      });
                      setFeedback("Added an opening message.");
                    }
                  : null
              }
              onRemoveOpeningMessage={
                callbacksEnabled
                  ? (messageId) => {
                      setViewProps((current) => ({
                        ...current,
                        openingMessages: reindexMessages(
                          current.openingMessages.filter(
                            (message) => message.id !== messageId
                          )
                        ),
                      }));
                      setFeedback(`Removed ${messageId}.`);
                    }
                  : null
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
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
              Fixtures contain only display-ready opening context, messages,
              speaker options, labels, and semantic callbacks. Raw creation
              forms, Story JSON fields, selected-character normalization,
              message defaults, ID generation, saving, and persistence remain
              application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
