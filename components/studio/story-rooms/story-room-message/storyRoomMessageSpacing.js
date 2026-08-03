import { STORY_ROOM_MESSAGE_SEGMENT_TYPES } from "./StoryRoomMessage.contract.js";

const MESSAGE_PART_KINDS = Object.freeze({
  DIALOGUE: "DIALOGUE",
  NARRATION: "NARRATION",
  NEUTRAL: "NEUTRAL",
});

const LEGACY_EXPLICIT_PART_PATTERN =
  /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|“[^”\n]+”|"[^"\n]+")/g;

export function hasAuthoredMessageLineBreak(value) {
  return /[\r\n]/.test(String(value || ""));
}

function getSemanticPartKind(segment) {
  if (segment?.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.DIALOGUE) {
    return MESSAGE_PART_KINDS.DIALOGUE;
  }

  if (segment?.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES.NARRATION) {
    return MESSAGE_PART_KINDS.NARRATION;
  }

  return MESSAGE_PART_KINDS.NEUTRAL;
}

function groupAlternatingMessageParts(parts, getKind) {
  const paragraphs = [];
  let current = [];
  let meaningfulKinds = new Set();

  parts.forEach((part) => {
    const kind = getKind(part);

    if (
      kind !== MESSAGE_PART_KINDS.NEUTRAL &&
      meaningfulKinds.size === 2
    ) {
      paragraphs.push(current);
      current = [];
      meaningfulKinds = new Set();
    }

    current.push(part);

    if (kind !== MESSAGE_PART_KINDS.NEUTRAL) {
      meaningfulKinds.add(kind);
    }
  });

  if (current.length) {
    paragraphs.push(current);
  }

  return paragraphs;
}

export function buildSemanticMessageParagraphs(segments = []) {
  const safeSegments = Array.isArray(segments) ? segments : [];

  if (!safeSegments.length) {
    return [];
  }

  const combinedText = safeSegments
    .map((segment) => String(segment?.text || ""))
    .join("");

  if (hasAuthoredMessageLineBreak(combinedText)) {
    return [safeSegments];
  }

  const meaningfulKinds = new Set(
    safeSegments
      .map(getSemanticPartKind)
      .filter((kind) => kind !== MESSAGE_PART_KINDS.NEUTRAL)
  );

  if (meaningfulKinds.size < 2) {
    return [safeSegments];
  }

  return groupAlternatingMessageParts(safeSegments, getSemanticPartKind);
}

function getLegacyPartKind(text) {
  const value = String(text || "");

  if (value.startsWith('"') || value.startsWith("“")) {
    return MESSAGE_PART_KINDS.DIALOGUE;
  }

  return MESSAGE_PART_KINDS.NARRATION;
}

function mergeLegacyPart(parts, text, kind) {
  if (!text) return;

  const previous = parts[parts.length - 1];

  if (previous?.kind === kind) {
    previous.text += text;
    return;
  }

  parts.push({ kind, text });
}

function tokenizeLegacyMessageParts(body) {
  const text = String(body || "");
  const parts = [];
  let lastIndex = 0;
  let match;

  LEGACY_EXPLICIT_PART_PATTERN.lastIndex = 0;

  while ((match = LEGACY_EXPLICIT_PART_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      mergeLegacyPart(
        parts,
        text.slice(lastIndex, match.index),
        MESSAGE_PART_KINDS.NARRATION
      );
    }

    const explicitText = match[0];
    mergeLegacyPart(parts, explicitText, getLegacyPartKind(explicitText));
    lastIndex = LEGACY_EXPLICIT_PART_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    mergeLegacyPart(
      parts,
      text.slice(lastIndex),
      MESSAGE_PART_KINDS.NARRATION
    );
  }

  return parts;
}

export function buildLegacyMessageParagraphs(body = "") {
  const text = String(body || "");

  if (hasAuthoredMessageLineBreak(text)) {
    return text.split(/\n{2,}/);
  }

  const parts = tokenizeLegacyMessageParts(text);
  const meaningfulKinds = new Set(parts.map((part) => part.kind));

  if (meaningfulKinds.size < 2) {
    return [text];
  }

  const groupedParts = groupAlternatingMessageParts(
    parts,
    (part) => part.kind
  );
  const paragraphs = groupedParts.map((paragraph) =>
    paragraph.map((part) => part.text).join("")
  );

  return paragraphs.length > 1 ? paragraphs : [text];
}
