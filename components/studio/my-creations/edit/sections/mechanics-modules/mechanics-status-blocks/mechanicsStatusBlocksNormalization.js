import {
  MECHANICS_STATUS_BLOCK_PLACEMENTS,
  MECHANICS_STATUS_BLOCK_VISIBILITIES,
} from "./MechanicsStatusBlocks.contract.js";

export function asMechanicsStatusBlockObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function normalizeMechanicsStatusBlockString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMechanicsStatusBlockBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeMechanicsStatusBlockString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

export function slugifyMechanicsStatusBlockId(value, fallback = "status_block") {
  const slug = normalizeMechanicsStatusBlockString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function normalizePlacement(value) {
  const requested = normalizeMechanicsStatusBlockString(value).toLowerCase();
  const aliases = {
    end: "response_end",
    footer: "response_end",
    responseend: "response_end",
    start: "response_start",
    header: "response_start",
    responsestart: "response_start",
  };
  const normalized = aliases[requested.replace(/[^a-z]/g, "")] || requested;
  return MECHANICS_STATUS_BLOCK_PLACEMENTS.includes(normalized)
    ? normalized
    : "response_end";
}

function normalizeVisibility(value) {
  const requested = normalizeMechanicsStatusBlockString(value).toLowerCase();
  return MECHANICS_STATUS_BLOCK_VISIBILITIES.includes(requested)
    ? requested
    : "public";
}

function getStatusBlockLines(source) {
  const direct = source.lines ?? source.renderedLines ?? source.rendered_lines;
  if (Array.isArray(direct)) return direct;
  const single =
    source.template ?? source.line ?? source.renderedLine ?? source.rendered_line;
  return single === undefined || single === null ? [] : [single];
}

export function normalizeMechanicsStatusBlock(block, fallbackIndex = 0) {
  const source = asMechanicsStatusBlockObject(block);
  const fallbackId = `status_block_${fallbackIndex + 1}`;
  const sourceId =
    source.id ?? source.key ?? source.blockId ?? source.block_id;
  const id =
    normalizeMechanicsStatusBlockString(sourceId) || fallbackId;

  return {
    ...source,
    id,
    slot:
      normalizeMechanicsStatusBlockString(
        source.slot ?? source.slotId ?? source.slot_id
      ) || "main_footer",
    label:
      normalizeMechanicsStatusBlockString(
        source.label ?? source.title ?? source.name
      ) ||
      normalizeMechanicsStatusBlockString(sourceId) ||
      `Status Block ${fallbackIndex + 1}`,
    placement: normalizePlacement(source.placement ?? source.position),
    required: normalizeMechanicsStatusBlockBoolean(
      source.required ?? source.isRequired ?? source.is_required,
      true
    ),
    visibility: normalizeVisibility(source.visibility ?? source.audience),
    lines: getStatusBlockLines(source)
      .map((line) => String(line ?? ""))
      .filter((line) => line.trim()),
  };
}

export function normalizeMechanicsStatusBlocks(value) {
  const source = Array.isArray(value)
    ? value
    : Array.isArray(value?.blocks)
      ? value.blocks
      : [];
  return source.map((block, index) =>
    normalizeMechanicsStatusBlock(block, index)
  );
}

export function summarizeMechanicsStatusBlock(block, fallbackIndex = 0) {
  const normalized = normalizeMechanicsStatusBlock(block, fallbackIndex);
  const lineCount = normalized.lines.length;
  return [
    normalized.placement,
    normalized.visibility,
    `${lineCount} ${lineCount === 1 ? "line" : "lines"}`,
  ].join(" · ");
}
