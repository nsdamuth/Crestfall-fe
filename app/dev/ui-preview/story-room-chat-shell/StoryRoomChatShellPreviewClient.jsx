"use client";

import { useMemo, useState } from "react";

import StoryRoomChatShellView from "@/components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view";
import {
  storyRoomChatShellCollapsedFixture,
  storyRoomChatShellCommandsFixture,
  storyRoomChatShellDeleteErrorFixture,
  storyRoomChatShellErrorFixture,
  storyRoomChatShellHelpFixture,
  storyRoomChatShellLoadingFixture,
  storyRoomChatShellMobileCastFixture,
  storyRoomChatShellMobileStateFixture,
  storyRoomChatShellReadyFixture,
  storyRoomChatShellSendingFixture,
} from "@/components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.fixtures";
import { STORY_ROOM_COMMANDS } from "@/components/studio/story-rooms/story-room-composer/storyRoomCommandRegistry";

function buildPreviewLayoutClass({ leftOpen, rightOpen }) {
  return [
    "grid min-h-0 flex-1 gap-5",
    leftOpen && rightOpen
      ? "xl:grid-cols-[280px_minmax(0,1fr)_320px]"
      : leftOpen && !rightOpen
        ? "xl:grid-cols-[280px_minmax(0,1fr)_44px]"
        : !leftOpen && rightOpen
          ? "xl:grid-cols-[44px_minmax(0,1fr)_320px]"
          : "xl:grid-cols-[44px_minmax(0,1fr)_44px]",
  ].join(" ");
}

const PREVIEW_STATES = {
  ready: { label: "Ready", fixture: storyRoomChatShellReadyFixture },
  loading: { label: "Loading", fixture: storyRoomChatShellLoadingFixture },
  sending: { label: "Sending", fixture: storyRoomChatShellSendingFixture },
  loadError: { label: "Load Error", fixture: storyRoomChatShellErrorFixture },
  deleteError: {
    label: "Delete Error",
    fixture: storyRoomChatShellDeleteErrorFixture,
  },
  collapsed: {
    label: "Panels Collapsed",
    fixture: storyRoomChatShellCollapsedFixture,
  },
  commands: {
    label: "Commands",
    fixture: storyRoomChatShellCommandsFixture,
  },
  help: { label: "Help", fixture: storyRoomChatShellHelpFixture },
  mobileCast: {
    label: "Mobile Cast",
    fixture: storyRoomChatShellMobileCastFixture,
  },
  mobileState: {
    label: "Mobile State",
    fixture: storyRoomChatShellMobileStateFixture,
  },
};

