"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import StudioEconomyWidgetView from "@/components/studio/studio-economy-widget/StudioEconomyWidget.view";
import ChatTranscriptView from "../chat-transcript/ChatTranscript.view";
import ChatComposerView from "../chat-composer/ChatComposer.view";
import ChatCastPanelView from "../chat-cast-panel/ChatCastPanel.view";
import ChatStatePanelView from "../chat-state-panel/ChatStatePanel.view";
import ChatSessionDialogsView from "../chat-session-dialogs/ChatSessionDialogs.view";
import ChatPartyRosterView from "../chat-party-roster/ChatPartyRoster.view";

// B1 fade divider (docs/plans/ED1F-DESIGN-DELTAS.md), scope broadened
// to every modal-family divider: 1px, fades to transparent at both
// ends, never edge-to-edge. B8: footer buttons align to its ends.
function FadeDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px bg-[image:var(--line-fade)] ${className}`}
    />
  );
}

function StatusPill({ pill }) {
  const safePill = pill || {};
  const toneClass =
    safePill.tone === "gold"
      ? "border-[var(--gold-action)]/45 bg-[var(--fill)] text-[var(--gold-bright)]"
      : safePill.tone === "danger"
        ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
        : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-faint)]";

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-full)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${toneClass}`}
    >
      {safePill.label}
    </span>
  );
}

function BackControl({ backHref, backLabel, compact = false }) {
  return (
    <Link
      href={backHref || "/studio/v2/stories"}
      aria-label={backLabel || "Back"}
      title={backLabel || "Back"}
      className={`flex touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] ${
        compact ? "h-[var(--control-md)] w-[var(--control-md)]" : "h-[var(--control-sm)] w-[var(--control-sm)]"
      }`}
    >
      <ArrowLeft size={16} aria-hidden="true" />
    </Link>
  );
}

function ChatShellStatusScreen({ tone = "loading", heading, message, backHref, backLabel }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-[var(--space-4)] bg-[var(--canvas)] px-[var(--space-5)] text-center text-[var(--ink)]">
      {tone === "danger" ? (
        <AlertTriangle className="text-[var(--status-danger)]" size={28} aria-hidden="true" />
      ) : (
        <Loader2 className="motion-safe:animate-spin text-[var(--gold-ornament)]" size={28} aria-hidden="true" />
      )}
      <p className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">{heading}</p>
      {message ? (
        <p className="max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {message}
        </p>
      ) : null}
      <Link href={backHref || "/studio/v2/stories"} className="cf-btn cf-btn--secondary mt-[var(--space-2)]">
        {backLabel || "Back to Stories"}
      </Link>
    </div>
  );
}

