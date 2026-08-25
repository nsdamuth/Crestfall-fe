// Pure draft-text parsing, ported from the crestfall-main chat
// baseline (research section C): precedence is "/" command first,
// then "#" location, then "@" mention, each mutually exclusive per
// keystroke. No styling or API dependency.

export function normalizeChatComposerSearch(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getMentionSearchTerms(option) {
  const normalizedLabel = normalizeChatComposerSearch(option?.label);

  return [normalizedLabel, ...normalizedLabel.split(" ")].filter(Boolean);
}

export function findActiveMentionQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /(?:^|[\s([{])@([\p{L}\p{N}'’_-]*)$/u.exec(beforeCursor);

  if (!match) return null;

  const start = beforeCursor.lastIndexOf("@");

  return {
    start,
    end: cursorPosition,
    query: normalizeChatComposerSearch(match[1].replace(/_/g, " ")),
  };
}

export function findActiveCommandQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /^\/([^\s/]*)$/u.exec(beforeCursor);

  if (!match) return null;

  return {
    start: 0,
    end: cursorPosition,
    query: String(match[1] || "").trim().toLowerCase(),
  };
}

export function findActiveLocationQuery(value, cursorPosition) {
  const beforeCursor = String(value || "").slice(0, cursorPosition);
  const match = /(?:^|[\s([{])#([\p{L}\p{N}'’ _-]*)$/u.exec(beforeCursor);

  if (!match) return null;

  return {
    start: beforeCursor.lastIndexOf("#"),
    end: cursorPosition,
    query: normalizeChatComposerSearch(match[1].replace(/_/g, " ")),
  };
}

export function updateChatComposerSuggestionQueries(value, cursorPosition) {
  const normalizedCursor = Number(cursorPosition) || 0;
  const commandQuery = findActiveCommandQuery(value, normalizedCursor);
  const locationQuery = commandQuery
    ? null
    : findActiveLocationQuery(value, normalizedCursor);
  const mentionQuery =
    commandQuery || locationQuery
      ? null
      : findActiveMentionQuery(value, normalizedCursor);

  return { commandQuery, locationQuery, mentionQuery };
}
