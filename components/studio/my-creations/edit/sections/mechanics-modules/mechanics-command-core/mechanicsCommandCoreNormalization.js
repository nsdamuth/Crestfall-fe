import {
  COMMAND_ARGUMENT_TYPES,
  COMMAND_PRESENTATION_MODES,
  COMMAND_RESULT_VISIBILITIES,
  IMPLICIT_COMMAND_ARGUMENT_TYPES,
  MECHANICS_COMMAND_INVOCATION_VERSION,
} from "./MechanicsCommandCore.contract.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeCommandStringList(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(normalizeString).filter(Boolean))];
}

export function slugifyCommandId(value, fallback = "command") {
  const slug = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || fallback;
}

export function uniqueCommandId(prefix, existingItems = []) {
  const existingIds = new Set(
    asArray(existingItems)
      .map((item) => normalizeString(item?.id))
      .filter(Boolean)
  );

  let index = 1;
  let candidate = `${prefix}_${index}`;

  while (existingIds.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }

  return candidate;
}

export function normalizeCommandName(value) {
  return normalizeString(value)
    .replace(/^[/#!]+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCommandPrefix(value) {
  const prefix = normalizeString(value);

  if (!prefix || prefix.length > 3 || /\s|[a-z0-9]/i.test(prefix)) {
    return "";
  }

  return prefix;
}

export function isImplicitTargetArgumentType(value) {
  return IMPLICIT_COMMAND_ARGUMENT_TYPES.includes(
    normalizeString(value).toUpperCase()
  );
}

export function normalizeCommandArgument(argument, fallbackIndex = 0) {
  const source = asObject(argument);
  const requestedType = normalizeString(source.type).toUpperCase();
  const type = COMMAND_ARGUMENT_TYPES.includes(requestedType)
    ? requestedType
    : "TEXT";

  return {
    ...source,
    name: slugifyCommandId(
      source.name || source.id,
      `argument_${fallbackIndex + 1}`
    ),
    label:
      normalizeString(source.label || source.title) ||
      normalizeString(source.name || source.id) ||
      `Argument ${fallbackIndex + 1}`,
    type,
    required: isImplicitTargetArgumentType(type)
      ? false
      : normalizeBoolean(source.required, true),
    consumeRemaining: isImplicitTargetArgumentType(type)
      ? false
      : normalizeBoolean(
          source.consumeRemaining ?? source.consume_remaining,
          type === "TEXT"
        ),
    allowQuoted: isImplicitTargetArgumentType(type)
      ? false
      : normalizeBoolean(source.allowQuoted ?? source.allow_quoted, true),
    options: normalizeCommandStringList(source.options),
    min:
      source.min === "" || source.min === null || source.min === undefined
        ? null
        : normalizeNumber(source.min, 0),
    max:
      source.max === "" || source.max === null || source.max === undefined
        ? null
        : normalizeNumber(source.max, 0),
    description: normalizeString(source.description || source.summary),
  };
}

export function getLastPositionalArgumentIndex(argumentsList = []) {
  return asArray(argumentsList).reduce(
    (lastIndex, argument, index) =>
      isImplicitTargetArgumentType(argument?.type) ? lastIndex : index,
    -1
  );
}

export function normalizeCommandArguments(value = []) {
  const argumentsList = asArray(value).map(normalizeCommandArgument);
  const lastPositionalArgumentIndex =
    getLastPositionalArgumentIndex(argumentsList);

  return argumentsList.map((argument, index) => ({
    ...argument,
    consumeRemaining:
      !isImplicitTargetArgumentType(argument.type) &&
      index === lastPositionalArgumentIndex &&
      argument.consumeRemaining === true,
  }));
}

export function normalizeCommandInvocation(value, fallbackCommand = "") {
  const source = asObject(value);
  const command = normalizeCommandName(source.command || fallbackCommand);
  const prefixes = normalizeCommandStringList(source.prefixes)
    .map(normalizeCommandPrefix)
    .filter(Boolean);

  return {
    ...source,
    version:
      normalizeString(source.version) || MECHANICS_COMMAND_INVOCATION_VERSION,
    enabled: normalizeBoolean(source.enabled, true),
    command,
    prefixes: command ? (prefixes.length ? prefixes : ["/"]) : prefixes,
    aliases: normalizeCommandStringList(source.aliases)
      .map(normalizeCommandName)
      .filter((alias) => alias && alias !== command),
    arguments: normalizeCommandArguments(source.arguments),
    caseSensitive: false,
  };
}

export function normalizeCommandPresentation(value, normalizeStateReadout) {
  const source = asObject(value);
  const stateReadoutSource = asObject(
    source.stateReadout || source.state_readout
  );
  const requestedMode = normalizeString(source.mode).toUpperCase();
  const mode = COMMAND_PRESENTATION_MODES.includes(requestedMode)
    ? requestedMode
    : "MECHANICS_ACTION";
  const requestedVisibility = normalizeString(
    source.resultVisibility || source.result_visibility
  ).toUpperCase();

  return {
    ...source,
    mode,
    continueNarrative: normalizeBoolean(
      source.continueNarrative ?? source.continue_narrative,
      mode === "MECHANICS_ACTION"
    ),
    advanceTime: normalizeBoolean(
      source.advanceTime ?? source.advance_time,
      mode === "MECHANICS_ACTION"
    ),
    resultVisibility: COMMAND_RESULT_VISIBILITIES.includes(requestedVisibility)
      ? requestedVisibility
      : "FULL",
    ...(Object.keys(stateReadoutSource).length &&
    typeof normalizeStateReadout === "function"
      ? { stateReadout: normalizeStateReadout(stateReadoutSource) }
      : Object.keys(stateReadoutSource).length
        ? { stateReadout: stateReadoutSource }
        : {}),
  };
}

export function normalizeCommandTriggers(value) {
  return asArray(value).map(String).filter(Boolean);
}
