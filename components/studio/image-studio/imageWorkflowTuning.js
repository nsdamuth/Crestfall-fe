const SEMANTIC_MIN = 0;
const SEMANTIC_MAX = 100;

function rangeControl({
  id,
  label,
  description,
  leftLabel,
  rightLabel,
  defaultValue,
  min,
  max,
  step = 1,
  formatValue = (value) => String(value),
  toDisplayValue = null,
  fromDisplayValue = null,
}) {
  return Object.freeze({
    kind: "range",
    id,
    label,
    description,
    leftLabel,
    rightLabel,
    min,
    max,
    step,
    defaultValue,
    formatValue,
    toDisplayValue,
    fromDisplayValue,
  });
}

function discreteRangeControl({
  id,
  label,
  description,
  defaultValue,
  options,
  leftLabel,
  rightLabel,
}) {
  return Object.freeze({
    kind: "discrete-range",
    id,
    label,
    description,
    defaultValue,
    options,
    min: 0,
    max: Math.max((options?.length || 1) - 1, 0),
    step: 1,
    leftLabel,
    rightLabel,
  });
}

function scaleKey(value) {
  return Number(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/0$/, "");
}

function makeStepEnvelope(min, max, defaultValue) {
  return Object.freeze({ min, max, defaultValue, step: 1, kind: "integer" });
}

function makeDenoiseEnvelope(min, max, defaultValue) {
  return Object.freeze({
    min,
    max,
    defaultValue,
    step: 0.01,
    kind: "float",
  });
}

export const RENDER_STYLE_RAIL_STOPS = Object.freeze([
  Object.freeze({
    value: "crestfall_fantasy",
    shortLabel: "Fantasy",
    mappedLabel: "Crestfall Fantasy",
    definition: "Painterly fantasy illustration with soft light and rich color.",
  }),
  Object.freeze({
    value: "crestfall_anime_anime",
    shortLabel: "Anime",
    mappedLabel: "Crestfall Anime",
    definition: "Clean line work and flat shading in an anime style.",
  }),
  Object.freeze({
    value: "crestfall_fantasy_realistic",
    shortLabel: "Illustrative",
    mappedLabel: "Crestfall Illustrative",
    definition: "Fantasy illustration with realistic proportions and detail.",
  }),
  Object.freeze({
    value: "crestfall_fantasy_realism",
    shortLabel: "Heroic",
    mappedLabel: "Crestfall Heroic",
    definition: "Dramatic, polished fantasy realism built for hero shots.",
  }),
  Object.freeze({
    value: "crestfall_realistic_fantasy",
    shortLabel: "Cinematic",
    mappedLabel: "Crestfall Cinematic",
    definition: "Photographic realism with fantasy lighting and mood.",
  }),
  Object.freeze({
    value: "crestfall_realistic",
    shortLabel: "Realistic",
    mappedLabel: "Crestfall Realistic",
    definition: "Photographic realism with natural light and texture.",
  }),
]);

const DEFAULT_PROFILE_KEY = RENDER_STYLE_RAIL_STOPS[0].value;

const DETAIL_PRESET_LABELS = Object.freeze({
  1: "Standard",
  1.25: "Enhanced",
  1.5: "High",
  1.75: "Ultra",
  2: "Maximum",
});

