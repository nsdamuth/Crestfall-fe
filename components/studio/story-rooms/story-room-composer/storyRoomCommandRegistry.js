export const STORY_ROOM_COMMANDS = Object.freeze([
  Object.freeze({
    name: "help",
    aliases: Object.freeze(["?"]),
    description: "Show the quick-start chat controls and shortcuts.",
    usage: "/help",
    handling: "LOCAL_UI",
    panel: "HELP",
  }),
  Object.freeze({
    name: "commands",
    aliases: Object.freeze([]),
    description: "Show every command currently available in this Story Room.",
    usage: "/commands",
    handling: "LOCAL_UI",
    panel: "COMMANDS",
  }),
]);

function normalizeCommandToken(value) {
  return String(value || "").trim().toLowerCase();
}

export function getStoryRoomCommandSearchTerms(command) {
  return [command?.name, ...(command?.aliases || [])]
    .map(normalizeCommandToken)
    .filter(Boolean);
}

export function getStoryRoomCommandSuggestions(commandToken = "") {
  const normalizedToken = normalizeCommandToken(commandToken);

  return STORY_ROOM_COMMANDS.filter((command) => {
    if (!normalizedToken) return true;

    return getStoryRoomCommandSearchTerms(command).some((term) =>
      term.startsWith(normalizedToken)
    );
  }).sort((left, right) => {
    const leftTerms = getStoryRoomCommandSearchTerms(left);
    const rightTerms = getStoryRoomCommandSearchTerms(right);
    const leftExact = leftTerms.includes(normalizedToken) ? 1 : 0;
    const rightExact = rightTerms.includes(normalizedToken) ? 1 : 0;

    if (leftExact !== rightExact) return rightExact - leftExact;

    return left.name.localeCompare(right.name);
  });
}

export function findStoryRoomCommand(commandToken) {
  const normalizedToken = normalizeCommandToken(commandToken);

  if (!normalizedToken) return null;

  return (
    STORY_ROOM_COMMANDS.find((command) =>
      getStoryRoomCommandSearchTerms(command).includes(normalizedToken)
    ) || null
  );
}

export function resolveLocalStoryRoomCommand(draft) {
  const match = /^\/([^\s]+)\s*$/u.exec(String(draft || "").trim());

  if (!match) return null;

  const command = findStoryRoomCommand(match[1]);

  return command?.handling === "LOCAL_UI" ? command : null;
}
