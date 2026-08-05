"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Loader2, Sparkles } from "lucide-react";

import StoryRoomMessageView from "../story-room-message/StoryRoomMessage.view";

const DEFAULT_VISIBLE_MESSAGES = 12;
const LOAD_EARLIER_BATCH_SIZE = 10;

export default function StoryRoomTranscriptView({
  messageItems = [],
  loading = false,
  sending = false,
  errorMessage = "",
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
  }, [safeMessageItems.length, sending, loading, errorMessage]);

  function loadEarlierMessages() {
    setVisibleCount((current) =>
      Math.min(current + LOAD_EARLIER_BATCH_SIZE, safeMessageItems.length)
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[18rem] scroll-smooth xl:pb-5">
      {hiddenCount > 0 ? (
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={loadEarlierMessages}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
          >
            <ChevronUp size={14} />
            Load Earlier
            <span className="text-[var(--muted-gold)]">{hiddenCount}</span>
          </button>
        </div>
      ) : null}

      <div className="space-y-4">
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

        {errorMessage ? <ErrorCard message={errorMessage} /> : null}

        <div ref={bottomRef} aria-hidden="true" className="h-px" />
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, spin = false, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/20 p-5 text-center">
      <Icon
        className={`mx-auto text-[var(--muted-gold)] ${spin ? "animate-spin" : ""}`}
        size={24}
      />

      <p className="mt-3 text-sm text-[var(--muted)]">{children}</p>
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