const SCALES = Object.freeze({
  fantasy: Object.freeze({
    1: [25, 25, 25, 25, 25, 25, 0.15, 0.15, 0.15],
    1.25: [30, 44, 30, 30, 48, 30, 0.2, 0.32, 0.2],
    1.5: [35, 46, 35, 35, 52, 35, 0.25, 0.36, 0.25],
    1.75: [45, 50, 45, 40, 58, 40, 0.4, 0.5, 0.4],
    2: [45, 55, 45, 65, 75, 65, 0.6, 0.7, 0.6],
  }),
  realistic: Object.freeze({
    1: [25, 45, 25, 35, 45, 35, 0.15, 0.35, 0.15],
    1.25: [45, 50, 45, 40, 50, 40, 0.6, 0.7, 0.6],
  }),
  hybrid: Object.freeze({
    1: [25, 35, 25, 25, 35, 25, 0.2, 0.3, 0.2],
    1.25: [25, 37, 25, 25, 37, 25, 0.2, 0.31, 0.2],
    1.5: [25, 40, 25, 25, 40, 25, 0.2, 0.32, 0.2],
    1.75: [25, 42, 25, 25, 42, 25, 0.2, 0.33, 0.2],
    2: [25, 45, 25, 25, 45, 25, 0.2, 0.35, 0.2],
  }),
  cinematic: Object.freeze({
    1: [25, 35, 25, 35, 45, 35, 0.4, 0.45, 0.4],
    1.25: [25, 36, 25, 35, 45, 35, 0.4, 0.46, 0.4],
    1.5: [25, 38, 25, 35, 46, 35, 0.4, 0.47, 0.4],
    1.75: [25, 39, 25, 35, 48, 35, 0.4, 0.48, 0.4],
    2: [25, 40, 25, 35, 50, 35, 0.4, 0.5, 0.4],
  }),
});

function toEnvelope(tuple) {
  return Object.freeze({
    foundationSteps: makeStepEnvelope(tuple[0], tuple[1], tuple[2]),
    polishSteps: makeStepEnvelope(tuple[3], tuple[4], tuple[5]),
    polishDenoise: makeDenoiseEnvelope(tuple[6], tuple[7], tuple[8]),
  });
}

function profile({
  key,
  label,
  description,
  safetyNote,
  defaultScale,
  detailScaleOptions,
  scaleSet,
  supportsReferenceInfluence = false,
  controlPresentation = null,
}) {
  return Object.freeze({
    key,
    label,
    description,
    safetyNote,
    defaultScale,
    detailScaleOptions: Object.freeze(detailScaleOptions),
    supportsReferenceInfluence,
    controlPresentation: controlPresentation
      ? Object.freeze({ ...controlPresentation })
      : null,
    scales: Object.freeze(
      Object.fromEntries(
        Object.entries(scaleSet).map(([nextKey, tuple]) => [scaleKey(nextKey), toEnvelope(tuple)])
      )
    ),
  });
}

