"use client";

import {
  STORY_ROOM_MESSAGE_BODY_MODES,
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
        <strong key={key} className="font-semibold text-[var(--foreground)]">
          {token.value}
        </strong>
      );
    }

    if (token.type === "action") {
      return (
        <em key={key} className="italic text-[var(--muted-gold)]/90">
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
          className="my-3 border-l-2 border-[var(--muted-gold)]/50 pl-4 text-[var(--muted)]"
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
          : "var(--foreground)",
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
        <div className="mt-4 space-y-2 border-t border-[var(--muted-gold)]/20 pt-3 text-xs leading-5 text-[var(--muted-gold)]/90">
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

function getArticleClassName(surfaceTone) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER) {
    return "ml-auto max-w-3xl border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING) {
    return "border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/5";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "border-sky-400/20 bg-sky-400/10";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR) {
    return "border-[var(--muted-gold)]/25 bg-black/30";
  }

  return "border-white/10 bg-black/25";
}

function getBodyClassName(surfaceTone, hasSemanticPresentation) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.OPENING) {
    return "text-sm text-[var(--foreground)]/90";
  }

  if (
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR &&
    !hasSemanticPresentation
  ) {
    return "font-serif text-lg italic text-[var(--muted)]";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "text-sm text-sky-100/80";
  }

  return "text-[var(--foreground)]";
}

export default function StoryRoomMessageView({
  surfaceTone = STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER,
  speakerLabel = "",
  speakerAvatarUrl = null,
  openingLabel = "",
  modeLabel = "",
  bodyMode = STORY_ROOM_MESSAGE_BODY_MODES.LEGACY,
  legacyBody = "",
  semanticSegments = [],
  statusBlocks = [],
  paletteColors = null,
  deliveryState = null,
}) {
  const safeSegments = Array.isArray(semanticSegments) ? semanticSegments : [];
  const safeStatusBlocks = Array.isArray(statusBlocks) ? statusBlocks : [];
  const hasSemanticPresentation =
    bodyMode === STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC && safeSegments.length > 0;
  const resolvedPaletteColors = paletteColors || DEFAULT_PALETTE_COLORS;
  const allowAutomaticSpacing =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER ||
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR;

  return (
    <article
      className={`rounded-2xl border p-4 ${getArticleClassName(surfaceTone)}`}
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
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-gold)]">
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
        <p className="mt-3 text-xs text-[var(--muted)]">Sending…</p>
      ) : null}
    </article>
  );
}

function StatusPill({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
      {children}
    </span>
  );
}
