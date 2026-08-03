"use client";

import { useEffect, useMemo, useState } from "react";

import StoryRoomComposerView from "@/components/studio/story-rooms/story-room-composer/StoryRoomComposer.view";
import {
  storyRoomComposerDefaultFixture,
  storyRoomComposerDisabledFixture,
  storyRoomComposerDraftFixture,
  storyRoomComposerLongContentFixture,
  storyRoomComposerMentionFixture,
  storyRoomComposerMinimalOptionsFixture,
  storyRoomComposerSendingFixture,
} from "@/components/studio/story-rooms/story-room-composer/StoryRoomComposer.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: storyRoomComposerDefaultFixture,
  },
  draft: {
    label: "Action Draft",
    props: storyRoomComposerDraftFixture,
  },
  mention: {
    label: "Mention Suggestions",
    props: storyRoomComposerMentionFixture,
  },
  sending: {
    label: "Sending",
    props: storyRoomComposerSendingFixture,
  },
  disabled: {
    label: "Disabled",
    props: storyRoomComposerDisabledFixture,
  },
  minimal: {
    label: "Minimal Speakers",
    props: storyRoomComposerMinimalOptionsFixture,
  },
  longContent: {
    label: "Long Content",
    props: storyRoomComposerLongContentFixture,
  },
};

export default function StoryRoomComposerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [inputMode, setInputMode] = useState("DIALOGUE");
  const [nextSpeaker, setNextSpeaker] = useState("AUTO");
  const [draft, setDraft] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [highlightedMentionIndex, setHighlightedMentionIndex] = useState(0);
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setInputMode(activeState.props.inputMode);
    setNextSpeaker(activeState.props.nextSpeaker);
    setDraft(activeState.props.draft);
    setMentionSuggestions(activeState.props.mentionSuggestions);
    setHighlightedMentionIndex(activeState.props.highlightedMentionIndex);
    setFeedback("No preview action yet.");
  }, [activeState]);

  const previewProps = useMemo(
    () => ({
      ...activeState.props,
      inputMode,
      nextSpeaker,
      draft,
      mentionSuggestions,
      highlightedMentionIndex,
      sendDisabled:
        activeState.props.sendDisabled && !activeState.props.draft
          ? !draft.trim()
          : activeState.props.sendDisabled,
      onChangeInputMode: setInputMode,
      onChangeNextSpeaker: setNextSpeaker,
      onChangeDraft: (nextValue) => setDraft(nextValue),
      onUpdateMentionQuery: () => {},
      onMoveMentionHighlight: (direction) => {
        if (!mentionSuggestions.length) return;

        setHighlightedMentionIndex((current) => {
          if (direction === "previous") {
            return current <= 0 ? mentionSuggestions.length - 1 : current - 1;
          }

          return current >= mentionSuggestions.length - 1 ? 0 : current + 1;
        });
      },
      onSelectHighlightedMention: () => {
        const option = mentionSuggestions[highlightedMentionIndex];
        if (!option) return null;

        const nextValue = `${draft.replace(/@[\p{L}\p{N}'’_-]*$/u, "")}@${option.label} `;
        setDraft(nextValue);
        setMentionSuggestions([]);
        setFeedback(`Selected mention: ${option.label}`);
        return nextValue.length;
      },
      onSelectMention: (participantId) => {
        const option = mentionSuggestions.find(
          (candidate) => candidate.id === participantId
        );
        if (!option) return null;

        const nextValue = `${draft.replace(/@[\p{L}\p{N}'’_-]*$/u, "")}@${option.label} `;
        setDraft(nextValue);
        setMentionSuggestions([]);
        setFeedback(`Selected mention: ${option.label}`);
        return nextValue.length;
      },
      onDismissMentionSuggestions: () => setMentionSuggestions([]),
      onSend: () => setFeedback(`Preview send: ${draft || "(empty draft)"}`),
      onOpenCast: () => setFeedback("Preview Room & Cast action."),
      onOpenState: () => setFeedback("Preview Chronicle State action."),
    }),
    [
      activeState.props,
      draft,
      highlightedMentionIndex,
      inputMode,
      mentionSuggestions,
      nextSpeaker,
    ]
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Story Room Composer</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable desktop and mobile composer from
            contract-shaped fixtures. It does not load a Story Room or send a
            real turn.
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

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview Feedback
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{feedback}</p>
        </section>

        <section className="relative min-h-[760px] overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div className="flex min-h-[560px] items-center justify-center px-6 text-center text-sm text-[var(--muted)] xl:min-h-[620px]">
            Resize below and above the xl breakpoint to compare the mobile and
            desktop composers. Mobile tools can be opened from the sliders icon.
          </div>
          <StoryRoomComposerView {...previewProps} />
        </section>
      </div>
    </main>
  );
}
