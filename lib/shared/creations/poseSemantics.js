export const POSE_SEMANTICS_CONTRACT_VERSION = "pose_semantics_v1";

export const POSE_CATEGORY_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "GENERAL", label: "General" },
  { value: "STANDING", label: "Standing" },
  { value: "SEATED", label: "Seated" },
  { value: "KNEELING", label: "Kneeling" },
  { value: "CROUCHING", label: "Crouching" },
  { value: "RECLINING", label: "Reclining" },
  { value: "PRONE", label: "Prone" },
  { value: "MOVEMENT", label: "Movement" },
  { value: "ACTION", label: "Action" },
  { value: "PORTRAIT", label: "Portrait / Upper Body" },
  { value: "INTERACTION", label: "Interaction" },
]);

export const POSE_POSTURE_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "STANDING", label: "Standing" },
  { value: "SEATED", label: "Seated" },
  { value: "KNEELING", label: "Kneeling" },
  { value: "CROUCHING", label: "Crouching" },
  { value: "PRONE", label: "Prone" },
  { value: "RECLINING", label: "Reclining" },
  { value: "MOVING", label: "Moving" },
  { value: "TRANSITIONING", label: "Transitioning" },
]);

export const POSE_BODY_ORIENTATION_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "FRONT", label: "Front" },
  { value: "FORWARD", label: "Forward" },
  { value: "THREE_QUARTER", label: "Three-quarter" },
  { value: "FRONT_OR_THREE_QUARTER", label: "Front / Three-quarter" },
  { value: "SIDE", label: "Side / Profile" },
  { value: "SIDE_OR_FRONT", label: "Side / Front" },
  { value: "BACK", label: "Back" },
  { value: "UPWARD", label: "Upward" },
  { value: "DOWNWARD", label: "Downward" },
  { value: "DYNAMIC", label: "Dynamic / Changing" },
]);

export const POSE_ENERGY_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "NEUTRAL", label: "Neutral" },
  { value: "CALM", label: "Calm" },
  { value: "RELAXED", label: "Relaxed" },
  { value: "CASUAL", label: "Casual" },
  { value: "THOUGHTFUL", label: "Thoughtful" },
  { value: "ELEGANT", label: "Elegant" },
  { value: "POISED", label: "Poised" },
  { value: "REGAL", label: "Regal" },
  { value: "FOCUSED", label: "Focused" },
  { value: "ASSERTIVE", label: "Assertive" },
  { value: "GUARDED", label: "Guarded" },
  { value: "ACTIVE", label: "Active" },
  { value: "DYNAMIC", label: "Dynamic" },
  { value: "DISPLAY", label: "Display" },
  { value: "PROJECTING", label: "Projecting" },
  { value: "AGGRESSIVE", label: "Aggressive" },
  { value: "URGENT", label: "Urgent" },
  { value: "COMBAT_READY", label: "Combat Ready" },
]);

export const POSE_VIEWER_RELATION_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "NEUTRAL", label: "Neutral / Scene-led" },
  { value: "TOWARD_VIEWER", label: "Toward Viewer" },
  { value: "AWAY_FROM_VIEWER", label: "Away from Viewer" },
  { value: "SIDE_ON", label: "Side-on to Viewer" },
  { value: "LOOKING_BACK", label: "Looking Back" },
  { value: "VIEWER_BELOW", label: "Viewer Below Subject" },
  { value: "VIEWER_ABOVE", label: "Viewer Above Subject" },
  { value: "SCENE_PARTNER", label: "Toward Scene Partner" },
]);

const SEMANTIC_FIELDS = Object.freeze([
  "category",
  "intended_use",
  "posture",
  "body_orientation",
  "arm_hand_position",
  "leg_foot_position",
  "facial_expression",
  "balance_weight",
  "body_position_notes",
  "action_motion",
  "energy_level",
  "viewer_relation",
  "prop_interaction",
  "scene_fit",
  "mood_attitude",
  "staging_notes",
  "usage_notes",
  "compatibility_notes",
]);

const POSTURE_VALUES = new Set(
  POSE_POSTURE_OPTIONS.map((option) => option.value).filter(Boolean)
);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSemanticToken(value) {
  return normalizeString(value).toUpperCase();
}

