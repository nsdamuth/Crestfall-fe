export const narratorPresentationModuleScopeLegacySelectionFixture =
  Object.freeze({
    selectedModules: {
      prose_style: "literary",
      detail_level: "rich",
      pacing: "slow_burn",
      dialogue_style: "dramatic",
      knowledge_behavior:
        "mystery_preserving",
      atmosphere: "noir",
    },

    responseDirection: {
      auto_responder_mode:
        "NARRATOR_PRIMARY",
      portrayal_mode:
        "ENSEMBLE",
      ensemble_character_limit: 3,
    },
  });

export const narratorPresentationModuleScopeInvalidSelectionFixture =
  Object.freeze({
    selectedModules: {
      prose_style:
        "not-a-real-module",
      detail_level: "",
      pacing: "fast",
      atmosphere:
        "not-a-real-atmosphere",
    },

    responseDirection: {},
  });

export const narratorPresentationModuleScopeCanonicalFixture =
  Object.freeze({
    selectedModules: {
      prose_style: "direct",
      detail_level: "minimal",
      pacing: "balanced",
      atmosphere: "whimsical",
    },

    responseDirection: {
      auto_responder_mode:
        "ADAPTIVE_CAST",
      portrayal_mode:
        "SCENE_ONLY",
      ensemble_character_limit: 2,
    },
  });
