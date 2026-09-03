export const CHARACTER_DECISION_PRIORITY_OPTIONS = Object.freeze([
  Object.freeze({
    value: "LOGOS",
    label: "LOGOS — Reason & Evidence",
    description:
      "Prefer known evidence, causal reasoning, observed facts, and valid inference already available to the Character.",
  }),
  Object.freeze({
    value: "PATHOS",
    label: "PATHOS — Emotion & Attachment",
    description:
      "Prefer established emotions, attachments, aversions, desires, loyalties, and relationship stakes.",
  }),
  Object.freeze({
    value: "ETHOS",
    label: "ETHOS — Values & Identity",
    description:
      "Prefer established values, identity, principles, self-conception, duties, and moral commitments.",
  }),
]);

export const NARRATOR_PRESENTATION_PRIORITY_OPTIONS = Object.freeze([
  Object.freeze({
    value: "KAIROS",
    label: "KAIROS — Timing & Dramatic Moment",
    description:
      "Prefer timing, pacing, reveal placement, dramatic emphasis, and the pressure most appropriate to the current moment.",
  }),
  Object.freeze({
    value: "TOPOS",
    label: "TOPOS — Place & Context",
    description:
      "Prefer place, environment, spatial context, atmosphere, and pressure naturally grounded in the current surroundings.",
  }),
  Object.freeze({
    value: "MYTHOS",
    label: "MYTHOS — Meaning & Narrative Resonance",
    description:
      "Prefer authorized thematic, historical, symbolic, cultural, and narrative resonance among otherwise valid choices.",
  }),
]);

function optionValues(options = []) {
  return options.map((option) => option.value);
}

export function isCompletePriorityPermutation(value, options = []) {
  if (!Array.isArray(value) || value.length !== options.length) return false;

  const allowed = new Set(optionValues(options));
  const normalized = value.map((item) => String(item || "").trim().toUpperCase());

  return (
    normalized.every((item) => allowed.has(item)) &&
    new Set(normalized).size === allowed.size
  );
}

export function normalizePriorityOrder(value, options = []) {
  if (!isCompletePriorityPermutation(value, options)) return null;
  return value.map((item) => String(item || "").trim().toUpperCase());
}

export function getDefaultPriorityOrder(options = []) {
  return optionValues(options);
}

export function movePriorityItem(order, index, delta) {
  if (!Array.isArray(order)) return order;

  const nextIndex = index + delta;
  if (
    index < 0 ||
    index >= order.length ||
    nextIndex < 0 ||
    nextIndex >= order.length
  ) {
    return [...order];
  }

  const next = [...order];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}
