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

// Bubbles (fe/chat-studio item 4, 12 Sep 2026, on the 23 Aug tinted
// bubble law): the player right-aligned on the chat color through the
// locked --chat-bubble-fill recipe, every other speaker left-aligned on
// the nested card surface, no borders, --radius-bubble, body one step
// tighter (the ui step), narration italic, whispers as a quiet inset.
// The speaker name reads --ink in the display font at the lead step
// (brief 4 item 10, review rounds 4 and 5 item 1, RULED, off the
// --chat-speaker-name clamp and off the eyebrow tier); body ink is
// always --ink. The one inline value
// the View writes is the --chat-speaker anchor, contract data, never a
// literal of its own; it still tints the bubble and the avatar tile.

const WHISPER_INSET_CLASS =
  "border-l-2 border-[var(--line-strong)] pl-[var(--space-3)] italic text-[var(--ink-dim)]";

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
        <strong key={key} className="font-[var(--weight-medium)] text-[var(--ink)]">
          {token.value}
        </strong>
      );
    }

    if (token.type === "action") {
      return (
        <em key={key} className="italic text-[var(--ink-dim)]">
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
          className={`my-[var(--space-3)] ${WHISPER_INSET_CLASS}`}
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
      <p key={`block-${blockIndex}`} className="my-[var(--space-3)] first:mt-0 last:mb-0">
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

function getSegmentClassName(segment) {
  const classes = [];

  if (segment.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.NARRATION) {
    classes.push("italic text-[var(--ink-dim)]");
  } else {
    classes.push("text-[var(--ink)]");
  }

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.EMPHASIS) {
    classes.push("italic");
  }

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.STRONG) {
    classes.push("font-[var(--weight-medium)]");
  }

  if (segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.WHISPER) {
    classes.push("italic text-[var(--ink-dim)]");
  }

  return classes.join(" ");
}

function isWhisperParagraph(paragraph) {
  return (
    paragraph.length > 0 &&
    paragraph.every(
      (segment) =>
        segment.emphasis === STORY_ROOM_MESSAGE_SEGMENT_EMPHASIS.WHISPER ||
        !String(segment.text || "").trim()
    )
  );
}

