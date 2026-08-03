import {
  contentRatingOptions,
  middlewareModules,
  participantModeOptions,
  storyCircleSteps,
  toneOptions,
  visibilityOptions,
} from "../constants";
import { SCENARIO_BUILDER_INITIAL_MODULES } from "./useScenarioBuilderViewModel";

const noop = () => {};

function reference(id, title, type) {
  return {
    id,
    title,
    type,
    subtitle: "Fixture reference",
    contentRating: "SFW",
    imageUrl: null,
  };
}

function buildReferenceFields(populated = true) {
  const fields = [
    ["required-characters", "Required Characters", "Characters required for this scenario to function."],
    ["optional-characters", "Optional Characters", "Characters that fit well but are not required."],
    ["suggested-location", "Suggested Location", "Select one LOCATION creation for this scenario."],
    ["suggested-narrator", "Suggested Narrator", "Select one NARRATOR creation for this scenario."],
    ["suggested-npc-registries", "Suggested NPC Registries", "NPC Registries recommended for Stories using this Scenario."],
    ["attached-faction-registries", "Attached Faction Registries", "Authoritative political and territorial context."],
    ["attached-organization-registries", "Attached Organization Registries", "Authoritative institutional context."],
  ];

  return fields.map(([id, label, description], index) => ({
    id,
    label,
    description,
    selectedItems:
      populated && index < 4
        ? [reference(`fixture-${index + 1}`, ["Kessa Cindervell", "Avarra Kain", "The Prism-Weave of Aethelgard", "Lanternkeeper Narrator"][index], ["CHARACTER", "CHARACTER", "LOCATION", "NARRATOR"][index])]
        : [],
    onOpen: noop,
    onRemove: noop,
  }));
}

const configuredForm = {
  title: "The Clockwork Debt",
  public_description:
    "A dangerous bargain draws the cast into a shifting Aethelgard market where every favor has a visible price.",
  tone: "MYSTERY",
  participant_mode: "GROUP_CAPABLE",
  opening_scene: "A brass ledger begins writing names no one recognizes.",
  opening_messages: "Narrator: The market bells ring thirteen times.",
  private_runtime_guidance:
    "Preserve player agency and let the debt reveal itself through consequences.",
  drift_fixes: "Return pressure to the ledger, bargain, or missing witness.",
  failure_handling: "Failed bargains create alternate costs rather than dead ends.",
  tags: "mystery, bargain, aethelgard",
  visibility: "PRIVATE",
  content_rating: "SFW",
};

const configuredCircle = Object.fromEntries(
  storyCircleSteps.map((step, index) => [
    step.id,
    index < 5 ? `${step.title} fixture guidance.` : "",
  ])
);

function buildFixture(overrides = {}) {
  return {
    form: configuredForm,
    circle: configuredCircle,
    enabledModules: { ...SCENARIO_BUILDER_INITIAL_MODULES },
    completion: 72,
    storyCircleSteps,
    middlewareModules,
    toneOptions,
    participantModeOptions,
    visibilityOptions,
    contentRatingOptions,
    referenceFields: buildReferenceFields(true),
    referenceLoadError: "",
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    onUpdateField: noop,
    onUpdateCircle: noop,
    onToggleModule: noop,
    onSave: noop,
    ...overrides,
  };
}

export const scenarioBuilderConfiguredFixture = buildFixture();

export const scenarioBuilderEmptyFixture = buildFixture({
  form: {
    ...configuredForm,
    title: "",
    public_description: "",
    tone: "",
    opening_scene: "",
    opening_messages: "",
    private_runtime_guidance: "",
    drift_fixes: "",
    failure_handling: "",
    tags: "",
  },
  circle: Object.fromEntries(storyCircleSteps.map((step) => [step.id, ""])),
  referenceFields: buildReferenceFields(false),
  completion: 8,
});

export const scenarioBuilderReferenceErrorFixture = buildFixture({
  referenceLoadError: "Creation references could not be loaded.",
  referenceFields: buildReferenceFields(false),
});

export const scenarioBuilderSavingFixture = buildFixture({
  saveStatus: "saving",
  saveDisabled: true,
});

export const scenarioBuilderSavedFixture = buildFixture({
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const scenarioBuilderErrorFixture = buildFixture({
  saveStatus: "error",
  saveMessage: "Scenario draft could not be saved.",
});