function firstValue(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeEnumValue(value) {
  return normalizeString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function inferCategoryFromPosture(posture) {
  const normalized = normalizeEnumValue(posture);
  if (["STANDING", "SEATED", "KNEELING", "CROUCHING", "RECLINING", "PRONE"].includes(normalized)) {
    return normalized;
  }
  if (["MOVING", "TRANSITIONING"].includes(normalized)) return "MOVEMENT";
  return "";
}

export function normalizePoseSemantics(data = {}) {
  const source = normalizeObject(data);
  const semantics = normalizeObject(source.pose_semantics || source.poseSemantics);
  const poseMatch = normalizeObject(source.pose_match || source.poseMatch);
  const legacyOrientation = normalizeSemanticToken(source.orientation);
  const legacyPosture = POSTURE_VALUES.has(legacyOrientation)
    ? legacyOrientation
    : "";
  const matcherPosture = Array.isArray(poseMatch.postures)
    ? normalizeEnumValue(poseMatch.postures[0])
    : "";
  const posture = normalizeEnumValue(
    firstValue(semantics.posture, source.posture, legacyPosture, matcherPosture)
  );

  return {
    contract_version: POSE_SEMANTICS_CONTRACT_VERSION,
    category: normalizeEnumValue(
      firstValue(
        semantics.category,
        source.category,
        source.pose_type,
        inferCategoryFromPosture(posture)
      )
    ),
    intended_use: firstValue(semantics.intended_use, source.intended_use),
    posture,
    body_orientation: normalizeEnumValue(firstValue(
      semantics.body_orientation,
      source.body_orientation,
      !legacyPosture ? source.orientation : ""
    )),
    arm_hand_position: firstValue(
      semantics.arm_hand_position,
      source.arm_hand_position
    ),
    leg_foot_position: firstValue(
      semantics.leg_foot_position,
      source.leg_foot_position
    ),
    facial_expression: firstValue(
      semantics.facial_expression,
      source.facial_expression
    ),
    balance_weight: firstValue(semantics.balance_weight, source.balance_weight),
    body_position_notes: firstValue(
      semantics.body_position_notes,
      source.body_position_notes
    ),
    action_motion: firstValue(semantics.action_motion, source.action_motion),
    energy_level: normalizeEnumValue(firstValue(
      semantics.energy_level,
      source.energy_level,
      source.energy
    )),
    viewer_relation: normalizeEnumValue(firstValue(
      semantics.viewer_relation,
      source.viewer_relation
    )),
    prop_interaction: firstValue(
      semantics.prop_interaction,
      source.prop_interaction
    ),
    scene_fit: firstValue(semantics.scene_fit, source.scene_fit),
    mood_attitude: firstValue(semantics.mood_attitude, source.mood_attitude),
    staging_notes: firstValue(semantics.staging_notes, source.staging_notes),
    usage_notes: firstValue(semantics.usage_notes, source.usage_notes),
    compatibility_notes: firstValue(
      semantics.compatibility_notes,
      source.compatibility_notes
    ),
  };
}

export function isPoseSemanticField(field) {
  return SEMANTIC_FIELDS.includes(String(field || ""));
}

export function updatePoseSemanticField(data = {}, field, value) {
  const source = normalizeObject(data);
  const normalizedField = String(field || "");

  if (!isPoseSemanticField(normalizedField)) {
    return {
      ...source,
      [normalizedField]: value,
    };
  }

  const semantics = {
    ...normalizePoseSemantics(source),
    [normalizedField]: value,
  };

  const next = {
    ...source,
    [normalizedField]: value,
    pose_semantics: semantics,
  };

  // Preserve the original Visual Asset Builder compatibility fields while the
  // semantic contract becomes the source of truth for new Pose authoring.
  if (normalizedField === "posture") next.orientation = value;
  if (normalizedField === "energy_level") next.energy = value;

  return next;
}

export function normalizePoseDataForPersistence(data = {}) {
  const source = normalizeObject(data);
  const semantics = normalizePoseSemantics(source);
  let next = {
    ...source,
    pose_semantics: semantics,
  };

  for (const field of SEMANTIC_FIELDS) {
    if (semantics[field]) {
      next[field] = semantics[field];
    } else if (!Object.prototype.hasOwnProperty.call(next, field)) {
      next[field] = "";
    }
  }

  if (semantics.posture) next.orientation = semantics.posture;
  if (semantics.energy_level) next.energy = semantics.energy_level;

  const promptGuidance = firstValue(source.prompt_guidance, source.prompt);
  if (promptGuidance) {
    next.prompt_guidance = promptGuidance;
    next.prompt = promptGuidance;
  }

  return next;
}

export function buildPosePromptFromSemantics(data = {}) {
  const semantics = normalizePoseSemantics(data);
  const parts = [
    semantics.posture && `Posture: ${semantics.posture}.`,
    semantics.body_orientation &&
      `Body orientation: ${semantics.body_orientation}.`,
    semantics.arm_hand_position && semantics.arm_hand_position,
    semantics.leg_foot_position && semantics.leg_foot_position,
    semantics.balance_weight && semantics.balance_weight,
    semantics.body_position_notes && semantics.body_position_notes,
    semantics.action_motion && `Motion: ${semantics.action_motion}.`,
    semantics.viewer_relation &&
      `Viewer relation: ${semantics.viewer_relation}.`,
    semantics.prop_interaction &&
      `Prop interaction: ${semantics.prop_interaction}.`,
    semantics.facial_expression &&
      `Expression default: ${semantics.facial_expression}.`,
    semantics.mood_attitude && `Attitude default: ${semantics.mood_attitude}.`,
    semantics.staging_notes && semantics.staging_notes,
  ].filter(Boolean);

  return parts.join(" ").replace(/\s+/g, " ").trim();
}