const PROFILE_DEFINITIONS = Object.freeze({
  crestfall_fantasy: profile({
    key: "crestfall_fantasy",
    label: "Fantasy",
    description:
      "Tune the fantasy lane with lane-safe detail presets and bounded finishing controls.",
    safetyNote:
      "Detail presets stay inside the certified fantasy envelope. Foundation, Refinement, and Variation narrow automatically as detail increases.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25, 1.5, 1.75, 2],
    scaleSet: SCALES.fantasy,
  }),
  crestfall_anime_anime: profile({
    key: "crestfall_anime_anime",
    label: "Anime",
    description:
      "Tune the anime lane with lane-safe detail presets and bounded finishing controls.",
    safetyNote:
      "Anime shares the fantasy detail family. Higher detail presets tighten the editable range automatically.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25, 1.5, 1.75, 2],
    scaleSet: SCALES.fantasy,
    supportsReferenceInfluence: true,
  }),
  crestfall_realistic: profile({
    key: "crestfall_realistic",
    label: "Realistic",
    description:
      "Tune the realistic lane with conservative detail presets and bounded finishing controls.",
    safetyNote:
      "Realistic is intentionally limited to the certified Standard and Enhanced detail presets while this lane remains under evaluation.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25],
    scaleSet: SCALES.realistic,
    supportsReferenceInfluence: true,
  }),
  crestfall_fantasy_realistic: profile({
    key: "crestfall_fantasy_realistic",
    label: "Illustrative",
    description:
      "Tune the illustrative lane with detail presets, reference influence, and bounded finishing controls.",
    safetyNote:
      "Illustrative keeps conservative defaults while higher detail presets expand the available finishing headroom.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25, 1.5, 1.75, 2],
    scaleSet: SCALES.hybrid,
    supportsReferenceInfluence: true,
    controlPresentation: {
      foundationSteps: Object.freeze({
        label: "Fantasy Foundation Detail",
        description: "How much of the bounded fantasy-foundation detail budget is used in Stage 1.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
      }),
      polishSteps: Object.freeze({
        label: "Realism Polish Detail",
        description: "How much of the bounded realism-polish detail budget is used in Stage 2.",
        leftLabel: "Lighter",
        rightLabel: "Full Detail",
      }),
      polishDenoise: Object.freeze({
        label: "Realism Balance",
        description: "How strongly the realism polish is allowed to reshape the fantasy foundation during Stage 2.",
        leftLabel: "More Fantasy",
        rightLabel: "Max Realism",
      }),
    },
  }),
  crestfall_fantasy_realism: profile({
    key: "crestfall_fantasy_realism",
    label: "Heroic",
    description:
      "Tune the heroic lane with detail presets, reference influence, and bounded finishing controls.",
    safetyNote:
      "Heroic keeps balanced defaults while higher detail presets expand the available finishing headroom.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25, 1.5, 1.75, 2],
    scaleSet: SCALES.hybrid,
    supportsReferenceInfluence: true,
    controlPresentation: {
      foundationSteps: Object.freeze({
        label: "Realistic Foundation Detail",
        description: "How much of the bounded realism-foundation detail budget is used in Stage 1.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
      }),
      polishSteps: Object.freeze({
        label: "Fantasy Polish Detail",
        description: "How much of the bounded fantasy-polish detail budget is used in Stage 2.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
      }),
      polishDenoise: Object.freeze({
        label: "Fantasy Influence",
        description: "How strongly the fantasy polish may reshape the realism-first foundation while staying in the balanced Heroic lane.",
        leftLabel: "Mostly Realistic",
        rightLabel: "Stronger Fantasy",
      }),
    },
  }),
  crestfall_realistic_fantasy: profile({
    key: "crestfall_realistic_fantasy",
    label: "Cinematic",
    description:
      "Tune the cinematic lane with detail presets, reference influence, and bounded finishing controls.",
    safetyNote:
      "Cinematic keeps a stronger finishing pass than the other hybrid lanes while higher detail presets expand the available finishing headroom.",
    defaultScale: 1,
    detailScaleOptions: [1, 1.25, 1.5, 1.75, 2],
    scaleSet: SCALES.cinematic,
    supportsReferenceInfluence: true,
    controlPresentation: {
      foundationSteps: Object.freeze({
        label: "Realistic Foundation Detail",
        description: "How much of the bounded realism-foundation detail budget is used in Stage 1.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
      }),
      polishSteps: Object.freeze({
        label: "Fantasy Polish Detail",
        description: "How much of the bounded fantasy-polish detail budget is used in Stage 2.",
        leftLabel: "Lighter",
        rightLabel: "Richer",
      }),
      polishDenoise: Object.freeze({
        label: "Fantasy Influence",
        description: "How strongly the restrained fantasy polish may reshape the realism-first foundation during Stage 2.",
        leftLabel: "Mostly Realistic",
        rightLabel: "Stronger Fantasy",
      }),
    },
  }),
});

function clampRangeValue(value, envelope) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return envelope.defaultValue;
  }

  const bounded = Math.min(Math.max(parsed, envelope.min), envelope.max);

  if (envelope.kind === "integer") {
    return Math.round(bounded);
  }

  return Math.round(bounded * 100) / 100;
}

function clampSemanticValue(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(parsed), SEMANTIC_MIN), SEMANTIC_MAX);
}

