"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Flag, Loader2, Sparkles, X } from "lucide-react";

import StoryRoomMessageView from "../story-room-message/StoryRoomMessage.view";

const DEFAULT_VISIBLE_MESSAGES = 12;
const LOAD_EARLIER_BATCH_SIZE = 10;

export default function StoryRoomTranscriptView({
  openingHeroImage = null,
  messageItems = [],
  loading = false,
  sending = false,
  summaryPending = false,
  errorMessage = "",
  reportDialog = null,
}) {
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_MESSAGES);
  const bottomRef = useRef(null);
  const scrollFrameRef = useRef(null);

  const safeMessageItems = Array.isArray(messageItems) ? messageItems : [];
  const hiddenCount = Math.max(safeMessageItems.length - visibleCount, 0);

  const visibleMessages = useMemo(() => {
    const startIndex = Math.max(safeMessageItems.length - visibleCount, 0);
    return safeMessageItems.slice(startIndex);
  }, [safeMessageItems, visibleCount]);

  useEffect(() => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
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
  }, [safeMessageItems.length, sending, summaryPending, loading, errorMessage]);

  function loadEarlierMessages() {
    setVisibleCount((current) =>
      Math.min(current + LOAD_EARLIER_BATCH_SIZE, safeMessageItems.length)
    );
  }

  return (
    <>
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[18rem] scroll-smooth xl:pb-5">
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
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/40">
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
          <StoryRoomMessageView key={item.id} {...item.message} />
        ))}

        {loading ? (
          <StatusCard icon={Loader2} spin>
            Loading Story...
          </StatusCard>
        ) : null}

        {!loading && !safeMessageItems.length && !errorMessage ? (
          <StatusCard icon={Sparkles}>
            This Story has no messages yet. Send the opening message to begin.
          </StatusCard>
        ) : null}

        {sending ? (
          <StatusCard icon={Loader2} spin>
            Crestfall Engine is composing the next response...
          </StatusCard>
        ) : null}

        {summaryPending ? <SystemPendingCard /> : null}

        {errorMessage ? <ErrorCard message={errorMessage} /> : null}

        <div ref={bottomRef} aria-hidden="true" className="h-px" />
      </div>
    </div>
    {reportDialog?.open ? <MessageReportDialog {...reportDialog} /> : null}
    </>
  );
}

function MessageReportDialog({ speaker = "Message", reasonOptions = [], reasonCode = "OTHER", comment = "", pending = false, error = "", onReasonCodeChange, onCommentChange, onCancel, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="story-room-report-title">
      <div className="w-full max-w-md rounded-[var(--radius-md)] border border-white/10 bg-[#15130f] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--gold-ornament)]"><Flag size={15} aria-hidden="true" /><p className="text-xs uppercase tracking-[0.18em]">Message report</p></div>
            <h2 id="story-room-report-title" className="mt-2 text-lg font-semibold text-[var(--ink)]">Report {speaker}</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ink-dim)]">This sends a snapshot of this message for review. It does not alter the Story or its runtime state.</p>
          </div>
          <button type="button" onClick={onCancel} disabled={pending} aria-label="Close report dialog" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)] disabled:opacity-50"><X size={16} aria-hidden="true" /></button>
        </div>
        <label className="mt-5 block text-xs uppercase tracking-[0.15em] text-[var(--ink-dim)]">Reason
          <select value={reasonCode} onChange={(event) => onReasonCodeChange?.(event.target.value)} disabled={pending} className="mt-2 w-full rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-3 py-2.5 text-sm normal-case tracking-normal text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50">
            {reasonOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="mt-4 block text-xs uppercase tracking-[0.15em] text-[var(--ink-dim)]">Additional details <span className="normal-case tracking-normal">(optional)</span>
          <textarea value={comment} onChange={(event) => onCommentChange?.(event.target.value.slice(0, 2000))} disabled={pending} rows={4} maxLength={2000} placeholder="Describe what should be reviewed." className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-3 py-2.5 text-sm normal-case leading-6 tracking-normal text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]/70 focus:border-[var(--gold-ornament)]/50" />
        </label>
        {error ? <p className="mt-3 text-sm text-red-200" role="alert">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={pending} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)] disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onSubmit} disabled={pending} className="inline-flex items-center gap-2 rounded-lg border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-2 text-sm text-[var(--ink)] transition hover:bg-[var(--gold-ornament)]/20 disabled:cursor-wait disabled:opacity-60">{pending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Flag size={14} aria-hidden="true" />}{pending ? "Submitting" : "Submit report"}</button>
        </div>
      </div>
    </div>
  );
}

function SystemPendingCard() {
  return (
    <div className="rounded-[var(--radius-md)] border border-cyan-400/25 bg-cyan-500/10 p-5" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-cyan-100">
        <Loader2 size={18} className="shrink-0 animate-spin" aria-hidden="true" />
        <div><p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Scene Recap</p><p className="mt-1 text-sm leading-6 text-cyan-100/85">Crestfall Engine is preparing the current scene recap...</p></div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, spin = false, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/20 p-5 text-center">
      <Icon
        className={`mx-auto text-[var(--gold-ornament)] ${spin ? "animate-spin" : ""}`}
        size={24}
      />

      <p className="mt-3 text-sm text-[var(--ink-dim)]">{children}</p>
    </div>
  );
}

function ErrorCard({ message }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-red-400/25 bg-red-500/10 p-5 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-red-200">
        Story Error
      </p>

      <p className="mt-3 text-sm leading-6 text-red-100/90">{message}</p>
    </div>
  );
}
