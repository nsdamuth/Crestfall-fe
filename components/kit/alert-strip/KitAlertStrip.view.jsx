"use client";

// Alert tones, docs/BUILD-BLUEPRINT.md 2.11. Four tones exactly:
// success, warning, danger, neutral. Neutral IS the info tone (no
// info color exists and none is minted, kit revision ruling), on the
// ruled --fill-whisper bed matching the proof's one sanctioned
// explainer container (.stripinfo). Every tone ships with its word;
// nothing here signals by color alone.
import { AlertTriangle, CheckCircle2, Sparkles, X, XCircle } from "lucide-react";

const TONE_ICON = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  neutral: Sparkles,
};

const TONE_CLASSES = {
  success: {
    strip: "border-[var(--status-success-border)] bg-[var(--status-success-bed)]",
    icon: "text-[var(--status-success)]",
    title: "text-[var(--status-success)]",
  },
  warning: {
    strip: "border-[var(--status-warning-border)] bg-[var(--status-warning-bed)]",
    icon: "text-[var(--status-warning)]",
    title: "text-[var(--status-warning)]",
  },
  danger: {
    strip: "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]",
    icon: "text-[var(--status-danger)]",
    title: "text-[var(--status-danger)]",
  },
  neutral: {
    strip: "border-[var(--line)] bg-[var(--fill-whisper)]",
    icon: "text-[var(--gold-ornament)]",
    title: "text-[var(--ink)]",
  },
};

export default function KitAlertStripView({
  tone = "neutral",
  title = "",
  body = "",
  actionLabel = "",
  onAction = null,
  onDismiss = null,
}) {
  const classes = TONE_CLASSES[tone] || TONE_CLASSES.neutral;
  const Icon = TONE_ICON[tone] || TONE_ICON.neutral;
  const hasAction = Boolean(actionLabel) && Boolean(onAction);

  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={`flex items-start gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] ${classes.strip}`}
    >
      <Icon size={16} aria-hidden="true" className={`mt-[var(--space-1)] flex-none ${classes.icon}`} />

      <div className="min-w-0 flex-1">
        <p className={`text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${classes.title}`}>{title}</p>
        {body && (
          <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
            {body}
          </p>
        )}
        {hasAction && (
          <button
            type="button"
            onClick={() => onAction?.()}
            className={`mt-[var(--space-2)] inline-flex min-h-[var(--control-sm)] items-center rounded-[var(--radius-sm)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] underline underline-offset-4 transition-colors hover:text-[var(--gold-bright)] active:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${classes.title}`}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => onDismiss?.()}
          className="flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-faint)] transition-colors hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
