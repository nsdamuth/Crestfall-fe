"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ChevronUp, Loader2, Sparkles } from "lucide-react";

import ChatMessageView from "../chat-message/ChatMessage.view";
import {
  CHAT_TRANSCRIPT_DEFAULT_VISIBLE_MESSAGES,
  CHAT_TRANSCRIPT_LOAD_EARLIER_BATCH_SIZE,
} from "./ChatTranscript.contract";

const SCROLLED_UP_THRESHOLD_PX = 96;

export default function ChatTranscriptView({
  openingHeroImage = null,
  messageItems = [],
  loading = false,
  sending = false,
  summaryPending = false,
  errorMessage = "",
  composerHeightPx = 0,
}) {
  const [visibleCount, setVisibleCount] = useState(CHAT_TRANSCRIPT_DEFAULT_VISIBLE_MESSAGES);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const scrollFrameRef = useRef(null);

  const safeMessageItems = useMemo(
    () => (Array.isArray(messageItems) ? messageItems : []),
    [messageItems]
  );
  const hiddenCount = Math.max(safeMessageItems.length - visibleCount, 0);

  const visibleMessages = useMemo(() => {
    const startIndex = Math.max(safeMessageItems.length - visibleCount, 0);
    return safeMessageItems.slice(startIndex);
  }, [safeMessageItems, visibleCount]);

  useEffect(() => {
    if (isScrolledUp) {
      return undefined;
    }

    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    });

    return () => {
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [safeMessageItems.length, sending, summaryPending, loading, errorMessage, isScrolledUp]);

  function handleScroll(event) {
    const target = event.currentTarget;
    const distanceFromBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    setIsScrolledUp(distanceFromBottom > SCROLLED_UP_THRESHOLD_PX);
  }

  function jumpToLatest() {
    setIsScrolledUp(false);
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }

  function loadEarlierMessages() {
    setVisibleCount((current) =>
      Math.min(current + CHAT_TRANSCRIPT_LOAD_EARLIER_BATCH_SIZE, safeMessageItems.length)
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth px-[var(--space-5)] pt-[var(--space-5)]"
        style={{ paddingBottom: `${Math.max(composerHeightPx, 0)}px` }}
      >
        <div className="mx-auto max-w-[var(--measure)]">
          {hiddenCount > 0 ? (
            <div className="mb-[var(--space-4)] flex justify-center">
              <button
                type="button"
                onClick={loadEarlierMessages}
                className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:bg-[var(--fill)] hover:text-[var(--ink)]"
              >
                <ChevronUp size={14} aria-hidden="true" />
                Load Earlier
                <span className="text-[var(--gold-ornament)]">{hiddenCount}</span>
              </button>
            </div>
          ) : null}

          <div className="space-y-[var(--space-4)]">
            {hiddenCount === 0 && openingHeroImage?.displayUrl ? (
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)]">
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
              <ChatMessageView key={item.id} {...item.message} />
            ))}

            {loading ? (
              <StatusCard icon={Loader2} spin>
                Loading Story
              </StatusCard>
            ) : null}

            {!loading && !safeMessageItems.length && !errorMessage ? (
              <StatusCard icon={Sparkles}>
                This Story has no messages yet. Send the opening message to begin.
              </StatusCard>
            ) : null}

            {sending ? (
              <StatusCard icon={Loader2} spin>
                Crestfall Engine is composing the next response
              </StatusCard>
            ) : null}

            {summaryPending ? (
              <StatusCard icon={Loader2} spin tone="quiet">
                Crestfall Engine is preparing the current scene recap
              </StatusCard>
            ) : null}

            {errorMessage ? <ErrorCard message={errorMessage} /> : null}

            <div ref={bottomRef} aria-hidden="true" className="h-px" />
          </div>
        </div>
      </div>

      {isScrolledUp && safeMessageItems.length ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[var(--space-4)] flex justify-center">
          <button
            type="button"
            onClick={jumpToLatest}
            className="pointer-events-auto inline-flex min-h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--gold-action)]/50 bg-[var(--surface-3)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)] shadow-[var(--shadow-popover)] transition hover:bg-[var(--fill)]"
          >
            <ArrowDown size={14} aria-hidden="true" />
            Jump to latest
          </button>
        </div>
      ) : null}
    </div>
  );
}

function StatusCard({ icon: Icon, spin = false, tone = "default", children }) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-dashed p-[var(--space-5)] text-center ${
        tone === "quiet"
          ? "border-[var(--line-whisper)] bg-[var(--surface-1)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-1)]"
      }`}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={`mx-auto text-[var(--gold-ornament)] ${spin ? "motion-safe:animate-spin" : ""}`}
        size={24}
        aria-hidden="true"
      />
      <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {children}
      </p>
    </div>
  );
}

function ErrorCard({ message }) {
  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-[var(--space-5)] text-center"
      role="alert"
    >
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)]">
        Story Error
      </p>
      <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
        {message}
      </p>
    </div>
  );
}