function SemanticMessageBody({
  segments,
  statusBlocks,
  allowAutomaticSpacing = false,
}) {
  const paragraphs = allowAutomaticSpacing
    ? buildSemanticMessageParagraphs(segments)
    : [segments];

  return (
    <>
      <div className={paragraphs.length > 1 ? "space-y-[var(--space-3)]" : ""}>
        {paragraphs.map((paragraph, paragraphIndex) => (
          <div
            key={`presentation-paragraph-${paragraphIndex}`}
            className={`whitespace-pre-wrap ${
              isWhisperParagraph(paragraph) ? WHISPER_INSET_CLASS : ""
            }`}
          >
            {paragraph.map((segment, segmentIndex) => (
              <span
                key={`presentation-segment-${paragraphIndex}-${segmentIndex}`}
                className={getSegmentClassName(segment)}
              >
                {segment.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {statusBlocks.length ? (
        <div className="mt-[var(--space-3)] space-y-[var(--space-1)] border-t border-[var(--line-whisper)] pt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--gold-ornament)]">
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
    media?.subtype === STORY_ROOM_MESSAGE_MEDIA_SUBTYPES.LOCATION_EVENT_IMAGE;

  return (
    <article className="w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)]">
      <div
        className="flex w-full items-center justify-center overflow-hidden bg-[var(--scrim)]"
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
        <div className="border-t border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Location
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {media.caption}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function getWrapperClassName(surfaceTone) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER) {
    return "flex w-full flex-col items-end";
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "flex w-full flex-col items-center";
  }

  return "flex w-full flex-col items-start";
}

function getArticleClassName(surfaceTone) {
  const base = "rounded-[var(--radius-bubble)] px-[var(--space-4)] py-[var(--space-3)]";

  // Bubble width (brief 4 item 9): 85 percent of the transcript column
  // at the shipped 700px breakpoint and up (the player's from the right
  // edge, every other speaker's from the left, the same percentage);
  // below it the width stays as shipped.
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER) {
    return `${base} max-w-[86%] min-[700px]:max-w-[85%] bg-[var(--chat-bubble-fill)]`;
  }

  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return `${base} max-w-xl bg-transparent text-center`;
  }

  return `${base} max-w-[86%] min-[700px]:max-w-[85%] bg-[var(--surface-1)]`;
}

// Transcript body type (brief 3 item 6, RULED by Brian, replacing brief
// 2 item 8's body step): the message body reads at --text-chat and
// --lh-chat (14 over 22), the transcript body tier minted in
// app/theme.css and legal only in this package; the opening label, the
// mode pill, and the delivery lines stay at --text-label, and the
// speaker name reads the display font at --text-lead (brief 4 item 10,
// raised one step by review round 4 item 1 and one more by round 5).
// System notices are meta, not body, and stay at the ui step (the
// brief named the body only).
function getBodyClassName(surfaceTone, hasSemanticPresentation) {
  if (surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM) {
    return "text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]";
  }

  if (
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR &&
    !hasSemanticPresentation
  ) {
    return "font-display text-[length:var(--text-chat)] leading-[var(--lh-chat)] italic text-[var(--ink-dim)]";
  }

  return "text-[length:var(--text-chat)] leading-[var(--lh-chat)] text-[var(--ink)]";
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
  speakerColor = null,
  bubbleColor = null,
  media = null,
  deliveryState = null,
  canCopy = false,
  copyState = null,
  onCopy = null,
  canRegenerate = false,
  regenerateDisabled = false,
  regenerateDisabledReason = "",
  regeneratePending = false,
  regenerateError = "",
  onRegenerate = null,
  canContinue = false,
  continueDisabled = false,
  continueDisabledReason = "",
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
    bodyMode === STORY_ROOM_MESSAGE_BODY_MODES.SEMANTIC &&
    (safeSegments.length > 0 || safeStatusBlocks.length > 0);
  const allowAutomaticSpacing =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.CHARACTER ||
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.NARRATOR;
  const isPlayerMessage =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.PLAYER;
  const isSystemMessage =
    surfaceTone === STORY_ROOM_MESSAGE_SURFACE_TONES.SYSTEM;
  // The anchor the locked --chat-* tokens derive from: the chat color
  // for the player's bubble, the character's palette anchor otherwise.
  const speakerAnchor = isPlayerMessage ? bubbleColor : speakerColor;
  const articleStyle =
    typeof speakerAnchor === "string" && speakerAnchor.trim()
      ? { "--chat-speaker": speakerAnchor.trim() }
      : undefined;
  const copyLabel =
    copyState === STORY_ROOM_MESSAGE_COPY_STATES.COPIED
      ? "Copied"
      : copyState === STORY_ROOM_MESSAGE_COPY_STATES.FAILED
        ? "Copy failed"
        : "Copy message";
  const hasMessageActions =
    (canCopy && typeof onCopy === "function") ||
    (canRegenerate && typeof onRegenerate === "function") ||
    (canContinue && typeof onContinue === "function") ||
    (canReport && typeof onReport === "function");

  return (
    <div className={getWrapperClassName(surfaceTone)}>
      <article className={getArticleClassName(surfaceTone)} style={articleStyle}>
        {isSystemMessage ? null : (
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
            <div className="flex min-w-0 items-center gap-[var(--space-2)]">
              {speakerAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={speakerAvatarUrl}
                  alt={speakerLabel || "Speaker"}
                  className="h-7 w-7 shrink-0 rounded-[var(--radius-full)] bg-[var(--chat-avatar-fill)] object-cover"
                />
              ) : null}

              <div className="min-w-0">
                {openingLabel ? (
                  <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {openingLabel}
                  </p>
                ) : null}

                {/* The speaker name (brief 4 item 10, review rounds 4
                    and 5 item 1): off the eyebrow tier and two steps
                    larger than it, the lead step (19, "a little bit
                    more" than the body step Brian saw in round 4), so it
                    reads clearly above the Opening scene eyebrow;
                    display font, medium weight, --ink, no uppercase, no
                    tracking. */}
                <p className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] font-[var(--weight-medium)] text-[var(--ink)]">
                  {speakerLabel}
                </p>
              </div>
            </div>

            {modeLabel ? <ModePill>{modeLabel}</ModePill> : null}
          </div>
        )}

        <div
          className={`${isSystemMessage ? "" : "mt-[var(--space-2)]"} ${getBodyClassName(
            surfaceTone,
            hasSemanticPresentation
          )}`}
        >
          {hasSemanticPresentation ? (
            <SemanticMessageBody
              segments={safeSegments}
              statusBlocks={safeStatusBlocks}
              allowAutomaticSpacing={allowAutomaticSpacing}
            />
          ) : (
            <div className="whitespace-pre-wrap">
              <LegacyMessageBody
                body={legacyBody}
                allowAutomaticSpacing={allowAutomaticSpacing}
              />
            </div>
          )}
        </div>

        {deliveryState === STORY_ROOM_MESSAGE_DELIVERY_STATES.FAILED ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
            Message failed to send. Copy and retry.
          </p>
        ) : deliveryState === STORY_ROOM_MESSAGE_DELIVERY_STATES.SENDING ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            Sending
          </p>
        ) : null}
      </article>

      {hasMessageActions ? (
        <div
          className={`mt-[var(--space-1)] flex items-center gap-[var(--space-1)] ${
            isPlayerMessage ? "justify-end" : "justify-start"
          }`}
        >
          {canCopy && typeof onCopy === "function" ? (
            <MessageActionButton onClick={onCopy} label={copyLabel}>
              {copyState === STORY_ROOM_MESSAGE_COPY_STATES.COPIED ? (
                <Check size={14} aria-hidden="true" />
              ) : copyState === STORY_ROOM_MESSAGE_COPY_STATES.FAILED ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
            </MessageActionButton>
          ) : null}

          {canRegenerate && typeof onRegenerate === "function" ? (
            <MessageActionButton
              onClick={onRegenerate}
              disabled={
                regenerateDisabled ||
                regeneratePending ||
                continuePending ||
                reportPending
              }
              label={
                regenerateDisabled
                  ? regenerateDisabledReason || "Regenerate response unavailable"
                  : regeneratePending
                    ? "Regenerating response"
                    : regenerateError
                      ? `Regenerate response. Last attempt failed: ${regenerateError}`
                      : "Regenerate response"
              }
              title={
                regenerateDisabled
                  ? regenerateDisabledReason || "Regenerate response unavailable"
                  : regeneratePending
                    ? "Regenerating response"
                    : regenerateError || "Regenerate response"
              }
            >
              {regeneratePending ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : regenerateError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <RotateCcw size={14} aria-hidden="true" />
              )}
            </MessageActionButton>
          ) : null}

          {canContinue && typeof onContinue === "function" ? (
            <MessageActionButton
              onClick={onContinue}
              disabled={
                continueDisabled ||
                continuePending ||
                regeneratePending ||
                reportPending
              }
              label={
                continueDisabled
                  ? continueDisabledReason || "Continue response unavailable"
                  : continuePending
                    ? "Continuing response"
                    : continueError
                      ? `Continue response. Last attempt failed: ${continueError}`
                      : "Continue response"
              }
              title={
                continueDisabled
                  ? continueDisabledReason || "Continue response unavailable"
                  : continuePending
                    ? "Continuing response"
                    : continueError || "Continue response"
              }
            >
              {continuePending ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : continueError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <StepForward size={14} aria-hidden="true" />
              )}
            </MessageActionButton>
          ) : null}

          {canReport && typeof onReport === "function" ? (
            <MessageActionButton
              onClick={onReport}
              disabled={
                reportPending ||
                regeneratePending ||
                continuePending ||
                reportSubmitted
              }
              label={
                reportPending
                  ? "Submitting report"
                  : reportSubmitted
                    ? "Message reported"
                    : reportError
                      ? `Report message. Last attempt failed: ${reportError}`
                      : "Report message"
              }
              title={
                reportPending
                  ? "Submitting report"
                  : reportSubmitted
                    ? "Reported"
                    : reportError || "Report message"
              }
            >
              {reportPending ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : reportSubmitted ? (
                <Check size={14} aria-hidden="true" />
              ) : reportError ? (
                <AlertCircle size={14} aria-hidden="true" />
              ) : (
                <Flag size={14} aria-hidden="true" />
              )}
            </MessageActionButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Quiet icon actions under a bubble: 32px on a fine pointer, the 44px
// floor on touch, the global focus ring.
function MessageActionButton({
  onClick,
  disabled = false,
  label,
  title = label,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
    >
      {children}
    </button>
  );
}

function ModePill({ children }) {
  return (
    <span className="rounded-[var(--radius-full)] bg-[var(--surface-3)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
      {children}
    </span>
  );
}
