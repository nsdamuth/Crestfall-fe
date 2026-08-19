import {
  narratorModuleGroups as CURRENT_FE_NARRATOR_MODULE_GROUPS,
  narratorResponseDirectionDefaults,
  narratorEnsembleCharacterLimitOptions,
} from "../../narratorModulePresets.js";

import {
  NARRATOR_BUILDER_DEFAULT_MODULES,
  NARRATOR_BUILDER_VIEW_CONTRACT_VERSION,
} from "../NarratorBuilder.contract.js";

import {
  NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION,
} from "../../narrator-module-selector/NarratorModuleSelector.contract.js";

export const NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION =
  "narrator_presentation_module_scope_binding_v1";

export const NARRATOR_PRESENTATION_CANONICAL_GROUPS = Object.freeze([
  Object.freeze({
    id: "prose_style",
    label: "Prose Style",
    description:
      "Shapes story-wide non-dialogue narration, action, environment, and staging without replacing Character voice.",
    modules: Object.freeze([
      Object.freeze({
        id: "cinematic",
        title: "Cinematic",
        body:
          "Scene-forward, visual, dramatic, and composed through clear spatial beats.",
      }),
      Object.freeze({
        id: "literary",
        title: "Literary",
        body:
          "Elegant, reflective, and prose-rich while remaining readable and interactive.",
      }),
      Object.freeze({
        id: "sensory_rich",
        title: "Sensory Rich",
        body:
          "Leans into selective scent, texture, sound, light, atmosphere, and physical sensation.",
      }),
      Object.freeze({
        id: "direct",
        title: "Direct",
        body:
          "Clear, clean, efficient scene prose with minimal ornament.",
      }),
    ]),
  }),

  Object.freeze({
    id: "detail_level",
    label: "Detail Level",
    description:
      "Guides descriptive density for actions, environment, sensory detail, posture, reactions, and staging. It is not a word-count target and does not control how much a Character speaks.",
    modules: Object.freeze([
      Object.freeze({
        id: "minimal",
        title: "Minimal",
        body:
          "Uses essential physical and environmental detail while leaving most elaboration to dialogue and player action.",
      }),
      Object.freeze({
        id: "balanced",
        title: "Balanced",
        body:
          "Provides enough descriptive grounding to make scenes clear and immersive without regularly lingering.",
      }),
      Object.freeze({
        id: "rich",
        title: "Rich",
        body:
          "Adds more sensory, physical, environmental, and visible-reaction detail when it helps the scene.",
      }),
      Object.freeze({
        id: "lavish",
        title: "Lavish",
        body:
          "Favors highly textured scene rendering and layered sensory or environmental detail when useful material is present.",
      }),
    ]),
  }),

  Object.freeze({
    id: "pacing",
    label: "Pacing",
    description:
      "Guides how much forward-motion or lingering pressure the Composer applies inside each authorized post. It never overrides Scenario, Storywheel, beats, phases, mechanics, or deterministic progression.",
    modules: Object.freeze([
      Object.freeze({
        id: "fast",
        title: "Fast",
        body:
          "Favors prompt reactions, economical staging, and quicker movement through material already authorized for the current beat.",
      }),
      Object.freeze({
        id: "balanced",
        title: "Balanced",
        body:
          "Balances forward movement with room for atmosphere, reactions, and Character beats inside the current authorized moment.",
      }),
      Object.freeze({
        id: "slow_burn",
        title: "Slow Burn",
        body:
          "Lets tension, uncertainty, anticipation, and incremental reactions breathe without creating or delaying story-state transitions.",
      }),
      Object.freeze({
        id: "scene_heavy",
        title: "Scene Heavy",
        body:
          "Spends more compositional attention on immediate staging, physicality, environment, and moment-to-moment scene texture.",
      }),
    ]),
  }),

  Object.freeze({
    id: "atmosphere",
    label: "Atmosphere",
    description:
      "Controls the story-wide emotional and genre flavor of scenes.",
    modules: Object.freeze([
      Object.freeze({
        id: "adventurous",
        title: "Adventurous",
        body:
          "Wonder, danger, travel, discovery, and forward possibility.",
      }),
      Object.freeze({
        id: "dark_fairytale",
        title: "Dark Fairytale",
        body:
          "Beautiful, strange, dangerous, symbolic, and slightly uncanny.",
      }),
      Object.freeze({
        id: "noir",
        title: "Noir",
        body:
          "Suspicion, leverage, secrets, debts, shadows, and social pressure.",
      }),
      Object.freeze({
        id: "romantic",
        title: "Romantic",
        body:
          "Emotional tension, intimacy, longing, attention, and charged closeness.",
      }),
      Object.freeze({
        id: "horror",
        title: "Horror",
        body:
          "Dread, unease, vulnerability, threat, and controlled fear.",
      }),
      Object.freeze({
        id: "whimsical",
        title: "Whimsical",
        body:
          "Playful strangeness, charm, surprise, and light magical oddity.",
      }),
    ]),
  }),
]);

