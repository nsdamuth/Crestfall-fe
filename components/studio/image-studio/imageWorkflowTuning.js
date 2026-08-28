const SEMANTIC_MIN = 0;
const SEMANTIC_MAX = 100;

function control({
  id,
  label,
  description,
  leftLabel,
  rightLabel,
  defaultValue,
  step = 5,
}) {
  return Object.freeze({
    id,
    label,
    description,
    leftLabel,
    rightLabel,
    min: SEMANTIC_MIN,
    max: SEMANTIC_MAX,
    step,
    defaultValue,
  });
}

export const IMAGE_WORKFLOW_TUNING_DEFINITIONS = Object.freeze({
  crestfall_fantasy_realistic: Object.freeze({
    key: "crestfall_fantasy_realistic",
    label: "Fantasy → Realistic",
    description:
      "Tune the tested Fantasy → Realistic envelope without exposing sampler, CFG, or model internals.",
    controls: Object.freeze([
      control({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly a compatible Character reference image anchors identity and composition.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        defaultValue: 50,
      }),
      control({
        id: "styleBalance",
        label: "Realism Balance",
        description:
          "How strongly the realism polish is allowed to reshape the fantasy foundation.",
        leftLabel: "More Fantasy",
        rightLabel: "Max Realism",
        defaultValue: 100,
      }),
      control({
        id: "foundationDetail",
        label: "Fantasy Foundation Detail",
        description: "How much of the validated first-pass detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
        defaultValue: 100,
      }),
      control({
        id: "polishDetail",
        label: "Realism Polish Detail",
        description: "How much of the validated realism-polish detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
        defaultValue: 100,
      }),
    ]),
    handoff: Object.freeze({
      boundaryControlId: "styleBalance",
      boundaryValue: 100,
      targetProfileKey: "crestfall_realistic_fantasy",
      targetProfileLabel: "Realistic → Fantasy",
      message:
        "This is the validated realism ceiling for Fantasy → Realistic. For a more realism-first result, switch workflows.",
      targetStartingTuning: Object.freeze({ styleBalance: 0 }),
    }),
  }),

  crestfall_realistic_fantasy: Object.freeze({
    key: "crestfall_realistic_fantasy",
    label: "Realistic → Fantasy",
    description:
      "Tune the tested Realistic → Fantasy envelope without exposing sampler, CFG, or model internals.",
    controls: Object.freeze([
      control({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly a compatible Character reference image anchors identity and composition.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        defaultValue: 50,
      }),
      control({
        id: "styleBalance",
        label: "Fantasy Balance",
        description:
          "How strongly the fantasy polish is allowed to reshape the realistic foundation.",
        leftLabel: "More Realistic",
        rightLabel: "Max Fantasy",
        defaultValue: 100,
      }),
      control({
        id: "foundationDetail",
        label: "Realistic Foundation Detail",
        description: "How much of the validated first-pass detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
        defaultValue: 100,
      }),
      control({
        id: "polishDetail",
        label: "Fantasy Polish Detail",
        description: "How much of the validated fantasy-polish detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
        defaultValue: 100,
      }),
    ]),
    handoff: Object.freeze({
      boundaryControlId: "styleBalance",
      boundaryValue: 100,
      targetProfileKey: "crestfall_fantasy_realistic",
      targetProfileLabel: "Fantasy → Realistic",
      message:
        "This is the validated fantasy ceiling for Realistic → Fantasy. For a more fantasy-first result, switch workflows.",
      targetStartingTuning: Object.freeze({ styleBalance: 0 }),
    }),
  }),
});

function clampSemanticValue(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, SEMANTIC_MIN), SEMANTIC_MAX);
}

export function getImageWorkflowTuningDefinition(profileKey) {
  return IMAGE_WORKFLOW_TUNING_DEFINITIONS[String(profileKey || "").trim()] || null;
}

export function getDefaultImageWorkflowTuning(profileKey) {
  const definition = getImageWorkflowTuningDefinition(profileKey);

  if (!definition) return {};

  return Object.fromEntries(
    definition.controls.map((entry) => [entry.id, entry.defaultValue])
  );
}

export function normalizeImageWorkflowTuning(profileKey, tuning = {}) {
  const definition = getImageWorkflowTuningDefinition(profileKey);

  if (!definition) return {};

  const source = tuning && typeof tuning === "object" ? tuning : {};

  return Object.fromEntries(
    definition.controls.map((entry) => [
      entry.id,
      clampSemanticValue(source[entry.id], entry.defaultValue),
    ])
  );
}

export function getWorkflowTuningPayload({ profileKey, tuning, touched }) {
  if (!touched) return null;

  const definition = getImageWorkflowTuningDefinition(profileKey);
  if (!definition) return null;

  return normalizeImageWorkflowTuning(profileKey, tuning);
}

export function getWorkflowTuningHandoff(profileKey) {
  return getImageWorkflowTuningDefinition(profileKey)?.handoff || null;
}
