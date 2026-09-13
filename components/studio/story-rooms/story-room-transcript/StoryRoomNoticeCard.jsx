"use client";

import { CircleAlert, UserRound } from "lucide-react";

// One recipe for transcript notice cards. Informational/default notices
// use the established Story system blue language; danger notices remain
// on the dedicated danger tokens. Geometry and caller-owned handlers stay
// unchanged.
const TONE_CLASSES = {
  default: {
    card: "border-sky-400/20 bg-sky-400/10",
    eyebrow: "text-sky-200",
    icon: "bg-sky-400/10 text-sky-200",
    body: "text-sky-100/80",
  },
  danger: {
    card: "border-[var(--status-danger-border)] bg-[var(--surface-1)]",
    eyebrow: "text-[var(--status-danger-text)]",
    icon: "bg-[var(--surface-2)] text-[var(--status-danger)]",
    body: "text-[var(--ink-dim)]",
  },
};

export default function StoryRoomNoticeCard({
  tone = "default",
  eyebrow = "",
  body = "",
  action = null,
  errorMessage = "",
  icon: Icon = null,
  centered = false,
}) {
  const classes = TONE_CLASSES[tone] || TONE_CLASSES.default;
  const ResolvedIcon = Icon || (tone === "danger" ? CircleAlert : UserRound);
  const safeAction = action || null;

  return (
    <article
      role={tone === "danger" ? "alert" : undefined}
      className={`min-w-0 max-w-full rounded-[var(--radius-md)] border p-[var(--space-4)] ${classes.card}`}
    >
      <div className={`flex items-start gap-[var(--space-3)] ${centered ? "flex-col items-center text-center" : ""}`}>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-full)] ${classes.icon}`}
        >
          <ResolvedIcon size={17} />
        </span>

        <div className="min-w-0 flex-1">
          {/* Action placement (brief 2 item 9): the button anchors to the
              right edge of the card on the same row as the text at md
              and up, and runs full width under the text below md. Body
              and label (review round 4 item 3, RULED): both read at the
              transcript's chat tier, --text-chat over --lh-chat, the
              body through the utility and the label through the
              cf-btn--notice variant, which also tightens the button's
              side padding; the height keeps the 44px touch floor. */}
          <div className="md:flex md:items-center md:gap-[var(--space-4)]">
            <div className="min-w-0 md:flex-1">
              {eyebrow ? (
                <p
                  className={`text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] ${classes.eyebrow}`}
                >
                  {eyebrow}
                </p>
              ) : null}

              {body ? (
                <p className={`mt-[var(--space-2)] text-[length:var(--text-chat)] leading-[var(--lh-chat)] ${classes.body}`}>
                  {body}
                </p>
              ) : null}
            </div>

            {safeAction?.label ? (
              <button
                type="button"
                onClick={() => safeAction.onPress?.()}
                disabled={Boolean(safeAction.busy)}
                className="cf-btn cf-btn--secondary cf-btn--notice mt-[var(--space-4)] w-full disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] md:mt-0 md:w-auto md:shrink-0"
              >
                {safeAction.busy ? safeAction.busyLabel || safeAction.label : safeAction.label}
              </button>
            ) : null}
          </div>

          {errorMessage ? (
            <p className="mt-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
