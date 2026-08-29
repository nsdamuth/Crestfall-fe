export const PLAYER_MESSAGE_SEMANTICS_VERSION = "player_input_semantics_v3";

export const PLAYER_MESSAGE_SEGMENT_TYPES = Object.freeze({
  DIALOGUE: "DIALOGUE",
  ACTION: "ACTION",
  THOUGHT: "THOUGHT",
  MESSAGE: "MESSAGE",
  TELEPATHY: "TELEPATHY",
  REFERENCE: "REFERENCE",
});

export const PLAYER_MESSAGE_CONVENTIONS = Object.freeze({
  PLAIN_DIALOGUE: "PLAIN_DIALOGUE",
  QUOTED_DIALOGUE: "QUOTED_DIALOGUE",
  ASTERISK_ACTION: "ASTERISK_ACTION",
  EXPLICIT_MIXED: "EXPLICIT_MIXED",
  ACTION_MODE: "ACTION_MODE",
  THOUGHT_MODE: "THOUGHT_MODE",
  MESSAGE_MODE: "MESSAGE_MODE",
  TELEPATHY_MODE: "TELEPATHY_MODE",
});

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function hasQuotedDialogueMarker(value) {
  const text = String(value || "");
  let straightOpen = false;
  let curlyOpen = false;

  for (const char of text) {
    if (char === '"') {
      straightOpen = !straightOpen;
      if (!straightOpen) return true;
    }
    if (char === "“") {
      curlyOpen = true;
      continue;
    }
    if (char === "”" && curlyOpen) return true;
  }
  return false;
}

function hasAsteriskMarker(value) {
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "*") continue;
    if (text[index - 1] === "*" || text[index + 1] === "*") continue;
    const end = text.indexOf("*", index + 1);
    if (end > index + 1 && text[end + 1] !== "*") return true;
  }
  return false;
}

function hasMeaningfulUnwrappedText(value) {
  return Boolean(
    String(value || "")
      .replace(/“[^”]*”/g, " ")
      .replace(/"[^"]*"/g, " ")
      .replace(/\*[^*]+\*/g, " ")
      .replace(/\(\([^)]*\)\)/g, " ")
      .replace(/`[^`]+`/g, " ")
      .replace(/^>.*$/gm, " ")
      .trim()
  );
}

function inferConvention(value, inputMode) {
  const mode = normalizeUpper(inputMode) || "DIALOGUE";
  if (mode === "ACTION") return PLAYER_MESSAGE_CONVENTIONS.ACTION_MODE;
  if (mode === "THOUGHT") return PLAYER_MESSAGE_CONVENTIONS.THOUGHT_MODE;
  if (mode === "MESSAGE") return PLAYER_MESSAGE_CONVENTIONS.MESSAGE_MODE;
  if (mode === "TELEPATHY") return PLAYER_MESSAGE_CONVENTIONS.TELEPATHY_MODE;
  const hasQuotes = hasQuotedDialogueMarker(value);
  const hasAsterisks = hasAsteriskMarker(value);
  if (hasQuotes && hasAsterisks) {
    if (hasMeaningfulUnwrappedText(value)) {
      return PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE;
    }

    const text = String(value || "");
    const straightQuoteIndex = text.indexOf('"');
    const curlyQuoteIndex = text.indexOf("“");
    const quoteIndexes = [straightQuoteIndex, curlyQuoteIndex].filter((index) => index >= 0);
    const firstQuoteIndex = quoteIndexes.length ? Math.min(...quoteIndexes) : Number.POSITIVE_INFINITY;
    const firstAsteriskIndex = text.search(/(?<!\*)\*(?!\*)/);

    return firstAsteriskIndex >= 0 && firstAsteriskIndex < firstQuoteIndex
      ? PLAYER_MESSAGE_CONVENTIONS.ASTERISK_ACTION
      : PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE;
  }
  if (hasQuotes) return PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE;
  if (hasAsterisks) return PLAYER_MESSAGE_CONVENTIONS.ASTERISK_ACTION;
  return PLAYER_MESSAGE_CONVENTIONS.PLAIN_DIALOGUE;
}

function getDefaultType(convention, inputMode) {
  const mode = normalizeUpper(inputMode) || "DIALOGUE";
  if (mode === "THOUGHT") return PLAYER_MESSAGE_SEGMENT_TYPES.THOUGHT;
  if (mode === "ACTION") return PLAYER_MESSAGE_SEGMENT_TYPES.ACTION;
  if (mode === "MESSAGE") return PLAYER_MESSAGE_SEGMENT_TYPES.MESSAGE;
  if (mode === "TELEPATHY") return PLAYER_MESSAGE_SEGMENT_TYPES.TELEPATHY;
  if (convention === PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE) {
    return PLAYER_MESSAGE_SEGMENT_TYPES.ACTION;
  }
  return PLAYER_MESSAGE_SEGMENT_TYPES.DIALOGUE;
}

function visibilityFor(type) {
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.THOUGHT) return "PLAYER_PRIVATE";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.TELEPATHY) return "TARGETED_COMMUNICATION";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.REFERENCE) return "REFERENCE_ONLY";
  return "SCENE_VISIBLE";
}

function appendSegment(target, { type, text, displayText = null, source = "INFERRED" }) {
  const normalizedText = normalizeString(text);
  if (!normalizedText) return;
  target.push({
    type,
    text: normalizedText,
    displayText: normalizeString(displayText) || normalizedText,
    source,
    visibility: visibilityFor(type),
  });
}

function findClosingQuote(line, startIndex, opener) {
  return line.indexOf(opener === "“" ? "”" : '"', startIndex + 1);
}

function parseLine(line, segments, defaultType, convention) {
  let index = 0;
  let buffer = "";

  function flush() {
    appendSegment(segments, {
      type: defaultType,
      text: buffer,
      source: "INFERRED_UNWRAPPED",
    });
    buffer = "";
  }

  while (index < line.length) {
    if (line.startsWith("((", index)) {
      const end = line.indexOf("))", index + 2);
      if (end >= 0) {
        flush();
        appendSegment(segments, {
          type: PLAYER_MESSAGE_SEGMENT_TYPES.THOUGHT,
          text: line.slice(index + 2, end),
          source: "LEGACY_DOUBLE_PARENTHESIS",
        });
        index = end + 2;
        continue;
      }
    }

    if (line.startsWith("**", index)) {
      const end = line.indexOf("**", index + 2);
      if (end >= 0) {
        buffer += line.slice(index + 2, end);
        index = end + 2;
        continue;
      }
    }

    if (line[index] === "*" && line[index + 1] !== "*") {
      const end = line.indexOf("*", index + 1);
      if (end >= 0) {
        flush();
        appendSegment(segments, {
          type:
            convention === PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE
              ? PLAYER_MESSAGE_SEGMENT_TYPES.THOUGHT
              : PLAYER_MESSAGE_SEGMENT_TYPES.ACTION,
          text: line.slice(index + 1, end),
          source:
            convention === PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE
              ? "EXPLICIT_ITALIC_THOUGHT"
              : "EXPLICIT_ASTERISK_ACTION",
        });
        index = end + 1;
        continue;
      }
    }

    if (line[index] === "`") {
      const end = line.indexOf("`", index + 1);
      if (end > index + 1) {
        flush();
        appendSegment(segments, {
          type: PLAYER_MESSAGE_SEGMENT_TYPES.TELEPATHY,
          text: line.slice(index + 1, end),
          source: "EXPLICIT_BACKTICK_TELEPATHY",
        });
        index = end + 1;
        continue;
      }
    }

    if (line[index] === '"' || line[index] === "“") {
      const end = findClosingQuote(line, index, line[index]);
      if (end >= 0) {
        const opener = line[index];
        const closer = opener === "“" ? "”" : '"';
        flush();
        appendSegment(segments, {
          type: PLAYER_MESSAGE_SEGMENT_TYPES.DIALOGUE,
          text: line.slice(index + 1, end),
          displayText: `${opener}${line.slice(index + 1, end)}${closer}`,
          source: "EXPLICIT_QUOTE",
        });
        index = end + 1;
        continue;
      }
    }

    buffer += line[index];
    index += 1;
  }

  flush();
}