function projectRangeValueToSemantic(value, envelope, semanticMin = SEMANTIC_MIN) {
  if (!envelope) return semanticMin;

  const clamped = clampRangeValue(value, envelope);
  const rawSpan = envelope.max - envelope.min;
  const semanticSpan = SEMANTIC_MAX - semanticMin;

  if (!(rawSpan > 0) || !(semanticSpan > 0)) {
    return semanticMin;
  }

  const semantic =
    semanticMin + ((clamped - envelope.min) / rawSpan) * semanticSpan;
  return Math.min(
    Math.max(Math.round(semantic), semanticMin),
    SEMANTIC_MAX
  );
}

function projectSemanticToRangeValue(value, envelope, semanticMin = SEMANTIC_MIN) {
  if (!envelope) return value;

  const parsed = Number(value);
  const semantic = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, semanticMin), SEMANTIC_MAX)
    : semanticMin;
  const rawSpan = envelope.max - envelope.min;
  const semanticSpan = SEMANTIC_MAX - semanticMin;

  if (!(rawSpan > 0) || !(semanticSpan > 0)) {
    return clampRangeValue(envelope.min, envelope);
  }

  const projected =
    envelope.min + ((semantic - semanticMin) / semanticSpan) * rawSpan;
  return clampRangeValue(projected, envelope);
}

function getProfileDefinition(profileKey) {
  return PROFILE_DEFINITIONS[String(profileKey || "").trim()] || null;
}

function resolveDetailScale(profile, requestedScale) {
  const options = profile?.detailScaleOptions || [1];
  const fallback = options[0] || 1;
  const parsed = Number(requestedScale);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  let best = fallback;
  let bestDistance = Math.abs(parsed - fallback);

  for (const option of options) {
    const distance = Math.abs(parsed - option);
    if (distance < bestDistance) {
      best = option;
      bestDistance = distance;
    }
  }

  return best;
}

function getScaleEnvelope(profile, detailScale) {
  if (!profile) return null;

  return (
    profile.scales[scaleKey(detailScale)] ||
    profile.scales[scaleKey(profile.defaultScale)] ||
    Object.values(profile.scales)[0] ||
    null
  );
}

function buildScaleOptions(profile) {
  return (profile?.detailScaleOptions || []).map((value, index, allValues) => ({
    index,
    value,
    label: DETAIL_PRESET_LABELS[value] || `Preset ${index + 1}`,
    semanticLabel: DETAIL_PRESET_LABELS[value] || `Preset ${index + 1}`,
    leftEdge: index === 0,
    rightEdge: index === allValues.length - 1,
  }));
}

function formatDefaultValue(control, value) {
  if (control.kind === "discrete-range") {
    const option = (control.options || []).find(
      (entry) => Number(entry.value) === Number(value)
    );
    return option?.label || String(value);
  }

  return control.formatValue ? control.formatValue(value) : String(value);
}

function getControlPresentation(profile, controlId, fallback) {
  return {
    ...fallback,
    ...(profile?.controlPresentation?.[controlId] || {}),
  };
}

