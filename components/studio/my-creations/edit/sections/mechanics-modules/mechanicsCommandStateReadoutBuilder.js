export const MECHANICS_COMMAND_STATE_READOUT_VERSION =
  "mechanics_command_state_readout_v1";

export const MECHANICS_COMMAND_STATE_READOUT_BUCKETS = Object.freeze([
  "METER",
  "FLAG",
  "COUNTER",
  "STAGE",
]);

export const MECHANICS_COMMAND_STATE_READOUT_FORMATS = Object.freeze([
  "AUTO",
  "NUMBER",
  "SIGNED_NUMBER",
  "BOOLEAN",
  "TEXT",
]);

export const MECHANICS_COMMAND_STATE_READOUT_MAX_FIELDS = 24;

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = normalizeString(value).toLowerCase();

  if (["true", "yes", "1", "enabled", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "0", "disabled", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeIdentifier(value, fallback = "") {
  const normalized = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function normalizeField(value = {}, index = 0) {
  const source = asObject(value);
  const requestedBucket = normalizeString(
    source.bucket || source.stateType || source.state_type
  ).toUpperCase();
  const bucket = MECHANICS_COMMAND_STATE_READOUT_BUCKETS.includes(
    requestedBucket
  )
    ? requestedBucket
    : "COUNTER";
  const requestedFormat = normalizeString(
    source.format || source.displayFormat || source.display_format
  ).toUpperCase();
  const format = MECHANICS_COMMAND_STATE_READOUT_FORMATS.includes(
    requestedFormat
  )
    ? requestedFormat
    : bucket === "FLAG"
      ? "BOOLEAN"
      : "AUTO";
  const targetId = normalizeIdentifier(
    source.targetId ||
      source.target_id ||
      source.mechanicsId ||
      source.mechanics_id ||
      source.stateId ||
      source.state_id ||
      source.id
  );

  return {
    id: normalizeIdentifier(source.id || source.key, `readout_${index + 1}`),
    label:
      normalizeString(source.label || source.title || source.name) ||
      targetId ||
      `Value ${index + 1}`,
    bucket,
    targetId,
    format,
    prefix: normalizeString(source.prefix),
    suffix: normalizeString(source.suffix),
    fallbackValue:
      source.fallbackValue ??
      source.fallback_value ??
      source.defaultValue ??
      source.default_value ??
      null,
    missingLabel:
      normalizeString(source.missingLabel || source.missing_label) ||
      "Not set",
    enabled: normalizeBoolean(source.enabled, true),
  };
}

export function normalizeMechanicsCommandStateReadoutBuilder(value = {}) {
  const source = asObject(value);
  const fields = asArray(source.fields || source.values || source.entries)
    .map(normalizeField)
    .filter((field) => field.targetId)
    .slice(0, MECHANICS_COMMAND_STATE_READOUT_MAX_FIELDS);

  return {
    version:
      normalizeString(source.version) ||
      MECHANICS_COMMAND_STATE_READOUT_VERSION,
    enabled: normalizeBoolean(source.enabled, fields.length > 0),
    title:
      normalizeString(source.title || source.label || source.heading) ||
      "Mechanics State",
    fields,
  };
}

export function createMechanicsCommandStateReadoutField(index = 0) {
  return normalizeField(
    {
      id: `readout_${index + 1}`,
      label: `Value ${index + 1}`,
      bucket: "COUNTER",
      targetId: "counter_id",
      format: "AUTO",
      fallbackValue: 0,
      enabled: true,
    },
    index
  );
}
