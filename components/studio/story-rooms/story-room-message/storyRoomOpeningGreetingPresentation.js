/**
 * Display-only fallback for persisted Character opening greetings that predate
 * chat.responsePresentation.v1 metadata.
 *
 * Character greetings conventionally mix unquoted narration/action with
 * explicitly quoted dialogue. Preserve the authored text byte-for-byte while
 * projecting only those two presentation roles so the existing semantic
 * renderer can restore the same narration/dialogue treatment used by live
 * response presentation metadata.
 *
 * Markdown/block-quote authored greetings stay on the legacy renderer because
 * that renderer owns those markup conventions. Backend presentation metadata,
 * when present, always remains authoritative and bypasses this fallback.
 */

const COMPLETE_QUOTED_DIALOGUE_PATTERN = /"[^"\n]+"|“[^”\n]+”/g;

function pushSegment(segments, type, text) {
  if (!text) return;
  segments.push({
    type,
    emphasis: "",
    text,
  });
}

export function buildCharacterOpeningGreetingPresentation(body = "") {
  const text = String(body || "");

  if (!text || text.includes("*") || /^\s*>/m.test(text)) {
    return [];
  }

  const segments = [];
  let lastIndex = 0;
  let match;

  COMPLETE_QUOTED_DIALOGUE_PATTERN.lastIndex = 0;

  while ((match = COMPLETE_QUOTED_DIALOGUE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushSegment(segments, "NARRATION", text.slice(lastIndex, match.index));
    }

    pushSegment(segments, "DIALOGUE", match[0]);
    lastIndex = COMPLETE_QUOTED_DIALOGUE_PATTERN.lastIndex;
  }

  if (!segments.length) {
    return [
      {
        type: "NARRATION",
        emphasis: "",
        text,
      },
    ];
  }

  if (lastIndex < text.length) {
    pushSegment(segments, "NARRATION", text.slice(lastIndex));
  }

  return segments;
}