function buildControls(profile, normalizedTuning) {
  const scaleEnvelope = getScaleEnvelope(profile, normalizedTuning.detailScale);

  if (!scaleEnvelope) return [];

  const controls = [];

  if (profile.supportsReferenceInfluence) {
    controls.push(
      rangeControl({
        id: "referenceInfluence",
        label: "Reference Influence",
        description:
          "How strongly a compatible Realistic Reference image is allowed to anchor identity and composition.",
        leftLabel: "Looser",
        rightLabel: "Stronger",
        min: SEMANTIC_MIN,
        max: SEMANTIC_MAX,
        step: 1,
        defaultValue: 50,
        formatValue: (value) => `${Math.round(value)}%`,
      })
    );
  }

  const detailOptions = buildScaleOptions(profile);
  const foundationSemanticMin =
    Number(normalizedTuning.detailScale) === 1.75 &&
    ["crestfall_fantasy", "crestfall_anime_anime"].includes(profile.key)
      ? 10
      : SEMANTIC_MIN;

  const foundationPresentation = getControlPresentation(
    profile,
    "foundationSteps",
    {
      label: "Foundation",
      description:
        "How strongly the image foundation is established before finishing passes begin.",
      leftLabel: "Lighter",
      rightLabel: "Stronger",
    }
  );
  const polishPresentation = getControlPresentation(profile, "polishSteps", {
    label: "Refinement",
    description:
      "How much finishing detail and cleanup the later pass adds on top of the foundation.",
    leftLabel: "Lighter",
    rightLabel: "Richer",
  });
  const denoisePresentation = getControlPresentation(
    profile,
    "polishDenoise",
    {
      label: "Variation",
      description:
        "How freely the finishing pass is allowed to reinterpret the established foundation.",
      leftLabel: "Gentler",
      rightLabel: "Freer",
    }
  );

  controls.push(
    discreteRangeControl({
      id: "detailScale",
      label: "Detail",
      description:
        "Choose the certified detail preset for this render lane. Higher presets add more finishing room while tightening the safe tuning envelope.",
      defaultValue: profile.defaultScale,
      options: detailOptions,
      leftLabel: detailOptions[0]?.label || "Standard",
      rightLabel: detailOptions[detailOptions.length - 1]?.label || "Maximum",
    }),
    rangeControl({
      id: "foundationSteps",
      label: foundationPresentation.label,
      description: foundationPresentation.description,
      leftLabel: foundationPresentation.leftLabel,
      rightLabel: foundationPresentation.rightLabel,
      min: foundationSemanticMin,
      max: SEMANTIC_MAX,
      step: 1,
      defaultValue: projectRangeValueToSemantic(
        scaleEnvelope.foundationSteps.defaultValue,
        scaleEnvelope.foundationSteps,
        foundationSemanticMin
      ),
      formatValue: (value) => `${Math.round(value)}%`,
      toDisplayValue: (value) =>
        projectRangeValueToSemantic(
          value,
          scaleEnvelope.foundationSteps,
          foundationSemanticMin
        ),
      fromDisplayValue: (value) =>
        projectSemanticToRangeValue(
          value,
          scaleEnvelope.foundationSteps,
          foundationSemanticMin
        ),
    }),
    rangeControl({
      id: "polishSteps",
      label: polishPresentation.label,
      description: polishPresentation.description,
      leftLabel: polishPresentation.leftLabel,
      rightLabel: polishPresentation.rightLabel,
      min: SEMANTIC_MIN,
      max: SEMANTIC_MAX,
      step: 1,
      defaultValue: projectRangeValueToSemantic(
        scaleEnvelope.polishSteps.defaultValue,
        scaleEnvelope.polishSteps
      ),
      formatValue: (value) => `${Math.round(value)}%`,
      toDisplayValue: (value) =>
        projectRangeValueToSemantic(value, scaleEnvelope.polishSteps),
      fromDisplayValue: (value) =>
        projectSemanticToRangeValue(value, scaleEnvelope.polishSteps),
    }),
    rangeControl({
      id: "polishDenoise",
      label: denoisePresentation.label,
      description: denoisePresentation.description,
      leftLabel: denoisePresentation.leftLabel,
      rightLabel: denoisePresentation.rightLabel,
      min: SEMANTIC_MIN,
      max: SEMANTIC_MAX,
      step: 1,
      defaultValue: projectRangeValueToSemantic(
        scaleEnvelope.polishDenoise.defaultValue,
        scaleEnvelope.polishDenoise
      ),
      formatValue: (value) => `${Math.round(value)}%`,
      toDisplayValue: (value) =>
        projectRangeValueToSemantic(value, scaleEnvelope.polishDenoise),
      fromDisplayValue: (value) =>
        projectSemanticToRangeValue(value, scaleEnvelope.polishDenoise),
    })
  );

  return controls.map((control) => ({
    ...control,
    defaultValueLabel: formatDefaultValue(control, control.defaultValue),
  }));
}

