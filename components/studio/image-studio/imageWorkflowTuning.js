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

export const RENDER_STYLE_RAIL_STOPS = Object.freeze([
  Object.freeze({
    value: "crestfall_fantasy",
    shortLabel: "Fantasy",
    mappedLabel: "Crestfall Fantasy",
  }),
  Object.freeze({
    value: "crestfall_anime_anime",
    shortLabel: "Anime",
    mappedLabel: "Crestfall Anime",
  }),
  Object.freeze({
    value: "crestfall_fantasy_realistic",
    shortLabel: "Illustrative",
    mappedLabel: "Crestfall Illustrative",
  }),
  Object.freeze({
    value: "crestfall_fantasy_realism",
    shortLabel: "Heroic",
    mappedLabel: "Crestfall Heroic",
  }),
  Object.freeze({
    value: "crestfall_realistic_fantasy",
    shortLabel: "Cinematic",
    mappedLabel: "Crestfall Cinematic",
  }),
  Object.freeze({
    value: "crestfall_realistic",
    shortLabel: "Realistic",
    mappedLabel: "Crestfall Realistic",
  }),
]);

const DEFAULT_PROFILE_KEY = RENDER_STYLE_RAIL_STOPS[0].value;

export const IMAGE_WORKFLOW_TUNING_DEFINITIONS = Object.freeze({
  crestfall_fantasy: Object.freeze({
    key: "crestfall_fantasy",
    label: "Fantasy",
    description:
      "Tune the fantasy workflow inside its validated detail envelope without exposing raw workflow internals.",
    controls: Object.freeze([
      control({
        id: "detailLevel",
        label: "Fantasy Detail",
        description:
          "Adjust the bounded sampling detail budget while leaving CFG, sampler, scheduler, and model selection locked.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 70,
      }),
    ]),
  }),

  crestfall_anime_anime: Object.freeze({
    key: "crestfall_anime_anime",
    label: "Anime",
    description:
      "Tune the two-pass anime workflow inside its validated foundation and polish detail envelopes.",
    controls: Object.freeze([
      control({
        id: "foundationDetail",
        label: "Anime Foundation Detail",
        description: "Adjust the bounded first-pass detail budget.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 70,
      }),
      control({
        id: "polishDetail",
        label: "Anime Polish Detail",
        description: "Adjust the bounded second-pass anime polish detail budget.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 70,
      }),
    ]),
  }),

  crestfall_fantasy_realistic: Object.freeze({
    key: "crestfall_fantasy_realistic",
    label: "Illustrative",
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
      targetProfileKey: "crestfall_fantasy_realism",
      targetProfileLabel: "Heroic",
      message:
        "This is the validated realism ceiling for Illustrative. Move the workflow rail right for the balanced Heroic lane.",
      targetStartingTuning: Object.freeze({ styleBalance: 35 }),
    }),
  }),

  crestfall_fantasy_realism: Object.freeze({
    key: "crestfall_fantasy_realism",
    label: "Heroic",
    description:
      "Tune the balanced fantasy-realism lane that bridges Fantasy → Realistic and Realistic → Fantasy without exposing sampler, CFG, or model internals.",
    controls: Object.freeze([
      control({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly the Character's Realistic Reference anchors identity and composition when one is available.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        defaultValue: 50,
      }),
      control({
        id: "styleBalance",
        label: "Fantasy Influence",
        description:
          "How strongly the fantasy polish may reshape the realism-first foundation while staying in the balanced middle lane.",
        leftLabel: "Mostly Realistic",
        rightLabel: "Stronger Fantasy",
        defaultValue: 35,
      }),
      control({
        id: "foundationDetail",
        label: "Realistic Foundation Detail",
        description: "How much of the bounded realism-foundation detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 55,
      }),
      control({
        id: "polishDetail",
        label: "Fantasy Polish Detail",
        description: "How much of the bounded fantasy-polish detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 40,
      }),
    ]),
    handoff: Object.freeze({
      boundaryControlId: "styleBalance",
      boundaryValue: 100,
      targetProfileKey: "crestfall_realistic_fantasy",
      targetProfileLabel: "Cinematic",
      message:
        "This is the validated fantasy ceiling for Heroic. Move the workflow rail right for the stronger Cinematic lane.",
      targetStartingTuning: Object.freeze({ styleBalance: 50 }),
    }),
  }),

  crestfall_realistic_fantasy: Object.freeze({
    key: "crestfall_realistic_fantasy",
    label: "Cinematic",
    description:
      "Tune the V3 realism-first foundation and restrained fantasy polish without exposing sampler, CFG, or model internals.",
    controls: Object.freeze([
      control({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly the Character's Realistic Reference anchors identity and composition when one is available.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        defaultValue: 50,
      }),
      control({
        id: "styleBalance",
        label: "Fantasy Influence",
        description:
          "How strongly the restrained fantasy polish may reshape the realism-first foundation.",
        leftLabel: "Mostly Realistic",
        rightLabel: "Stronger Fantasy",
        defaultValue: 50,
      }),
      control({
        id: "foundationDetail",
        label: "Realistic Foundation Detail",
        description: "How much of the bounded RealVis foundation detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 65,
      }),
      control({
        id: "polishDetail",
        label: "Fantasy Polish Detail",
        description: "How much of the bounded fantasy-polish detail budget is used.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 50,
      }),
    ]),
    handoff: Object.freeze({
      boundaryControlId: "styleBalance",
      boundaryValue: 100,
      targetProfileKey: "crestfall_fantasy_realistic",
      targetProfileLabel: "Illustrative",
      message:
        "This is the validated fantasy ceiling for Cinematic. Move the workflow rail left for the more illustrative fantasy-first lane.",
      targetStartingTuning: Object.freeze({ styleBalance: 0 }),
    }),
  }),

  crestfall_realistic: Object.freeze({
    key: "crestfall_realistic",
    label: "Realistic",
    description:
      "Tune the V3 photoreal workflow and optional Realistic Reference influence without exposing raw workflow internals.",
    controls: Object.freeze([
      control({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly the Character's Realistic Reference anchors identity and composition when one is available.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        defaultValue: 50,
      }),
      control({
        id: "detailLevel",
        label: "Realism Detail",
        description:
          "Adjust the bounded RealVis sampling detail budget while leaving CFG, sampler, scheduler, and model selection locked.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
        defaultValue: 50,
      }),
    ]),
  }),
});

function clampSemanticValue(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, SEMANTIC_MIN), SEMANTIC_MAX);
}

export function normalizeRenderStyleRailSelection(profileKey) {
  const normalizedKey = String(profileKey || "").trim();
  if (RENDER_STYLE_RAIL_STOPS.some((entry) => entry.value === normalizedKey)) {
    return normalizedKey;
  }
  return DEFAULT_PROFILE_KEY;
}

export function getRenderStyleRailStop(profileKey) {
  const normalizedKey = normalizeRenderStyleRailSelection(profileKey);
  return (
    RENDER_STYLE_RAIL_STOPS.find((entry) => entry.value === normalizedKey) ||
    RENDER_STYLE_RAIL_STOPS[0]
  );
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
