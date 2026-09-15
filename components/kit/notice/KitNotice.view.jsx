"use client";

// KitNotice.view: stateless presentation of one transient
// confirmation line (contract 1.0.0, ASSET-FOLDERS package AF1). Two
// tones, neutral (create, rename, move, add, remove) and danger
// (delete), R5 of the plan. role="status" on both tones (the message
// is a confirmation, never an interruption, so it never escalates to
// role="alert"). Width: w-full so the note fills its container at
// 390 (the page's own --space-5 gutter already frames it), capped at
// a fixed max width and centered once the container is wide enough
// to show the gap (1440, the page column), through one class pair
// (max-w plus mx-auto) with no media query. Radius is --radius-lg per
// the radius tier test (a full-width, floating surface). Every value
// resolves through a token; nothing here is a raw literal or an
// off-contract utility class.
import { X } from "lucide-react";

const TONE_CLASSES = {
  neutral: {
    note: "border-[var(--line)] bg-[var(--fill-whisper)]",
    text: "text-[var(--ink)]",
  },
  danger: {
    note: "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]",
    text: "text-[var(--status-danger)]",
  },
};

export default function KitNoticeView({ message = "", tone = "neutral", onDismiss = null }) {
  if (!message) return null;

  const classes = TONE_CLASSES[tone] || TONE_CLASSES.neutral;

  return (
    <div
      role="status"
      className={`mx-auto flex w-full max-w-[28rem] min-w-0 items-center gap-[var(--space-3)] rounded-[var(--radius-lg)] border px-[var(--space-5)] py-[var(--space-3)] shadow-[var(--shadow-popover)] ${classes.note}`}
    >
      <p className={`min-w-0 flex-1 break-words text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${classes.text}`}>
        {message}
      </p>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => onDismiss?.()}
          className="flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-faint)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