export function parsePlayerMessageSemantics(value, { inputMode = "DIALOGUE" } = {}) {
  const text = normalizeString(value).replace(/\r\n/g, "\n");
  const convention = inferConvention(text, inputMode);
  const segments = [];
  const defaultType = getDefaultType(convention, inputMode);

  if (!text) {
    return { version: PLAYER_MESSAGE_SEMANTICS_VERSION, convention, semanticSegments: [] };
  }

  text.split("\n").forEach((line) => {
    const trimmedStart = line.trimStart();
    if (trimmedStart.startsWith(">")) {
      const messageText = trimmedStart.replace(/^>\s?/, "");
      appendSegment(segments, {
        type: PLAYER_MESSAGE_SEGMENT_TYPES.MESSAGE,
        text: messageText,
        displayText: `> ${messageText}`,
        source: "EXPLICIT_MESSAGE_BLOCKQUOTE",
      });
      return;
    }
    parseLine(line, segments, defaultType, convention);
  });

  return { version: PLAYER_MESSAGE_SEMANTICS_VERSION, convention, semanticSegments: segments };
}

function normalizePersistedSegments(metadata = {}) {
  const semantics = metadata?.playerInputSemantics;
  const source = Array.isArray(semantics?.semanticSegments)
    ? semantics.semanticSegments
    : [];

  return source
    .map((segment) => ({
      type: String(segment?.type || "").trim(),
      text: String(segment?.text || "").trim(),
      displayText: String(segment?.displayText || segment?.text || "").trim(),
      source: String(segment?.source || "").trim(),
      visibility: String(segment?.visibility || "").trim(),
    }))
    .filter((segment) => segment.type && segment.text);
}

function mapPresentationType(type) {
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.ACTION) return "NARRATION";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.THOUGHT) return "THOUGHT";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.MESSAGE) return "MESSAGE";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.TELEPATHY) return "TELEPATHY";
  if (type === PLAYER_MESSAGE_SEGMENT_TYPES.DIALOGUE) return "DIALOGUE";
  return "TEXT";
}

export function buildPlayerChatMessagePresentation({
  text = "",
  inputMode = "DIALOGUE",
  metadata = null,
} = {}) {
  const persistedSegments = normalizePersistedSegments(metadata || {});
  const parsed = persistedSegments.length
    ? {
        version: metadata?.playerInputSemantics?.version || PLAYER_MESSAGE_SEMANTICS_VERSION,
        convention: metadata?.playerInputSemantics?.convention || null,
        semanticSegments: persistedSegments,
      }
    : parsePlayerMessageSemantics(text, { inputMode });

  return {
    bodyMode: parsed.semanticSegments.length ? "SEMANTIC" : "LEGACY",
    legacyBody: String(text || ""),
    semanticSegments: parsed.semanticSegments.map((segment) => ({
      type: mapPresentationType(segment.type),
      emphasis: "",
      text: segment.displayText || segment.text,
      visibility: segment.visibility || "SCENE_VISIBLE",
    })),
    semanticsVersion: parsed.version,
    convention: parsed.convention,
  };
}
