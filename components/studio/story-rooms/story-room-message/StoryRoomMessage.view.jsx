"use client";

import {
  AlertCircle,
  Check,
  Copy,
  Flag,
  Loader2,
  RotateCcw,
  StepForward,
} from "lucide-react";

import {
  STORY_ROOM_MESSAGE_BODY_MODES,
  STORY_ROOM_MESSAGE_CONTENT_TYPES,
  STORY_ROOM_MESSAGE_COPY_STATES,
  STORY_ROOM_MESSAGE_MEDIA_SUBTYPES,
  STORY_ROOM_MESSAGE_DELIVERY_STATES,
  STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS,
  STORY_ROOM_MESSAGE_SEGMENT_TYPES,
  STORY_ROOM_MESSAGE_SURFACE_TONES,
} from "./StoryRoomMessage.contract";
import {
  buildLegacyMessageParagraphs,
  buildSemanticMessageParagraphs,
} from "./storyRoomMessageSpacing";

const DEFAULT_PALETTE_COLORS = Object.freeze({
  dialogue: "#F5E7C7",
  narration: "#C89B5A",
  emphasis: "#E2B96F",
  strong: "#FFD99A",
  whisper: "#AFA08A",
  speaker: "#D6B36A",
  border: "#8A6A3C",
});

