"use client";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { usePhoneWidth } from "@/components/kit/modal-frame/usePhoneWidth";

// The one dialog recipe on the story chat page (ruling D3, fe/chat-studio
// item 6, 12 Sep 2026), on KitModalFrame: a fixed panelWidth modal at
// 700px and up, the bottom sheet with the grabber below; eyebrow, display
// title, one sentence, then the fade divider and a footer with the
// secondary action left and the primary right. The primary is gold;
// `tone="danger"` swaps it for the ruled B5 danger fill on destructive
// confirms (decision E1). Presentation only: every handler arrives as a
// prop, and `children` is the optional body between the sentence and
// the footer (Manage Cast, item 8).
export default function StoryChatDialog({
  eyebrow = "",
  title = "",
  sentence = "",
  panelWidth = "28rem",
  tone = "default",
  secondary = null,
  primary = null,
  onClose = null,
  ariaLabel = "",
  titleId = "story-chat-dialog-title",
  children = null,
}) {
  const isPhoneWidth = usePhoneWidth();
  const primaryClass =
    tone === "danger" ? "cf-btn cf-btn--danger-filled" : "cf-btn cf-btn--primary";

  return (
    <KitModalFrame
      variant={isPhoneWidth ? "sheet" : "modal"}
      sheetGrabber={isPhoneWidth}
      panelWidth={panelWidth}
      onClose={onClose}
      ariaLabelledBy={title ? titleId : undefined}
      ariaLabel={title ? undefined : ariaLabel || undefined}
    >
      <div className="p-[var(--space-5)] sm:p-[var(--space-6)]">
        {eyebrow ? (
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
        ) : null}

        {title ? (
          <h2
            id={titleId}
            className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
          >
            {title}
          </h2>
        ) : null}

        {sentence ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {sentence}
          </p>
        ) : null}

        {children ? <div className="mt-[var(--space-5)]">{children}</div> : null}

        <div aria-hidden="true" className="mt-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />

        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          {secondary?.label ? (
            <button
              type="button"
              onClick={() => secondary.onPress?.()}
              disabled={Boolean(secondary.disabled)}
              className="cf-btn cf-btn--secondary disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
            >
              {secondary.busy ? secondary.busyLabel || secondary.label : secondary.label}
            </button>
          ) : (
            <span />
          )}

          {primary?.label ? (
            <button
              type="button"
              onClick={() => primary.onPress?.()}
              disabled={Boolean(primary.disabled) || Boolean(primary.busy)}
              className={`${primaryClass} disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]`}
            >
              {primary.busy ? primary.busyLabel || primary.label : primary.label}
            </button>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
