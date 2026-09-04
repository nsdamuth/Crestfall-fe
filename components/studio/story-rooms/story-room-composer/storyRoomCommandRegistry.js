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
  Object.freeze({
    name: "format",
    aliases: Object.freeze([]),
    description: "Show Crestfall Story text-formatting and message-semantics help.",
    usage: "/format",
    handling: "LOCAL_UI",
    panel: "FORMAT",
  }),
  Object.freeze({
    name: "inventory",
    aliases: Object.freeze([]),
    description:
      "Show the current Player Character inventory without advancing the Story.",
    usage: "/inventory",
    handling: "SERVER_COMMAND",
  }),
  Object.freeze({
    name: "save",
    aliases: Object.freeze([]),
    description:
      "Save a scene-generated person or location as a private Vault draft.",
    usage: "/save person @Name · /save location #Name",
    handling: "SERVER_COMMAND",
    requiresArguments: true,
  }),
  Object.freeze({
    name: "like",
    aliases: Object.freeze([]),
    description: "Like a first-class Character or Location Creation in this Story.",
    usage: "/like @Character · /like #Location",
    handling: "SERVER_COMMAND",
    requiresArguments: true,
  }),
  Object.freeze({
    name: "mark",
    aliases: Object.freeze([]),
    description: "Bookmark a first-class Character or Location Creation in this Story.",
    usage: "/mark @Character · /mark #Location",
    handling: "SERVER_COMMAND",
    requiresArguments: true,
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

export function getStoryRoomCommandSuggestions(
  commandToken = "",
  commands = STORY_ROOM_COMMANDS
) {
  const normalizedToken = normalizeCommandToken(commandToken);
  const sourceCommands =
    Array.isArray(commands) && commands.length ? commands : STORY_ROOM_COMMANDS;

  return sourceCommands.filter((command) => {
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

function normalizeMechanicsCatalogCommand(entry = {}) {
  const name = normalizeCommandToken(entry?.command);
  if (!name) return null;

  const aliases = [
    ...new Set(
      (Array.isArray(entry?.aliases) ? entry.aliases : [])
        .map(normalizeCommandToken)
        .filter((alias) => alias && alias !== name)
    ),
  ];
  const argumentsList = Array.isArray(entry?.arguments) ? entry.arguments : [];
  const sourceLabel = String(
    entry?.source?.scopeLabel || entry?.source?.ownerTitle || "Mechanics"
  ).trim();

  return {
    name,
    aliases: Object.freeze(aliases),
    description:
      String(entry?.description || "").trim() ||
      "Creator-authored Mechanics command.",
    usage: String(entry?.usage || `/${name}`).trim() || `/${name}`,
    handling: "MECHANICS",
    sourceLabel,
    ambiguous: entry?.ambiguous === true,
    collisionSurfaces: Array.isArray(entry?.collisionSurfaces)
      ? entry.collisionSurfaces.filter(Boolean)
      : [],
    requiresArguments: argumentsList.some(
      (argument) => argument?.required !== false
    ),
  };
}

export function mergeStoryRoomCommandsWithMechanicsCatalog(
  catalog = {},
  baseCommands = STORY_ROOM_COMMANDS
) {
  const merged = (
    Array.isArray(baseCommands) ? baseCommands : STORY_ROOM_COMMANDS
  ).map((command) => ({ ...command }));
  const occupiedNames = new Set(
    merged.flatMap((command) => getStoryRoomCommandSearchTerms(command))
  );
  const entries = Array.isArray(catalog?.entries) ? catalog.entries : [];

  for (const entry of entries) {
    const command = normalizeMechanicsCatalogCommand(entry);
    if (!command || occupiedNames.has(command.name)) continue;

    const projected = {
      ...command,
      aliases: Object.freeze(
        command.aliases.filter((alias) => !occupiedNames.has(alias))
      ),
    };

    merged.push(projected);
    getStoryRoomCommandSearchTerms(projected).forEach((term) =>
      occupiedNames.add(term)
    );
  }

  return merged;
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