function tokenizeInlineMarkup(text) {
  const tokens = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    const value = match[0];

    if (value.startsWith("**") && value.endsWith("**")) {
      tokens.push({
        type: "bold",
        value: value.slice(2, -2),
      });
    } else if (value.startsWith("*") && value.endsWith("*")) {
      tokens.push({
        type: "action",
        value: value.slice(1, -1),
      });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return tokens;
}

function renderInlineMarkup(text, keyPrefix) {
  return tokenizeInlineMarkup(text).map((token, index) => {
    const key = `${keyPrefix}-${index}`;

    if (token.type === "bold") {
      return (
        <strong key={key} className="font-semibold text-[var(--ink)]">
          {token.value}
        </strong>
      );
    }

    if (token.type === "action") {
      return (
        <em key={key} className="italic text-[var(--gold-ornament)]/90">
          {token.value}
        </em>
      );
    }

    return <span key={key}>{token.value}</span>;
  });
}

function LegacyMessageBody({ body = "", allowAutomaticSpacing = false }) {
  const text = String(body || "");
  const blocks = allowAutomaticSpacing
    ? buildLegacyMessageParagraphs(text)
    : text.split(/\n{2,}/);

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n");
    const isQuoteBlock = lines.every((line) => line.trim().startsWith(">"));

    if (isQuoteBlock) {
      const quoteText = lines
        .map((line) => line.replace(/^\s*>\s?/, ""))
        .join("\n");
      const quoteLines = quoteText.split("\n");

      return (
        <blockquote
          key={`block-${blockIndex}`}
          className="my-3 border-l-2 border-[var(--gold-ornament)]/50 pl-4 text-[var(--ink-dim)]"
        >
          {quoteLines.map((line, lineIndex) => (
            <span key={`quote-${blockIndex}-${lineIndex}`}>
              {renderInlineMarkup(line, `quote-${blockIndex}-${lineIndex}`)}
              {lineIndex < quoteLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </blockquote>
      );
    }

    return (
      <p key={`block-${blockIndex}`} className="my-3 first:mt-0 last:mb-0">
        {lines.map((line, lineIndex) => (
          <span key={`line-${blockIndex}-${lineIndex}`}>
            {renderInlineMarkup(line, `line-${blockIndex}-${lineIndex}`)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

function getSegmentStyle(segment, paletteColors) {
  const style = {
    color:
      segment.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.DIALOGUE
        ? paletteColors.dialogue
        : segment.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.NARRATION
          ? paletteColors.narration
          : "var(--ink)",
    fontStyle:
      segment.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.NARRATION
        ? "italic"
        : "normal",
  };

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.EMPHASIS) {
    style.color = paletteColors.emphasis;
  }

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.STRONG) {
    style.color = paletteColors.strong;
    style.fontWeight = 600;
  }

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.WHISPER) {
    style.color = paletteColors.whisper;
    style.fontStyle = "italic";
  }

  return style;
}

function SemanticMessageBody({
  segments,
  statusBlocks,
  paletteColors,
  allowAutomaticSpacing = false,
}) {
  const paragraphs = allowAutomaticSpacing
    ? buildSemanticMessageParagraphs(segments)
    : [segments];

  return (
    <>
      <div className={paragraphs.length > 1 ? "space-y-4" : ""}>
        {paragraphs.map((paragraph, paragraphIndex) => (
          <div
            key={`presentation-paragraph-${paragraphIndex}`}
            className="whitespace-pre-wrap leading-7"
          >
            {paragraph.map((segment, segmentIndex) => (
              <span
                key={`presentation-segment-${paragraphIndex}-${segmentIndex}`}
                style={getSegmentStyle(segment, paletteColors)}
              >
                {segment.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {statusBlocks.length ? (
        <div className="mt-4 space-y-2 border-t border-[var(--gold-ornament)]/20 pt-3 text-xs leading-5 text-[var(--gold-ornament)]/90">
          {statusBlocks.map((block, index) => (
            <div
              key={block.id || `status-block-${index}`}
              className="whitespace-pre-wrap"
            >
              {block.text}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}


function AutoEventMediaMessage({ media }) {
  const isLocation =
    media?.subtype ===
    STORY_ROOM_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE;

  return (
    <article className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/25">
      <div
        className="flex w-full items-center justify-center overflow-hidden bg-black/40"
        style={{ maxHeight: "26rem" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.displayUrl}
          alt={media.altText || "Story image"}
          width={media.width || undefined}
          height={media.height || undefined}
          className="h-auto max-w-full object-contain"
          style={{ maxHeight: "26rem", width: "auto" }}
        />
      </div>

      {isLocation && media.caption ? (
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Location
          </p>
          <p className="mt-1 text-sm text-[var(--ink)]/90">
            {media.caption}
          </p>
        </div>
      ) : null}
    </article>

    {(canCopy && typeof onCopy === "function") ||
    (canRegenerate && typeof onRegenerate === "function") ||
    (canContinue && typeof onContinue === "function") ||
    (canReport && typeof onReport === "function") ? (
      <div className={`mt-1.5 flex items-center gap-0.5 ${isPlayerMessage ? "justify-end" : "justify-start"}`}>
        {canCopy && typeof onCopy === "function" ? (
          <MessageActionButton onClick={onCopy} label={copyLabel}>
            {copyState === STORY_ROOM_MESSAGE_COPY_STATES.COPIED ? (
              <Check size={13} aria-hidden="true" />
            ) : copyState === STORY_ROOM_MESSAGE_COPY_STATES.FAILED ? (
              <AlertCircle size={13} aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
          </MessageActionButton>
        ) : null}

        {canRegenerate && typeof onRegenerate === "function" ? (
          <MessageActionButton
            onClick={onRegenerate}
            disabled={regeneratePending || continuePending || reportPending}
            label={regeneratePending ? "Regenerating response" : regenerateError ? `Regenerate response. Last attempt failed: ${regenerateError}` : "Regenerate response"}
            title={regeneratePending ? "Regenerating response" : regenerateError || "Regenerate response"}
          >
            {regeneratePending ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : regenerateError ? (
              <AlertCircle size={13} aria-hidden="true" />
            ) : (
              <RotateCcw size={13} aria-hidden="true" />
            )}
          </MessageActionButton>
        ) : null}

        {canContinue && typeof onContinue === "function" ? (
          <MessageActionButton
            onClick={onContinue}
            disabled={continuePending || regeneratePending || reportPending}
            label={continuePending ? "Continuing response" : continueError ? `Continue response. Last attempt failed: ${continueError}` : "Continue response"}
            title={continuePending ? "Continuing response" : continueError || "Continue response"}
          >
            {continuePending ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : continueError ? (
              <AlertCircle size={13} aria-hidden="true" />
            ) : (
              <StepForward size={13} aria-hidden="true" />
            )}
          </MessageActionButton>
        ) : null}

        {canReport && typeof onReport === "function" ? (
          <MessageActionButton
            onClick={onReport}
            disabled={reportPending || regeneratePending || continuePending || reportSubmitted}
            label={reportPending ? "Submitting report" : reportSubmitted ? "Message reported" : reportError ? `Report message. Last attempt failed: ${reportError}` : "Report message"}
            title={reportPending ? "Submitting report" : reportSubmitted ? "Reported" : reportError || "Report message"}
          >
            {reportPending ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : reportSubmitted ? (
              <Check size={13} aria-hidden="true" />
            ) : reportError ? (
              <AlertCircle size={13} aria-hidden="true" />
            ) : (
              <Flag size={13} aria-hidden="true" />
            )}
          </MessageActionButton>
        ) : null}
      </div>
    ) : null}
    </div>
  );
}

function MessageActionButton({ onClick, disabled = false, label, title = label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-ornament)]/60 disabled:cursor-wait disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function getArticleClassName(surfaceTone) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER) {
    return "ml-auto max-w-3xl border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING) {
    return "border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/5";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "border-sky-400/20 bg-sky-400/10";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR) {
    return "border-[var(--gold-ornament)]/25 bg-black/30";
  }

  return "border-white/10 bg-black/25";
}

function getBodyClassName(surfaceTone, hasSemanticPresentation) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING) {
    return "text-sm text-[var(--ink)]/90";
  }

  if (
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR &&
    !hasSemanticPresentation
  ) {
    return "font-serif text-lg italic text-[var(--ink-dim)]";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "text-sm text-sky-100/80";
  }

  return "text-[var(--ink)]";
}

export default function StoryRoomMessageView({
  surfaceTone = STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER,
  contentType = STORY_ROOM_MESSAGE_CONTENT_TYPES.TEXT,
  speakerLabel = "",
  speakerAvatarUrl = null,
  openingLabel = "",
  modeLabel = "",
  bodyMode = STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody = "",
  semanticSegments = [],
  statusBlocks = [],
  paletteColors = null,
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
  if (
    contentType === STORY_ROOM_MESSAGE_CONTENT_TYPES.AUTO_EVENT_MEDIA &&
    media?.displayUrl
  ) {
    return <AutoEventMediaMessage media={media} />;
  }

  const safeSegments = Array.isArray(semanticSegments) ? semanticSegments : [];
  const safeStatusBlocks = Array.isArray(statusBlocks) ? statusBlocks : [];
  const hasSemanticPresentation =
    bodyMode === STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC && safeSegments.length > 0;
  const resolvedPaletteColors = paletteColors || DEFAULT_PALETTE_COLORS;
  const allowAutomaticSpacing =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER ||
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR;
  const isPlayerMessage =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER;
  const copyLabel =
    copyState === STORY_ROOM_MESSAGE_COPY_STATES.COPIED
      ? "Copied"
      : copyState === STORY_ROOM_MESSAGE_COPY_STATES.FAILED
        ? "Copy failed"
        : "Copy message";

  return (
    <div className={`flex w-full flex-col ${isPlayerMessage ? "items-end" : "items-start"}`}>
    <article
      className={`rounded-[var(--radius-md)] border p-4 ${getArticleClassName(surfaceTone)}`}
      style={
        hasSemanticPresentation
          ? { borderColor: resolvedPaletteColors.border }
          : undefined
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {speakerAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={speakerAvatarUrl}
              alt={speakerLabel || "Speaker"}
              className="h-7 w-7 shrink-0 rounded-full border object-cover"
              style={
                hasSemanticPresentation
                  ? { borderColor: resolvedPaletteColors.border }
                  : undefined
              }
            />
          ) : null}

          <div className="min-w-0">
            {openingLabel ? (
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {openingLabel}
              </p>
            ) : null}

            <p
              className="truncate text-xs uppercase tracking-[0.2em]"
              style={
                hasSemanticPresentation
                  ? { color: resolvedPaletteColors.speaker }
                  : undefined
              }
            >
              {speakerLabel}
            </p>
          </div>
        </div>

        {modeLabel ? <StatusPill>{modeLabel}</StatusPill> : null}
      </div>

      <div
        className={`mt-3 ${getBodyClassName(
          surfaceTone,
          hasSemanticPresentation
        )}`}
      >
        {hasSemanticPresentation ? (
          <SemanticMessageBody
            segments={safeSegments}
            statusBlocks={safeStatusBlocks}
            paletteColors={resolvedPaletteColors}
            allowAutomaticSpacing={allowAutomaticSpacing}
          />
        ) : (
          <div className="whitespace-pre-wrap leading-7">
            <LegacyMessageBody
              body={legacyBody}
              allowAutomaticSpacing={allowAutomaticSpacing}
            />
          </div>
        )}
      </div>

      {deliveryState === STORY_ROOM_MESSAGE_DELIVERY_STATES.FAILED ? (
        <p className="mt-3 text-xs text-red-200">
          Message failed to send. Copy and retry.
        </p>
      ) : deliveryState === STORY_ROOM_MESSAGE_DELIVERY_STATES.SENDING ? (
        <p className="mt-3 text-xs text-[var(--ink-dim)]">Sending…</p>
      ) : null}
    </article>
  );
}

function StatusPill({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
      {children}
    </span>
  );
}
