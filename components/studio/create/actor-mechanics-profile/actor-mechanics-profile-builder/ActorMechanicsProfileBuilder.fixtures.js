export const ACTOR_MECHANICS_PROFILE_BUILDER_FIXTURES = Object.freeze({
  custom: {
    title: "Adventurer Actor Mechanics Profile",
    description:
      "A reusable actor-scoped package for important adventuring characters.",
    visibility: "PRIVATE",
    contentRating: "SFW",
    actorMechanicsProfile: {
      presetId: "CUSTOM",
      title: "Adventurer",
      summary:
        "Actor-scoped stats, skills, abilities, wallet, and inventory definitions.",
      owner: {
        bindingMode: "UNBOUND_TEMPLATE",
        ownerType: "CHARACTER",
      },
      bindings: [],
    },
  },
  fullPlayerCharacter: {
    title: "Full Player Character Profile",
    description:
      "A reusable complete Player Character mechanics package.",
    visibility: "PRIVATE",
    contentRating: "SFW",
    actorMechanicsProfile: {
      presetId: "FULL_PLAYER_CHARACTER",
      title: "Full Player Character",
      owner: {
        bindingMode: "UNBOUND_TEMPLATE",
        ownerType: "PLAYER_CHARACTER",
      },
    },
  },
});
