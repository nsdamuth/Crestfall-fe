"use client";

import { AlertCircle, Check, Copy, Flag, Loader2, RotateCcw, StepForward } from "lucide-react";

import {
  CHAT_MESSAGE_BODY_MODES,
  CHAT_MESSAGE_CONTENT_TYPES,
  CHAT_MESSAGE_COPY_STATES,
  CHAT_MESSAGE_DELIVERY_STATES,
  CHAT_MESSAGE_MEDIA_SUBTYPES,
  CHAT_MESSAGE_SEGMENT_EMPHASIS,
  CHAT_MESSAGE_SEGMENT_TYPES,
  CHAT_MESSAGE_SURFACE_TONES,
} from "./ChatMessage.contract";
import {
  buildLegacyMessageParagraphs,
  buildSemanticMessageParagraphs,
} from "./chatMessageSpacing";

const ACTION_BUTTON_CLASS =
  "inline-flex h-[var(--control-sm)] w-[var(--control-sm)] touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-dim)] transition hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]";

function tokenizeInlineMarkup(text) {
  const tokens = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    const value = match[0];

    if (value.startsWith("**") && value.endsWith("**")) {
      tokens.push({ type: "bold", value: value.slice(2, -2) });
    } else if (value.startsWith("*") && value.endsWith("*")) {
      tokens.push({ type: "action", value: value.slice(1, -1) });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInlineMarkup(text, keyPrefix, paletteStyle) {
  return tokenizeInlineMarkup(text).map((token, index) => {
    const key = `${keyPrefix}-${index}`;

    if (token.type === "bold") {
      return (
        <strong
          key={key}
          className="font-[var(--weight-bold)]"
          style={paletteStyle ? { color: "var(--chat-msg-strong, inherit)" } : undefined}
        >
          {token.value}
        </strong>
      );
    }

    if (token.type === "action") {
      return (
        <em
          key={key}
          className="italic"
          style={paletteStyle ? { color: "var(--chat-msg-narration, inherit)" } : undefined}
        >
          {token.value}
        </em>
      );
    }

    return <span key={key}>{token.value}</span>;
  });
}

function LegacyMessageBody({ body = "", allowAutomaticSpacing = false, usePaletteVars = false }) {
  const text = String(body || "");
  const blocks = allowAutomaticSpacing
    ? buildLegacyMessageParagraphs(text)
    : text.split(/\n{2,}/);

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n");
    const isQuoteBlock = lines.every((line) => line.trim().startsWith(">"));

    if (isQuoteBlock) {
      const quoteText = lines.map((line) => line.replace(/^\s*>\s?/, "")).join("\n");
      const quoteLines = quoteText.split("\n");

      return (
        <blockquote
          key={`block-${blockIndex}`}
          className="my-[var(--space-3)] border-l-2 border-[var(--line-strong)] pl-[var(--space-4)] text-[var(--ink-dim)]"
        >
          {quoteLines.map((line, lineIndex) => (
            <span key={`quote-${blockIndex}-${lineIndex}`}>
              {renderInlineMarkup(line, `quote-${blockIndex}-${lineIndex}`, usePaletteVars)}
              {lineIndex < quoteLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </blockquote>
      );
    }

    return (
      <p key={`block-${blockIndex}`} className="my-[var(--space-3)] first:mt-0 last:mb-0">
        {lines.map((line, lineIndex) => (
          <span key={`line-${blockIndex}-${lineIndex}`}>
            {renderInlineMarkup(line, `line-${blockIndex}-${lineIndex}`, usePaletteVars)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

function getSegmentStyle(segment, usePaletteVars) {
  if (!usePaletteVars) {
    return {
      fontStyle:
        segment.type === CHAT_MESSAGE_SEGMENT_TYPES.NARRATION ? "italic" : "normal",
    };
  }

  const style = {
    color:
      segment.type === CHAT_MESSAGE_SEGMENT_TYPES.DIALOGUE
        ? "var(--chat-msg-dialogue)"
        : segment.type === CHAT_MESSAGE_SEGMENT_TYPES.NARRATION
          ? "var(--chat-msg-narration)"
          : "var(--ink)",
    fontStyle: segment.type === CHAT_MESSAGE_SEGMENT_TYPES.NARRATION ? "italic" : "normal",
  };

  if (segment.emphasis === CHAT_MESSAGE_SEGMENT_EMPHASIS.EMPHASIS) {
    style.color = "var(--chat-msg-emphasis)";
  }

  if (segment.emphasis === CHAT_MESSAGE_SEGMENT_EMPHASIS.STRONG) {
    style.color = "var(--chat-msg-strong)";
    style.fontWeight = "var(--weight-bold)";
  }

  if (segment.emphasis === CHAT_MESSAGE_SEGMENT_EMPHASIS.WHISPER) {
    style.color = "var(--chat-msg-whisper)";
    style.fontStyle = "italic";
  }

  return style;
}

function StreamingCursor({ label = "" }) {
  return (
    <span aria-hidden="true" className="ml-[1px] inline-flex items-center">
      <span className="motion-safe:animate-pulse inline-block h-[1em] w-[2px] translate-y-[2px] bg-[var(--gold-action)]" />
      {label ? <span className="sr-only" role="status">{label}</span> : null}
    </span>
  );
}

function SemanticMessageBody({
  segments,
  statusBlocks,
  allowAutomaticSpacing = false,
  usePaletteVars = false,
  isStreaming = false,
  generationCursorLabel = "",
}) {
  const paragraphs = allowAutomaticSpacing
    ? buildSemanticMessageParagraphs(segments)
    : [segments];

  return (
    <>
      <div className={paragraphs.length > 1 ? "space-y-[var(--space-4)]" : ""}>
        {paragraphs.map((paragraph, paragraphIndex) => {
          const isLastParagraph = paragraphIndex === paragraphs.length - 1;

          return (
            <div
              key={`presentation-paragraph-${paragraphIndex}`}
              className="whitespace-pre-wrap leading-[var(--lh-body)]"
            >
              {paragraph.map((segment, segmentIndex) => (
                <span
                  key={`presentation-segment-${paragraphIndex}-${segmentIndex}`}
                  style={getSegmentStyle(segment, usePaletteVars)}
                >
                  {segment.text}
                </span>
              ))}
              {isLastParagraph && isStreaming ? (
                <StreamingCursor label={generationCursorLabel} />
              ) : null}
            </div>
          );
        })}
      </div>

      {statusBlocks.length ? (
        <div className="mt-[var(--space-4)] space-y-[var(--space-2)] border-t border-[var(--line-whisper)] pt-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
          {statusBlocks.map((block, index) => (
            <div key={block.id || `status-block-${index}`} className="whitespace-pre-wrap">
              {block.text}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function ChromelessMediaMessage({ media }) {
  const isLocation = media?.subtype === CHAT_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE;

  return (
    <article className="w-full overflow-hidden rounded-[var(--radius-lg)]">
      <div
        className="flex w-full items-center justify-center overflow-hidden"
        style={{ maxHeight: "26rem" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.displayUrl}
          alt={media.altText || "Story image"}
          width={media.width || undefined}
          height={media.height || undefined}
          className="h-auto max-w-full rounded-[var(--radius-lg)] object-contain"
          style={{ maxHeight: "26rem", width: "auto" }}
        />
      </div>

      {isLocation && media.caption ? (
        <div className="pt-[var(--space-3)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Location
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-body)] text-[var(--ink-dim)]">
            {media.caption}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function getArticleClassName(surfaceTone) {
  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.PLAYER) {
    return "ml-auto max-w-3xl bg-[var(--fill)]";
  }

  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.OPENING) {
    return "border border-[var(--line-whisper)] bg-[var(--surface-1)]";
  }

  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "mx-auto max-w-xl border-y border-[var(--line-whisper)] bg-transparent text-center";
  }

  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.NARRATOR) {
    return "border border-[var(--line-whisper)] bg-[var(--surface-1)]";
  }

  return "border border-[var(--line-whisper)] bg-[var(--surface-2)]";
}

function getBodyClassName(surfaceTone, hasSemanticPresentation) {
  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.OPENING) {
    return "font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]";
  }

  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.NARRATOR && !hasSemanticPresentation) {
    return "font-display text-[length:var(--text-lead)] italic leading-[var(--lh-lead)] text-[var(--ink-dim)]";
  }

  if (surfaceTone === CHAT_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]";
  }

  return "text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]";
}

export default function ChatMessageView({
  surfaceTone = CHAT_MESSAGE_SURFACE_TONES.CHARACTER,
  contentType = CHAT_MESSAGE_CONTENT_TYPES.TEXT,
  speakerLabel = "",
  speakerAvatarUrl = null,
  openingLabel = "",
  modeLabel = "",
  bodyMode = CHAT_MESSAGE_BODY_MODES.LEGACY,
  legacyBody = "",
  semanticSegments = [],
  statusBlocks = [],
  isStreaming = false,
  generationCursorLabel = "",
  enableFixturePaletteDemo = false,
  paletteRoleOverrides = null,
  media = null,
  deliveryState = null,
  canCopy = false,
  copyState = null,
  onCopy = null,
  canRegenerate = false,
  regeneratePending = false,
  regenerateError = "",
  onRegenerate = null,
  canContinue = false,
  continuePending = false,
  continueError = "",
  onContinue = null,
  canReport = false,
  reportPending = false,
  reportSubmitted = false,
  reportError = "",
  onReport = null,
}) {
  if (contentType === CHAT_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA && media?.displayUrl) {
    return <ChromelessMediaMessage media={media} />;
  }

  const safeSegments = Array.isArray(semanticSegments) ? semanticSegments : [];
  const safeStatusBlocks = Array.isArray(statusBlocks) ? statusBlocks : [];
  const hasSemanticPresentation =
    bodyMode === CHAT_MESSAGE_BODY_MODES.SEMANTIC && safeSegments.length > 0;
  const usePaletteVars = Boolean(enableFixturePaletteDemo && paletteRoleOverrides);
  const allowAutomaticSpacing =
    surfaceTone === CHAT_MESSAGE_SURFACE_TONES.CHARACTER ||
    surfaceTone === CHAT_MESSAGE_SURFACE_TONES.NARRATOR;
  const isPlayerMessage = surfaceTone === CHAT_MESSAGE_SURFACE_TONES.PLAYER;

  const copyLabel =
    copyState === CHAT_MESSAGE_COPY_STATES.COPIED
      ? "Copied"
      : copyState === CHAT_MESSAGE_COPY_STATES.FAILED
        ? "Copy failed"
        : "Copy message";

  const paletteStyleVars = usePaletteVars
    ? {
        "--chat-msg-dialogue": paletteRoleOverrides.dialogue,
        "--chat-msg-narration": paletteRoleOverrides.narration,
        "--chat-msg-emphasis": paletteRoleOverrides.emphasis,
        "--chat-msg-strong": paletteRoleOverrides.strong,
        "--chat-msg-whisper": paletteRoleOverrides.whisper,
        "--chat-msg-speaker": paletteRoleOverrides.speaker,
        "--chat-msg-border": paletteRoleOverrides.border,
      }
    : undefined;

  return (
    <div className={`flex w-full flex-col ${isPlayerMessage ? "items-end" : "items-start"}`}>
      <article
        className={`w-full rounded-[var(--radius-md)] p-[var(--space-4)] ${getArticleClassName(surfaceTone)}`}
        style={
          paletteStyleVars
            ? { ...paletteStyleVars, borderColor: "var(--chat-msg-border)" }
            : undefined
        }
      >
        {surfaceTone !== CHAT_MESSAGE_SURFACE_TONES.SYSTEM ? (
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
            <div className="flex min-w-0 items-center gap-[var(--space-2)]">
              {speakerAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={speakerAvatarUrl}
                  alt={speakerLabel || "Speaker"}
                  className="h-[var(--control-sm)] w-[var(--control-sm)] shrink-0 rounded-[var(--radius-full)] border border-[var(--line-whisper)] object-cover"
                />
              ) : null}

              <div className="min-w-0">
                {openingLabel ? (
                  <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {openingLabel}
                  </p>
                ) : null}

                <p
                  className="truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)]"
                  style={{ color: usePaletteVars ? "var(--chat-msg-speaker)" : "var(--gold-ornament)" }}
                >
                  {speakerLabel}
                </p>
              </div>
            </div>

            {modeLabel ? <ModePill>{modeLabel}</ModePill> : null}
          </div>
        ) : null}

        <div className={`${surfaceTone !== CHAT_MESSAGE_SURFACE_TONES.SYSTEM ? "mt-[var(--space-3)]" : ""} ${getBodyClassName(surfaceTone, hasSemanticPresentation)}`}>
          {hasSemanticPresentation ? (
            <SemanticMessageBody
              segments={safeSegments}
              statusBlocks={safeStatusBlocks}
              allowAutomaticSpacing={allowAutomaticSpacing}
              usePaletteVars={usePaletteVars}
              isStreaming={isStreaming}
              generationCursorLabel={generationCursorLabel}
            />
          ) : (
            <div className="whitespace-pre-wrap leading-[var(--lh-body)]">
              <LegacyMessageBody
                body={legacyBody}
                allowAutomaticSpacing={allowAutomaticSpacing}
                usePaletteVars={usePaletteVars}
              />
              {isStreaming ? <StreamingCursor label={generationCursorLabel} /> : null}
            </div>
          )}
        </div>

        {deliveryState === CHAT_MESSAGE_DELIVERY_STATES.FAILED ? (
          <p className="mt-[var(--space-3)] text-[length:var(--text-label)] text-[var(--status-danger)]">
            Failed to send. Copy and retry.
          </p>
        ) : deliveryState === CHAT_MESSAGE_DELIVERY_STATES.SENDING ? (
          <p className="mt-[var(--space-3)] text-[length:var(--text-label)] text-[var(--ink-faint)]">Sending</p>
        ) : null}
      </article>

      {(canCopy && typeof onCopy === "function") ||
      (canRegenerate && typeof onRegenerate === "function") ||
      (canContinue && typeof onContinue === "function") ||
      (canReport && typeof onReport === "function") ? (
        <div
          className={`mt-[var(--space-1)] flex items-center gap-[var(--space-1)] ${isPlayerMessage ? "justify-end" : "justify-start"}`}
        >
          {canCopy && typeof onCopy === "function" ? (
            <button
              type="button"
              onClick={onCopy}
              aria-label={copyLabel}
              title={copyLabel}
              className={ACTION_BUTTON_CLASS}
            >
              {copyState === CHAT_MESSAGE_COPY_STATES.COPIED ? (
                <Check size={14} aria-hidden="true" />
              ) : copyState === CHAT_MESSAGE_COPY_STATES.FAILED ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
            </button>
          ) : null}

          {canRegenerate && typeof onRegenerate === "function" ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regeneratePending || continuePending || reportPending}
              aria-label={
                regeneratePending
                  ? "Regenerating response"
                  : regenerateError
                    ? `Regenerate response. Last attempt failed: ${regenerateError}`
                    : "Regenerate response"
              }
              title={regeneratePending ? "Regenerating response" : regenerateError || "Regenerate response"}
              className={ACTION_BUTTON_CLASS}
            >
              {regeneratePending ? (
                <Loader2 size={14} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : regenerateError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <RotateCcw size={14} aria-hidden="true" />
              )}
            </button>
          ) : null}

          {canContinue && typeof onContinue === "function" ? (
            <button
              type="button"
              onClick={onContinue}
              disabled={continuePending || regeneratePending || reportPending}
              aria-label={
                continuePending
                  ? "Continuing response"
                  : continueError
                    ? `Continue response. Last attempt failed: ${continueError}`
                    : "Continue response"
              }
              title={continuePending ? "Continuing response" : continueError || "Continue response"}
              className={ACTION_BUTTON_CLASS}
            >
              {continuePending ? (
                <Loader2 size={14} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : continueError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <StepForward size={14} aria-hidden="true" />
              )}
            </button>
          ) : null}

          {canReport && typeof onReport === "function" ? (
            <button
              type="button"
              onClick={onReport}
              disabled={reportPending || regeneratePending || continuePending || reportSubmitted}
              aria-label={
                reportPending
                  ? "Submitting report"
                  : reportSubmitted
                    ? "Message reported"
                    : reportError
                      ? `Report message. Last attempt failed: ${reportError}`
                      : "Report message"
              }
              title={reportPending ? "Submitting report" : reportSubmitted ? "Reported" : reportError || "Report message"}
              className={ACTION_BUTTON_CLASS}
            >
              {reportPending ? (
                <Loader2 size={14} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : reportSubmitted ? (
                <Check size={14} aria-hidden="true" />
              ) : reportError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <Flag size={14} aria-hidden="true" />
              )}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ModePill({ children }) {
  return (
    <span className="rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
      {children}
    </span>
  );
}
