// Ported from the crestfall-main chat baseline (research section C):
// "/" commands help, summary/recap, commands, same handling and
// aliases. Pure data plus lookup helpers, no styling dependency.
export const CHAT_COMPOSER_COMMANDS = Object.freeze([
  Object.freeze({
    name: "help",
    aliases: Object.freeze(["?"]),
    description: "Show the quick-start chat controls and shortcuts.",
    usage: "/help",
    handling: "LOCAL_UI",
    panel: "HELP",
  }),
  Object.freeze({
    name: "summary",
    aliases: Object.freeze(["recap"]),
    description: "Summarize the current story beat or scene without advancing the story.",
    usage: "/summary",
    handling: "REMOTE_UI",
    action: "SUMMARIZE_CURRENT_BOUNDARY",
  }),
  Object.freeze({
    name: "commands",
    aliases: Object.freeze([]),
    description: "Show every command currently available in this chat.",
    usage: "/commands",
    handling: "LOCAL_UI",
    panel: "COMMANDS",
  }),
  Object.freeze({
    name: "format",
    aliases: Object.freeze([]),
    description: "Show Story Chat text-formatting and semantic-channel help.",
    usage: "/format",
    handling: "LOCAL_UI",
    panel: "FORMAT",
  }),
]);

function normalizeCommandToken(value) {
  return String(value || "").trim().toLowerCase();
}

export function getChatComposerCommandSearchTerms(command) {
  return [command?.name, ...(command?.aliases || [])]
    .map(normalizeCommandToken)
    .filter(Boolean);
}

export function getChatComposerCommandSuggestions(commandToken = "") {
  const normalizedToken = normalizeCommandToken(commandToken);

  return CHAT_COMPOSER_COMMANDS.filter((command) => {
    if (!normalizedToken) return true;

    return getChatComposerCommandSearchTerms(command).some((term) =>
      term.startsWith(normalizedToken)
    );
  }).sort((left, right) => {
    const leftTerms = getChatComposerCommandSearchTerms(left);
    const rightTerms = getChatComposerCommandSearchTerms(right);
    const leftExact = leftTerms.includes(normalizedToken) ? 1 : 0;
    const rightExact = rightTerms.includes(normalizedToken) ? 1 : 0;

    if (leftExact !== rightExact) return rightExact - leftExact;

    return left.name.localeCompare(right.name);
  });
}

export function findChatComposerCommand(commandToken) {
  const normalizedToken = normalizeCommandToken(commandToken);

  if (!normalizedToken) return null;

  return (
    CHAT_COMPOSER_COMMANDS.find((command) =>
      getChatComposerCommandSearchTerms(command).includes(normalizedToken)
    ) || null
  );
}

/**
 * Resolve a complete composer draft that begins with a slash command.
 *
 * Autocomplete works on partial tokens, while send-time routing must resolve
 * the complete draft deterministically. Keep those concerns separate so a
 * local command can never fall through to the Story runtime because of
 * suggestion-menu state.
 */
export function resolveChatComposerCommandInput(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("/")) return null;

  const commandBody = raw.slice(1).trim();
  if (!commandBody) return null;

  const firstWhitespace = commandBody.search(/\s/);
  const token = firstWhitespace < 0
    ? commandBody
    : commandBody.slice(0, firstWhitespace);
  const args = firstWhitespace < 0
    ? ""
    : commandBody.slice(firstWhitespace).trim();
  const command = findChatComposerCommand(token);

  return command
    ? Object.freeze({
        command,
        token: normalizeCommandToken(token),
        args,
        raw,
      })
    : null;
}