export function getWorkflowTuningPresentationValue(profileKey, controlId, rawValue, tuning = {}) {
  const definition = getImageWorkflowTuningDefinition(profileKey, tuning);
  const control = definition?.controls?.find((entry) => entry.id === controlId) || null;

  if (!control) {
    return rawValue;
  }

  if (control.kind === "discrete-range") {
    return rawValue;
  }

  return control.toDisplayValue ? control.toDisplayValue(rawValue) : rawValue;
}

export function buildWorkflowTuningPresentationSnapshot(profileKey, tuning = {}) {
  const normalizedTuning = normalizeImageWorkflowTuning(profileKey, tuning);
  const definition = getImageWorkflowTuningDefinition(profileKey, normalizedTuning);
  if (!definition) return null;

  const snapshot = {
    version: "image_workflow_tuning_presentation_v1",
  };

  for (const control of definition.controls || []) {
    if (control.id === "detailScale") {
      const option = (control.options || []).find(
        (entry) => Number(entry.value) === Number(normalizedTuning.detailScale)
      );
      snapshot.detailScale = normalizedTuning.detailScale;
      snapshot.detailScaleLabel = option?.label || String(normalizedTuning.detailScale);
      continue;
    }

    const rawValue = normalizedTuning[control.id];
    if (!Number.isFinite(Number(rawValue))) continue;

    const presentedValue = control.toDisplayValue
      ? control.toDisplayValue(rawValue)
      : rawValue;

    if (Number.isFinite(Number(presentedValue))) {
      snapshot[control.id] = Math.round(Number(presentedValue));
    }
  }

  return snapshot;
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

export function normalizeImageWorkflowTuning(profileKey, tuning = {}) {
  const profile = getProfileDefinition(profileKey);

  if (!profile) return {};

  const source = tuning && typeof tuning === "object" ? tuning : {};
  const detailScale = resolveDetailScale(
    profile,
    source.detailScale ?? profile.defaultScale
  );
  const scaleEnvelope = getScaleEnvelope(profile, detailScale);

  return {
    ...(profile.supportsReferenceInfluence
      ? { referenceInfluence: clampSemanticValue(source.referenceInfluence, 50) }
      : {}),
    detailScale,
    foundationSteps: clampRangeValue(
      source.foundationSteps,
      scaleEnvelope.foundationSteps
    ),
    polishSteps: clampRangeValue(source.polishSteps, scaleEnvelope.polishSteps),
    polishDenoise: clampRangeValue(
      source.polishDenoise,
      scaleEnvelope.polishDenoise
    ),
  };
}

export function getImageWorkflowTuningDefinition(profileKey, tuning = {}) {
  const profile = getProfileDefinition(profileKey);

  if (!profile) return null;

  const normalizedTuning = normalizeImageWorkflowTuning(profileKey, tuning);

  return {
    key: profile.key,
    label: profile.label,
    description: profile.description,
    safetyNote: profile.safetyNote,
    controls: buildControls(profile, normalizedTuning),
    handoff: null,
  };
}

export function getDefaultImageWorkflowTuning(profileKey) {
  return normalizeImageWorkflowTuning(profileKey, {});
}

export function getWorkflowTuningPayload({ profileKey, tuning, touched: _touched }) {
  const definition = getImageWorkflowTuningDefinition(profileKey, tuning);
  if (!definition) return null;

  // Always send the exact normalized raw recipe. `touched` is only a UI
  // presentation flag (defaults vs custom); it must never decide whether the
  // generation recipe is recorded or reproducible.
  return normalizeImageWorkflowTuning(profileKey, tuning);
}

export function getWorkflowTuningHandoff(profileKey) {
  return getImageWorkflowTuningDefinition(profileKey)?.handoff || null;
}