export const NARRATOR_PRESENTATION_CANONICAL_DEFAULTS = Object.freeze({
  prose_style: "cinematic",
  detail_level: "balanced",
  pacing: "balanced",
  atmosphere: "adventurous",
});

export const NARRATOR_PRESENTATION_RESPONSE_DIRECTION_GROUPS = Object.freeze([
  Object.freeze({
    id: "auto_responder_mode",
    label: "Primary Interaction",
    description:
      "Controls who owns ordinary AUTO responses.",
    options: Object.freeze([
      Object.freeze({
        value: "ADAPTIVE_CAST",
        title: "Adaptive Cast",
        body:
          "AUTO may choose the Narrator or an eligible active Character according to the current scene.",
      }),
      Object.freeze({
        value: "NARRATOR_PRIMARY",
        title: "Narrator Primary",
        body:
          "AUTO returns to the Narrator. Players may still explicitly select or directly address individual Characters.",
      }),
    ]),
  }),

  Object.freeze({
    id: "portrayal_mode",
    label: "Character Portrayal",
    description:
      "Controls how much authority a Narrator-owned response has over loaded Characters.",
    options: Object.freeze([
      Object.freeze({
        value: "SCENE_ONLY",
        title:
          "Scene Narration Only — Default",
        body:
          "Narrates environments, transitions, consequences, arrivals, and passive continuity. Named Characters retain their own dialogue and meaningful actions.",
      }),
      Object.freeze({
        value: "ENSEMBLE",
        title:
          "Ensemble Narration — Opt In",
        body:
          "Allows the Narrator to portray dialogue and meaningful actions for a bounded number of active Scene Cast Characters.",
      }),
    ]),
  }),
]);

export const NARRATOR_PRESENTATION_DEPRECATED_GROUPS = Object.freeze([
  Object.freeze({
    id: "dialogue_style",
    label: "Dialogue Style",
    replacementAuthority:
      "CHARACTER_VOICE_AND_VOICE_MODULES",
    reason:
      "Narrator presentation must not replace or globally prescribe named Character dialogue style.",
  }),
  Object.freeze({
    id: "knowledge_behavior",
    label: "Knowledge Behavior",
    replacementAuthority:
      "REGISTRY_RUNTIME_KNOWLEDGE_BOUNDARIES",
    reason:
      "Narrator presentation must not loosen, tighten, or replace authoritative Character and registry knowledge boundaries.",
  }),
]);

