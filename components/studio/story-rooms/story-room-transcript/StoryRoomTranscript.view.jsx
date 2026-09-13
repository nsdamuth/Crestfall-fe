"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Flag, Loader2, Sparkles, X } from "lucide-react";

import { STORY_ROOM_MESSAGE_SURFACE_TONES } from "../story-room-message/StoryRoomMessage.contract";
import StoryRoomMessageView from "../story-room-message/StoryRoomMessage.view";
import StoryRoomNoticeCard from "./StoryRoomNoticeCard";
import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";

const DEFAULT_VISIBLE_MESSAGES = 12;
const LOAD_EARLIER_BATCH_SIZE = 10;

// One line per message, "id\tp" for the player's own messages and
// "id\to" for every other speaker: the scroll effect's one reactive
// input, so copy feedback or an action state change never re-runs it.
function buildScrollKey(items) {
  return items
    .map(
      (item) =>
        `${item.id}\t${
          item.message?.surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER ? "p" : "o"
        }`
    )
    .join("\n");
}

function parseScrollKey(key) {
  if (!key) return [];
  return key.split("\n").map((line) => {
    const [id, tone] = line.split("\t");
    return { id, isPlayer: tone === "p" };
  });
}

export default function StoryRoomTranscriptView({
  openingHeroImage = null,
  messageItems = [],
  loading = false,
  sending = false,
  errorMessage = "",
  playerCharacterPrompt = null,
  reportDialog = null,
}) {
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_MESSAGES);
  const bottomRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const messageNodesRef = useRef(new Map());
  const seenScrollKeyRef = useRef(null);

  const safeMessageItems = Array.isArray(messageItems) ? messageItems : [];
  const hiddenCount = Math.max(safeMessageItems.length - visibleCount, 0);
  const scrollKey = buildScrollKey(safeMessageItems);

  const visibleMessages = useMemo(() => {
    const startIndex = Math.max(safeMessageItems.length - visibleCount, 0);
    return safeMessageItems.slice(startIndex);
  }, [safeMessageItems, visibleCount]);

  // Scroll (brief 3 item 7): a newly arrived message from anyone but the
  // player scrolls so that message's top edge sits at the top of the
  // scroll region, and the reader scrolls down through it. The player's
  // own sent messages, the first load, a room change (no id survives),
  // and every status change still scroll to the bottom. New messages
  // are the ids not seen on the previous run; the anchor is the first
  // arrival that is not the player's, taken only when the last arrival
  // is not the player's either.
  useEffect(() => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    const entries = parseScrollKey(scrollKey);
    const seenIds = seenScrollKeyRef.current;
    const continuesThread =
      seenIds instanceof Set && entries.some((entry) => seenIds.has(entry.id));
    const arrivals = continuesThread
      ? entries.filter((entry) => !seenIds.has(entry.id))
      : [];
    seenScrollKeyRef.current = new Set(entries.map((entry) => entry.id));

    const lastArrival = arrivals[arrivals.length - 1] || null;
    const anchorId =
      lastArrival && !lastArrival.isPlayer
        ? arrivals.find((entry) => !entry.isPlayer)?.id || null
        : null;

    scrollFrameRef.current = requestAnimationFrame(() => {
      const anchorNode = anchorId ? messageNodesRef.current.get(anchorId) : null;

      if (anchorNode) {
        anchorNode.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }

      bottomRef.current?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    });

    return () => {
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [
    scrollKey,
    sending,
    loading,
    errorMessage,
    playerCharacterPrompt?.visible,
    playerCharacterPrompt?.selectedName,
  ]);

  function registerMessageNode(id) {
    return (node) => {
      if (node) {
        messageNodesRef.current.set(id, node);
      } else {
        messageNodesRef.current.delete(id);
      }
    };
  }

  function loadEarlierMessages() {
    setVisibleCount((current) =>
      Math.min(current + LOAD_EARLIER_BATCH_SIZE, safeMessageItems.length)
    );
  }

  return (
    <>
    {/* scroll-pt-5 matches the region's own p-5, so an anchored message
        lands where the first message sits at the region's top. */}
    <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-5 scroll-smooth scroll-pt-5">
      {hiddenCount > 0 ? (
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={loadEarlierMessages}
            className="cf-btn cf-btn--secondary"
          >
            <ChevronUp size={14} />
            Load earlier
            <span className="text-[var(--gold-ornament)]">{hiddenCount}</span>
          </button>
        </div>
      ) : null}

      <div className="space-y-4">
        {hiddenCount === 0 && openingHeroImage?.displayUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--canvas)]">
            <div className="flex max-h-[26rem] items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={openingHeroImage.displayUrl}
                alt={openingHeroImage.altText || "Story opening image"}
                width={openingHeroImage.width || undefined}
                height={openingHeroImage.height || undefined}
                className="h-auto max-h-[26rem] max-w-full object-contain"
              />
            </div>
          </div>
        ) : null}

        {visibleMessages.map((item) => (
          <div key={item.id} ref={registerMessageNode(item.id)}>
            <StoryRoomMessageView {...item.message} />
          </div>
        ))}

        {playerCharacterPrompt?.visible ? (
          <PlayerCharacterPromptCard prompt={playerCharacterPrompt} />
        ) : null}

        {loading ? (
          <StatusCard icon={Loader2} spin>
            Loading story
          </StatusCard>
        ) : null}

        {!loading && !safeMessageItems.length && !errorMessage ? (
          <StatusCard icon={Sparkles}>
            This story has no messages yet. Send the opening message to begin.
          </StatusCard>
        ) : null}

        {sending ? (
          <StatusCard icon={Loader2} spin>
            Crestfall Engine is composing the next response...
          </StatusCard>
        ) : null}

        {errorMessage ? <ErrorCard message={errorMessage} /> : null}

        <div ref={bottomRef} aria-hidden="true" className="h-px" />
      </div>
    </div>
    {reportDialog?.open ? <MessageReportDialog {...reportDialog} /> : null}
    </>
  );
}