export default function StoryRoomChatShellPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("ready");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState(null);
  const [helpPanel, setHelpPanel] = useState(null);
  const [draft, setDraft] = useState("");
  const [nextSpeaker, setNextSpeaker] = useState("AUTO");
  const [lastAction, setLastAction] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  function applyFixture(stateKey) {
    const fixture = PREVIEW_STATES[stateKey].fixture;

    setActiveStateKey(stateKey);
    setLeftOpen(fixture.leftOpen);
    setRightOpen(fixture.rightOpen);
    setMobilePanel(fixture.mobilePanel);
    setHelpPanel(fixture.composerHelpPanel);
    setDraft("");
    setNextSpeaker("AUTO");
    setLastAction("No preview action yet.");
  }

  const viewProps = useMemo(() => {
    const fixture = activeState.fixture;

    const sharedCastProps = {
      room: fixture.room,
      cast: fixture.cast,
      roomId: "preview-room",
      selectedResponderId: nextSpeaker,
      isDeletingRoom: fixture.deletingRoom,
      deleteError: fixture.deleteError,
      onDeleteRoom: () => setLastAction("Requested Story deletion."),
      onSelectResponder: (participantId) => {
        setNextSpeaker(participantId);
        setLastAction(`Selected responder: ${participantId}`);
      },
    };

    return {
      room: fixture.room,
      layoutClass: buildPreviewLayoutClass({ leftOpen, rightOpen }),
      leftOpen,
      rightOpen,
      mobilePanel,
      composerHelpPanel: helpPanel,
      commands: STORY_ROOM_COMMANDS,
      castPanelProps: {
        ...sharedCastProps,
        onClose: () => setLeftOpen(false),
      },
      mobileCastPanelProps: {
        ...sharedCastProps,
        onSelectResponder: (participantId) => {
          setNextSpeaker(participantId);
          setMobilePanel(null);
          setLastAction(`Selected mobile responder: ${participantId}`);
        },
      },
      transcriptProps: {
        messages: fixture.messages,
        loading: fixture.loading,
        sending: fixture.sending,
        error: fixture.error,
      },
      composerProps: {
        inputMode: "DIALOGUE",
        nextSpeaker,
        nextSpeakerOptions: [
          { id: "AUTO", label: "Auto" },
          ...fixture.speakerOptions,
          { id: "RANDOM", label: "Random" },
        ],
        draft,
        setDraft,
        participantMentionOptions: fixture.speakerOptions.filter(
          (option) => option.participantType === "CHARACTER"
        ),
        locationMentionOptions: fixture.locationMentionOptions,
        onSend: () => {
          setLastAction(draft ? `Simulated send: ${draft}` : "Send blocked: empty draft.");
          setDraft("");
        },
        onOpenCast: () => setMobilePanel("cast"),
        onOpenState: () => setMobilePanel("state"),
        isSending: fixture.sending,
        disabled: fixture.loading || Boolean(fixture.error),
      },
      desktopStatePanelProps: {
        room: fixture.room,
        onClose: () => setRightOpen(false),
      },
      mobileStatePanelProps: {
        room: fixture.room,
      },
      runtimeMechanicsPanelProps: {
        room: fixture.room,
        roomId: "preview-room",
        onUpdated: () => setLastAction("Simulated runtime refresh."),
      },
      onToggleLeftPanel: () => setLeftOpen((current) => !current),
      onToggleRightPanel: () => setRightOpen((current) => !current),
      onShowLeftPanel: () => setLeftOpen(true),
      onShowRightPanel: () => setRightOpen(true),
      onCloseMobilePanel: () => setMobilePanel(null),
      onCloseComposerHelpPanel: () => setHelpPanel(null),
    };
  }, [activeState, draft, helpPanel, leftOpen, mobilePanel, nextSpeaker, rightOpen]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Story Room Chat Shell
          </h1>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Story Room shell with local fixtures
            and injected preview components. It does not fetch, send, delete,
            navigate, alter participants, or execute runtime modules.
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
                onClick={() => applyFixture(stateKey)}
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

        <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <StoryRoomChatShellView
            {...viewProps}
            CastPanelComponent={PreviewCastPanel}
            ComposerComponent={PreviewComposer}
            MobileDrawerComponent={PreviewMobileDrawer}
            RuntimeMechanicsPanelComponent={PreviewRuntimeMechanicsPanel}
            StatePanelComponent={PreviewStatePanel}
            TranscriptComponent={PreviewTranscript}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Local Preview Feedback
            </p>
            <p className="mt-3 text-sm text-[var(--foreground)]">{lastAction}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              The View receives display-ready room state, semantic callbacks,
              and injected child surfaces. Transport snapshots and API clients
              remain outside this portable Skin.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PreviewCastPanel({ room, cast = [], selectedResponderId, onClose, onDeleteRoom, onSelectResponder, deleteError }) {
  return (
    <aside className="min-w-0 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Room & Cast</p>
        {onClose ? <button type="button" onClick={onClose} className="text-xs text-[var(--muted)]">Hide</button> : null}
      </div>
      <h2 className="mt-4 font-display text-2xl">{room?.title}</h2>
      <div className="mt-4 grid gap-2">
        {cast.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelectResponder?.(member.id)}
            className={`rounded-xl border p-3 text-left text-sm ${selectedResponderId === member.id ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/10" : "border-white/10 bg-black/25"}`}
          >
            {member.name} · {member.role}
          </button>
        ))}
      </div>
      <button type="button" onClick={onDeleteRoom} className="mt-4 rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-200">Delete Story</button>
      {deleteError ? <p className="mt-3 text-xs text-red-200">{deleteError}</p> : null}
    </aside>
  );
}

function PreviewTranscript({ messages = [], loading, sending, error }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      {loading ? <p className="text-sm text-[var(--muted)]">Loading Story…</p> : null}
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
      {!loading && !error ? messages.map((message) => (
        <article key={message.id} className="mb-4 rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">{message.speaker}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{message.body}</p>
        </article>
      )) : null}
      {sending ? <p className="text-sm text-[var(--muted-gold)]">Generating response…</p> : null}
    </div>
  );
}

function PreviewComposer({ draft = "", setDraft, onSend, onOpenCast, onOpenState, disabled, isSending }) {
  return (
    <div className="border-t border-white/10 bg-black/35 p-4">
      <textarea
        value={draft}
        onChange={(event) => setDraft?.(event.target.value)}
        disabled={disabled}
        placeholder="Write dialogue or natural player input…"
        className="min-h-20 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onOpenCast} className="rounded-xl border border-white/10 px-3 py-2 text-xs">Cast</button>
        <button type="button" onClick={onOpenState} className="rounded-xl border border-white/10 px-3 py-2 text-xs">State</button>
        <button type="button" onClick={() => onSend?.()} disabled={disabled || isSending} className="rounded-xl border border-[var(--muted-gold)]/40 px-3 py-2 text-xs text-[var(--muted-gold)]">{isSending ? "Sending…" : "Send"}</button>
      </div>
    </div>
  );
}

function PreviewStatePanel({ room, onClose }) {
  return (
    <aside className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Chronicle State</p>
        {onClose ? <button type="button" onClick={onClose} className="text-xs text-[var(--muted)]">Hide</button> : null}
      </div>
      <p className="mt-4 text-sm">{room?.location}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{room?.objective}</p>
    </aside>
  );
}

function PreviewRuntimeMechanicsPanel({ onUpdated }) {
  return (
    <aside className="mt-4 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Room Runtime</p>
      <p className="mt-3 text-sm text-[var(--muted)]">Mechanics Module attached · Priority 100</p>
      <button type="button" onClick={onUpdated} className="mt-3 rounded-xl border border-white/10 px-3 py-2 text-xs">Simulate Refresh</button>
    </aside>
  );
}

function PreviewMobileDrawer({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 p-4 xl:hidden">
      <aside className="ml-auto h-full max-w-md overflow-y-auto rounded-2xl border border-[var(--muted-gold)]/30 bg-[#080706] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-[var(--muted)]">Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}