export const NARRATOR_PRESENTATION_LEGACY_TOP_LEVEL_FIELDS = Object.freeze([
  "pacing",
  "detail_level",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function canonicalGroupById(groupId) {
  return (
    NARRATOR_PRESENTATION_CANONICAL_GROUPS.find(
      (group) => group.id === groupId
    ) || null
  );
}

function normalizeCanonicalModuleSelection(
  selectedModules = {}
) {
  const source = object(selectedModules);

  return Object.fromEntries(
    NARRATOR_PRESENTATION_CANONICAL_GROUPS.map(
      (group) => {
        const requested =
          text(source[group.id]);

        const valid =
          group.modules.some(
            (module) =>
              module.id === requested
          );

        return [
          group.id,
          valid
            ? requested
            : NARRATOR_PRESENTATION_CANONICAL_DEFAULTS[
                group.id
              ],
        ];
      }
    )
  );
}

function projectModuleGroups(
  selectedModules = {}
) {
  const normalized =
    normalizeCanonicalModuleSelection(
      selectedModules
    );

  return NARRATOR_PRESENTATION_CANONICAL_GROUPS.map(
    (group) => ({
      id: group.id,
      label: group.label,
      description:
        group.description,
      modules:
        group.modules.map(
          (module) => ({
            id: module.id,
            title: module.title,
            body: module.body,
            active:
              normalized[group.id] ===
              module.id,
          })
        ),
    })
  );
}

function moduleSummaryItems(
  selectedModules = {}
) {
  const normalized =
    normalizeCanonicalModuleSelection(
      selectedModules
    );

  return NARRATOR_PRESENTATION_CANONICAL_GROUPS.map(
    (group) => {
      const moduleId =
        normalized[group.id];

      const module =
        canonicalGroupById(
          group.id
        )?.modules.find(
          (candidate) =>
            candidate.id === moduleId
        );

      return {
        id:
          `${group.id}-${moduleId}`,
        label:
          `${group.label}: ${
            module?.title ||
            moduleId
          }`,
      };
    }
  );
}

function normalizeResponseDirection(
  responseDirection = {}
) {
  return {
    ...narratorResponseDirectionDefaults,
    ...object(responseDirection),
  };
}

export function projectNarratorPresentationModuleScopeBinding({
  selectedModules = {},
  responseDirection = {},
  callbacks = {},
} = {}) {
  const callbackSource =
    object(callbacks);

  const canonicalSelection =
    normalizeCanonicalModuleSelection(
      selectedModules
    );

  const ignoredLegacySelections =
    NARRATOR_PRESENTATION_DEPRECATED_GROUPS
      .filter(
        (group) =>
          text(
            object(selectedModules)[
              group.id
            ]
          )
      )
      .map((group) => ({
        id: group.id,
        storedValue:
          text(
            object(selectedModules)[
              group.id
            ]
          ),
        ignored: true,
        replacementAuthority:
          group.replacementAuthority,
        reason:
          group.reason,
      }));

  const normalizedResponse =
    normalizeResponseDirection(
      responseDirection
    );

  return {
    bindingContractVersion:
      NARRATOR_PRESENTATION_MODULE_SCOPE_BINDING_CONTRACT_VERSION,

    narratorBuilderViewContractVersion:
      NARRATOR_BUILDER_VIEW_CONTRACT_VERSION,

    moduleSelectorViewContractVersion:
      NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION,

    canonicalSelection,

    ignoredLegacySelections,

    moduleSummaryItems:
      moduleSummaryItems(
        canonicalSelection
      ),

    moduleSelectorViewProps: {
      sectionEyebrow:
        "Story Presentation",
      sectionTitle:
        "Narrator Modules",
      sectionDescription:
        "Choose one Story Presentation module per category. These modules shape non-dialogue rendering inside material already authorized by Story state; they do not replace Character voice, knowledge boundaries, or deterministic progression.",

      responseEyebrow:
        "Response Direction",
      responseTitle:
        "Who Responds & Who the Narrator May Portray",
      responseDescription:
        "Response Direction controls ordinary AUTO ownership and the Narrator's bounded portrayal authority over active Characters.",

      responseDirectionGroups:
        NARRATOR_PRESENTATION_RESPONSE_DIRECTION_GROUPS.map(
          (group) => ({
            id: group.id,
            label: group.label,
            description:
              group.description,
            options:
              group.options.map(
                (option) => ({
                  id:
                    `${group.id}-${option.value}`,
                  value:
                    option.value,
                  title:
                    option.title,
                  body:
                    option.body,
                  active:
                    normalizedResponse[
                      group.id
                    ] === option.value,
                })
              ),
          })
        ),

      showEnsembleLimit:
        normalizedResponse.portrayal_mode ===
        "ENSEMBLE",

      ensembleLimitLabel:
        "Ensemble Character Limit",

      ensembleLimitDescription:
        "Maximum number of active Scene Cast Characters the Narrator may portray in one Narrator-owned response.",

      ensembleLimitOptions:
        narratorEnsembleCharacterLimitOptions.map(
          (option) => ({
            id:
              `ensemble-limit-${option.value}`,
            value:
              option.value,
            title:
              option.title,
            body: "",
            active:
              normalizedResponse
                .ensemble_character_limit ===
              option.value,
          })
        ),

      safeDefaultNote:
        "Scene Narration Only is the safe default. Named Characters retain their own dialogue and meaningful actions unless Ensemble Narration is explicitly enabled.",

      moduleGroups:
        projectModuleGroups(
          canonicalSelection
        ),

      onSelectResponseDirection:
        callbackSource.onSelectResponseDirection ||
        null,

      onSelectEnsembleCharacterLimit:
        callbackSource.onSelectEnsembleCharacterLimit ||
        null,

      onSelectModule:
        callbackSource.onSelectModule ||
        null,
    },

    canonicalPersistence: {
      field:
        "selected_modules",
      value:
        canonicalSelection,
      topLevelLegacyMirrorsRequired:
        false,
      excludedTopLevelLegacyFields:
        [
          ...NARRATOR_PRESENTATION_LEGACY_TOP_LEVEL_FIELDS,
        ],
    },

    scopeRules: {
      proseStyle:
        "Story-wide non-dialogue narration only; Character voice remains Character-owned.",

      detailLevel:
        "Descriptive density only; not a word-count target and not a Character speech-length control.",

      pacing:
        "Composer pressure within the currently authorized post only; cannot create, delay, skip, or override Story state transitions.",

      atmosphere:
        "Story-wide emotional/genre flavor only; does not grant knowledge, authority, or deterministic outcomes.",

      dialogueStyle:
        "Not a Narrator Presentation module. Named Character dialogue remains governed by Character voice and voice modules.",

      knowledgeBehavior:
        "Not a Narrator Presentation module. Knowledge remains governed by authoritative registry/runtime boundaries.",
    },

    visualExtensionStatus: {
      canonicalFourGroupSelector:
        "WIRED",

      deprecatedGroupRemoval:
        "WIRED",

      canonicalSummary:
        "WIRED",
    },

    architecture: {
      selectedModuleApplicationStateOwnedByChassis: true,
      responseDirectionApplicationStateOwnedByChassis: true,
      creationPayloadOwnedByChassis: true,
      persistenceOwnedByChassis: true,
      characterVoiceAuthoritySeparate: true,
      knowledgeBoundaryAuthoritySeparate: true,
      deterministicProgressionAuthoritySeparate: true,
      moduleCatalogAndCopyOwnedByFe: true,
      moduleSelectorVisualCompositionOwnedByFe: true,
    },
  };
}

export function getNarratorPresentationCurrentFeDrift() {
  const currentIds =
    CURRENT_FE_NARRATOR_MODULE_GROUPS.map(
      (group) => group.id
    );

  const canonicalIds =
    NARRATOR_PRESENTATION_CANONICAL_GROUPS.map(
      (group) => group.id
    );

  return {
    currentFeGroupIds:
      currentIds,
    canonicalGroupIds:
      canonicalIds,
    extraCurrentFeGroupIds:
      currentIds.filter(
        (id) =>
          !canonicalIds.includes(id)
      ),
    missingCurrentFeGroupIds:
      canonicalIds.filter(
        (id) =>
          !currentIds.includes(id)
      ),

    currentFeDefaultKeys:
      Object.keys(
        NARRATOR_BUILDER_DEFAULT_MODULES
      ),

    canonicalDefaultKeys:
      Object.keys(
        NARRATOR_PRESENTATION_CANONICAL_DEFAULTS
      ),
  };
}