function LibraryPassUpsellSheet({
  title,
  message,
  passLabel,
  coinCostLabel,
  onOpenLibrary,
  onDismiss,
}) {
  return (
    <KitModalFrame variant="sheet" onClose={onDismiss} ariaLabel={title || "Library Pass required"}>
      <div className="p-[var(--space-5)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Library Pass
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          {title || "This scene needs a Library Pass"}
        </h2>
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {message}
        </p>

        {passLabel || coinCostLabel ? (
          <div className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]">
            {passLabel ? <p className="text-[length:var(--text-ui)] text-[var(--ink)]">{passLabel}</p> : null}
            {coinCostLabel ? (
              <p className="mt-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">{coinCostLabel}</p>
            ) : null}
          </div>
        ) : null}

        <FadeDivider className="mt-[var(--space-5)]" />
        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <button type="button" onClick={() => onDismiss?.()} className="cf-btn cf-btn--secondary">
            Not now
          </button>
          <button type="button" onClick={() => onOpenLibrary?.()} className="goldring cf-btn cf-btn--primary">
            View Library Passes
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

export default function ChatShellView({
  backHref = "/studio/v2/stories",
  backLabel = "Stories",
  eyebrow = "Story",
  title = "",
  scenarioLabel = "",
  modeLabel = "",
  statusPills = [],
  coinChip = {},
  loading = false,
  errorMessage = "",
  leftRailCollapsed = false,
  rightRailCollapsed = false,
  onToggleLeftRail = null,
  onToggleRightRail = null,
  transcript = {},
  composer = {},
  castPanel = {},
  statePanel = {},
  sessionDialogs = {},
  libraryPassUpsell = null,
  partyRoster = null,
}) {
  const composerWrapRef = useRef(null);
  const [measuredComposerHeight, setMeasuredComposerHeight] = useState(0);
  const safeStatusPills = Array.isArray(statusPills) ? statusPills : [];
  const subtitle = [scenarioLabel, modeLabel].filter(Boolean).join(" · ");

  // Party/state mobile-sheet open state, RULED 23 Aug 2026 (build-0823
  // pass 2): lifted here so the composer's Menu and Party chips can
  // open the same sheets the panels themselves render, presentation-
  // only local toggles per LOOM view rules.
  const [partySheetOpen, setPartySheetOpen] = useState(false);
  const [stateSheetOpen, setStateSheetOpen] = useState(false);

  function openPartyPanel() {
    if (leftRailCollapsed) {
      onToggleLeftRail?.();
      return;
    }

    setPartySheetOpen(true);
  }

  function openStatePanel() {
    if (rightRailCollapsed) {
      onToggleRightRail?.();
      return;
    }

    setStateSheetOpen(true);
  }

  const composerProps = { ...composer, onOpenCast: openPartyPanel, onOpenState: openStatePanel };

  useEffect(() => {
    const node = composerWrapRef.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setMeasuredComposerHeight(Math.ceil(entry.contentRect.height));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <ChatShellStatusScreen
        tone="loading"
        heading="Opening Story"
        message="Loading the scene, cast, and current state."
        backHref={backHref}
        backLabel={backLabel}
      />
    );
  }

  if (errorMessage) {
    return (
      <ChatShellStatusScreen
        tone="danger"
        heading="Story could not be opened"
        message={errorMessage}
        backHref={backHref}
        backLabel={backLabel}
      />
    );
  }

  const transcriptProps = {
    ...transcript,
    composerHeightPx: measuredComposerHeight || transcript.composerHeightPx || 0,
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--canvas)] text-[var(--ink)]">
      {/* In-flow story header, RULED 23 Aug 2026 (build-0823 pass 2):
          replaces the two chat-local headers this shell used to carry.
          The real StudioShell top bar and sidebar already wrap this
          route (app/studio/layout.js), so the shell contributes only
          the title, one meta line, and the coin chip; the rail-collapse
          toggles moved into each panel's own header. */}
      <div className="shrink-0 border-b border-[var(--line-whisper)] px-[var(--space-5)] py-[var(--space-4)]">
        <div className="flex flex-wrap items-start justify-between gap-[var(--space-3)]">
          <div className="flex min-w-0 items-center gap-[var(--space-3)]">
            <BackControl backHref={backHref} backLabel={backLabel} compact />
            <div className="min-w-0">
              <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {eyebrow}
              </p>
              <h1 className="mt-[var(--space-1)] truncate font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-[var(--space-1)] truncate text-[length:var(--text-ui)] text-[var(--ink-dim)]">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] py-[var(--space-1)]">
            <StudioEconomyWidgetView layoutMode="mobileHeader" {...coinChip} />
          </div>
        </div>

        {safeStatusPills.length ? (
          <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
            {safeStatusPills.map((pill) => (
              <StatusPill key={pill.id} pill={pill} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col xl:flex-row">
        <div
          className={`xl:w-[280px] xl:shrink-0 xl:border-r xl:border-[var(--line-whisper)] xl:bg-[var(--surface-3)] ${
            leftRailCollapsed ? "xl:hidden" : ""
          }`}
        >
          <div className="p-[var(--space-4)] xl:sticky xl:top-0 xl:max-h-[calc(100dvh-var(--control-md))] xl:overflow-y-auto">
            <ChatCastPanelView
              {...castPanel}
              canClose
              onClosePanel={onToggleLeftRail}
              mobileOpen={partySheetOpen}
              onMobileOpenChange={setPartySheetOpen}
            />
          </div>
        </div>

        {leftRailCollapsed ? (
          <button
            type="button"
            onClick={() => onToggleLeftRail?.()}
            className="hidden xl:flex xl:w-8 xl:shrink-0 xl:items-center xl:justify-center xl:border-r xl:border-[var(--line-whisper)] xl:bg-[var(--surface-2)] xl:text-[var(--ink-dim)] xl:transition hover:xl:bg-[var(--fill)] hover:xl:text-[var(--ink)]"
            aria-label="Show cast panel"
            title="Show cast panel"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : null}

        <div className="relative flex min-h-0 flex-1 flex-col">
          <ChatTranscriptView {...transcriptProps} />

          <div
            ref={composerWrapRef}
            className="sticky bottom-0 z-10 bg-[var(--surface-3)] pb-[env(safe-area-inset-bottom)]"
          >
            <ChatComposerView {...composerProps} />
          </div>
        </div>

        {rightRailCollapsed ? (
          <button
            type="button"
            onClick={() => onToggleRightRail?.()}
            className="hidden xl:flex xl:w-8 xl:shrink-0 xl:items-center xl:justify-center xl:border-l xl:border-[var(--line-whisper)] xl:bg-[var(--surface-2)] xl:text-[var(--ink-dim)] xl:transition hover:xl:bg-[var(--fill)] hover:xl:text-[var(--ink)]"
            aria-label="Show state panel"
            title="Show state panel"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        ) : null}

        <div
          className={`xl:w-[320px] xl:shrink-0 xl:border-l xl:border-[var(--line-whisper)] xl:bg-[var(--surface-3)] ${
            rightRailCollapsed ? "xl:hidden" : ""
          }`}
        >
          <div className="p-[var(--space-4)] xl:sticky xl:top-0 xl:max-h-[calc(100dvh-var(--control-md))] xl:overflow-y-auto">
            <ChatStatePanelView
              {...statePanel}
              showCloseControl
              onClosePanel={onToggleRightRail}
              mobileOpen={stateSheetOpen}
              onMobileOpenChange={setStateSheetOpen}
            />
          </div>
        </div>
      </div>

      {/* summaryPending intentionally withheld here (RULED, ED1G chat
          family pass): ChatTranscriptView already renders its own
          inline summaryPending StatusCard above, so passing it
          through to ChatSessionDialogsView too produced a duplicate
          indicator, the second one landing below the fold on this
          page. ChatSessionDialogsView's summary-pending composition
          stays available as documented for standalone callers that
          do not already compose a transcript. */}
      <ChatSessionDialogsView activeDialog={sessionDialogs?.activeDialog} />

      {libraryPassUpsell?.open ? <LibraryPassUpsellSheet {...libraryPassUpsell} /> : null}

      {partyRoster?.open ? <ChatPartyRosterView {...partyRoster} /> : null}
    </div>
  );
}