function MessageReportDialog({
  speaker = "Message",
  reasonOptions = [],
  reasonCode = "OTHER",
  comment = "",
  pending = false,
  error = "",
  onReasonCodeChange,
  onCommentChange,
  onCancel,
  onSubmit,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-room-report-title"
    >
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--line)] bg-[image:var(--grad-panel-lift)] p-5 shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
              <Flag size={15} aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.18em]">
                Message report
              </p>
            </div>
            <h2
              id="story-room-report-title"
              className="mt-2 text-lg font-semibold text-[var(--ink)]"
            >
              Report {speaker}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ink-dim)]">
              This sends a snapshot of this message for review. It does not
              alter the Story or its runtime state.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            aria-label="Close report dialog"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--ink-dim)] transition hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)] disabled:opacity-50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <label className="mt-5 block text-xs uppercase tracking-[0.15em] text-[var(--ink-dim)]">
          Reason
          <div className="mt-2 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
            <KitDropdownView
              options={reasonOptions}
              selectedValues={reasonCode ? [reasonCode] : []}
              isMultiSelect={false}
              isDisabled={pending}
              onToggleOption={(nextValue) => onReasonCodeChange?.(nextValue)}
            />
          </div>
        </label>

        <label className="mt-4 block text-xs uppercase tracking-[0.15em] text-[var(--ink-dim)]">
          Additional details{" "}
          <span className="normal-case tracking-normal">(optional)</span>
          <textarea
            value={comment}
            onChange={(event) =>
              onCommentChange?.(event.target.value.slice(0, 2000))
            }
            disabled={pending}
            rows={4}
            maxLength={2000}
            placeholder="Describe what should be reviewed."
            className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--step-below)] px-3 py-2.5 text-[length:var(--text-input)] normal-case leading-[var(--lh-input)] tracking-normal text-[var(--ink)] shadow-[var(--shadow-bed)] placeholder:text-[var(--ink-faint)]"
          />
        </label>

        {error ? (
          <p className="mt-3 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger-text)]" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="cf-btn cf-btn--secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={pending}
            className="cf-btn cf-btn--primary disabled:cursor-wait"
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Flag size={14} aria-hidden="true" />
            )}
            {pending ? "Submitting" : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  );
}

// The player character prompt and the story error card share the notice
// card recipe: informational prompts use Story system blue; danger/error
// notices retain the dedicated danger tokens.
function PlayerCharacterPromptCard({ prompt }) {
  const selectedName = String(prompt?.selectedName || "").trim();
  const buttonLabel = selectedName
    ? "Change player character"
    : "Select player character";

  return (
    <StoryRoomNoticeCard
      eyebrow="Player character"
      body={
        selectedName
          ? `${selectedName} is your player character for this story. You can change it until you send the first message.`
          : "Choose a player character before your first message. This selection stays editable until the story begins."
      }
      action={{
        label: buttonLabel,
        busyLabel: "Setting",
        busy: Boolean(prompt?.busy),
        onPress: () => prompt?.onSelect?.(),
      }}
      errorMessage={prompt?.errorMessage || ""}
    />
  );
}

function StatusCard({ icon: Icon, spin = false, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-5 text-center">
      <Icon
        className={`mx-auto text-[var(--gold-ornament)] ${spin ? "animate-spin" : ""}`}
        size={24}
      />

      <p className="mt-3 text-sm text-[var(--ink-dim)]">{children}</p>
    </div>
  );
}

function ErrorCard({ message }) {
  return <StoryRoomNoticeCard tone="danger" eyebrow="Story error" body={message} />;
}
