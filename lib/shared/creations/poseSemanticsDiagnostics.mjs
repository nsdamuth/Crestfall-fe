import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  POSE_BODY_ORIENTATION_OPTIONS,
  POSE_CATEGORY_OPTIONS,
  POSE_ENERGY_OPTIONS,
  POSE_POSTURE_OPTIONS,
  POSE_SEMANTICS_CONTRACT_VERSION,
  POSE_VIEWER_RELATION_OPTIONS,
  buildPosePromptFromSemantics,
  normalizePoseDataForPersistence,
  normalizePoseSemantics,
  updatePoseSemanticField,
} from "./poseSemantics.js";

function read(path) {
  return readFileSync(path, "utf8");
}

assert.equal(POSE_SEMANTICS_CONTRACT_VERSION, "pose_semantics_v1");
assert.ok(POSE_CATEGORY_OPTIONS.some((option) => option.value === "MOVEMENT"));
assert.ok(POSE_POSTURE_OPTIONS.some((option) => option.value === "MOVING"));
assert.ok(
  POSE_BODY_ORIENTATION_OPTIONS.some((option) => option.value === "SIDE")
);
assert.ok(POSE_ENERGY_OPTIONS.some((option) => option.value === "DYNAMIC"));
assert.ok(
  POSE_VIEWER_RELATION_OPTIONS.some((option) => option.value === "VIEWER_BELOW")
);

const legacy = normalizePoseSemantics({
  orientation: "SEATED",
  energy: "CALM",
  arm_hand_position: "hands in lap",
});
assert.equal(legacy.posture, "SEATED");
assert.equal(legacy.body_orientation, "");
assert.equal(legacy.energy_level, "CALM");
assert.equal(legacy.arm_hand_position, "hands in lap");

const modern = normalizePoseSemantics({
  orientation: "SEATED",
  pose_semantics: {
    contract_version: "pose_semantics_v1",
    posture: "MOVING",
    body_orientation: "FRONT",
    action_motion: "running forward",
  },
});
assert.equal(modern.posture, "MOVING");
assert.equal(modern.body_orientation, "FRONT");
assert.equal(modern.action_motion, "running forward");

const updated = updatePoseSemanticField(
  {
    pose_semantics: {
      contract_version: "pose_semantics_v1",
      posture: "STANDING",
    },
  },
  "posture",
  "KNEELING"
);
assert.equal(updated.posture, "KNEELING");
assert.equal(updated.orientation, "KNEELING");
assert.equal(updated.pose_semantics.posture, "KNEELING");

const persisted = normalizePoseDataForPersistence({
  prompt: "running forward",
  posture: "MOVING",
  body_orientation: "FRONT",
  action_motion: "running",
  energy_level: "DYNAMIC",
  usage_notes: "action scenes",
});
assert.equal(persisted.prompt_guidance, "running forward");
assert.equal(persisted.prompt, "running forward");
assert.equal(persisted.pose_semantics.posture, "MOVING");
assert.equal(persisted.pose_semantics.body_orientation, "FRONT");
assert.equal(persisted.pose_semantics.energy_level, "DYNAMIC");
assert.equal(persisted.energy, "DYNAMIC");
assert.equal(persisted.orientation, "MOVING");
assert.equal(persisted.pose_semantics.usage_notes, "action scenes");

const suggestion = buildPosePromptFromSemantics({
  posture: "MOVING",
  body_orientation: "FRONT",
  arm_hand_position: "Arms bent and pumping naturally.",
  leg_foot_position: "One knee forward; trailing leg extended.",
  balance_weight: "Weight carried slightly forward.",
  action_motion: "running forward",
  viewer_relation: "TOWARD_VIEWER",
});
assert.match(suggestion, /Posture: MOVING/);
assert.match(suggestion, /Body orientation: FRONT/);
assert.match(suggestion, /Arms bent and pumping naturally/);
assert.match(suggestion, /Motion: running forward/);
assert.match(suggestion, /Viewer relation: TOWARD_VIEWER/);

const editViewModel = read(
  "components/studio/my-creations/edit/hooks/useCreationEditViewModel.js"
);
assert.match(editViewModel, /updatePoseSemanticField/);
assert.match(editViewModel, /isPoseSemanticField/);
assert.match(editViewModel, /field === "prompt_guidance"/);

const savePayload = read(
  "components/studio/my-creations/edit/creationEditPayloads.js"
);
assert.match(savePayload, /normalizePoseDataForPersistence/);
assert.match(savePayload, /normalizedType === "POSE"/);

const createViewModel = read(
  "components/studio/create/assets/asset-builder/useAssetBuilderViewModel.js"
);
assert.match(createViewModel, /normalizePoseDataForPersistence/);
assert.match(createViewModel, /updatePoseSemanticField/);
assert.match(createViewModel, /poseEditorProps/);
assert.match(createViewModel, /"POSE",\s*\n\s*"LOCATION"/);

const shell = read("components/studio/create/assets/AssetBuilderShell.jsx");
for (const component of [
  "PoseIdentitySection",
  "PoseBodyPositionSection",
  "PoseMotionStagingSection",
  "PosePromptGuidanceSection",
]) {
  assert.match(shell, new RegExp(component));
}
assert.match(shell, /poseEditorContent/);

const bodyView = read(
  "components/studio/my-creations/edit/sections/poses/pose-body-position-section/PoseBodyPositionSection.view.jsx"
);
assert.match(bodyView, /SelectField/);
assert.match(bodyView, /postureOptions/);
assert.match(bodyView, /bodyOrientationOptions/);

const stagingView = read(
  "components/studio/my-creations/edit/sections/poses/pose-motion-staging-section/PoseMotionStagingSection.view.jsx"
);
assert.match(stagingView, /energyOptions/);
assert.match(stagingView, /viewerRelationOptions/);

const promptView = read(
  "components/studio/my-creations/edit/sections/poses/pose-prompt-guidance-section/PosePromptGuidanceSection.view.jsx"
);
assert.match(promptView, /Semantic Suggestion/);
assert.match(promptView, /Use semantic suggestion/);

console.log("poseSemantics diagnostics passed");
