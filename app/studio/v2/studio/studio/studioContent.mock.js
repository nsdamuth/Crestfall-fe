// Stand-in content for the Studio hub (docs/STUDIO-SPEC.md section 3.1,
// docs/SPRINT-H-PLAN.md section 5, docs/BUILD-BLUEPRINT.md 3.1 row 6),
// same precedent as Home's homeContent.mock.js (CR-029), Adventures'
// adventuresContent.mock.js (CR-023), and Lore's loreContent.mock.js:
// a stand-in module, no CR filed this wave (the hub's copy is static,
// not a fetched feed). Art reused from the existing
// public/tmp-mockup-images sample set; no new art acquired this wave.

export const STUDIO_LEVELS = [
  {
    id: "quickStart",
    numeral: "I",
    title: "Quick Start",
    description: "Make assets, characters, places, outfits, and test them in a quick chat.",
    depth: 1,
  },
  {
    id: "guidedBuild",
    numeral: "II",
    title: "Guided Build",
    description: "Gather your assets into a Story and play it tonight.",
    depth: 2,
  },
  {
    id: "fullStudio",
    numeral: "III",
    title: "Full Studio",
    description: "Every builder and registry, pro density. Publish a Story and it becomes an Adventure.",
    depth: 3,
  },
];

// Quick Start doors, asset-first (docs/_legacy-reference proof,
// docs/STUDIO-SPEC.md section 3.1). Character is the only live door
// (docs/STUDIO-SPEC.md section 3.2); every other type has no
// allocation yet (docs/STUDIO-SPEC.md section 9, item 2) and renders
// the standing Soon treatment.
export const STUDIO_DOORS = [
  {
    id: "character",
    label: "Character",
    eyebrow: "Living presence",
    description: "An NPC, companion, villain, ally, or interactive character for story rooms and roleplay.",
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/Lux.png"),
    isLive: true,
  },
  {
    id: "playerCharacter",
    label: "Player Character",
    eyebrow: "Your identity",
    description: "A private or public player identity to bring into stories, rooms, and future image generation.",
    imageSrc: encodeURI("/tmp-mockup-images/alpha-test-creator-images/rev.png"),
    isLive: false,
  },
  {
    id: "location",
    label: "Location",
    eyebrow: "World space",
    description: "A place that can be used in stories, image prompts, rooms, and canon submissions.",
    imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/athelgard-ampitheater-profile.png"),
    isLive: false,
  },
  {
    id: "outfit",
    label: "Outfit / Clothing",
    eyebrow: "Visual asset",
    description: "Reusable clothing, armor, uniforms, costumes, and outfit presets for characters.",
    imageSrc: encodeURI("/tmp-mockup-images/alpha-test-creator-images/whiteviolin.png"),
    isLive: false,
  },
];

// Full Studio tool groups, condensed from the proof's five groups to
// three representative ones. Every card is Soon except Character
// (docs/STUDIO-SPEC.md section 3.1, item 3: "no door routes to an
// old-system page," applied here to tool cards by the same rule).
export const STUDIO_TOOL_GROUPS = [
  {
    id: "people",
    title: "People, identities, clothing, and poses",
    description: "The people, player identities, clothing sets, and reusable visual ingredients used throughout Crestfall.",
    cards: [
      {
        id: "character",
        title: "Character",
        description: "An NPC, companion, villain, ally, or interactive character for story rooms and roleplay.",
        isLive: true,
      },
      {
        id: "playerCharacter",
        title: "Player Character",
        description: "A private or public player identity for stories, rooms, and future image generation.",
        isLive: false,
      },
      {
        id: "outfit",
        title: "Outfit / Clothing",
        description: "Reusable clothing, armor, uniforms, costumes, and outfit presets.",
        isLive: false,
      },
      {
        id: "wardrobe",
        title: "Wardrobe",
        description: "A reusable wardrobe of outfit presets with default and contextual clothing rules.",
        isLive: false,
      },
      {
        id: "pose",
        title: "Pose",
        description: "Reusable pose logic for image generation, character cards, and visual scenes.",
        isLive: false,
      },
    ],
  },
  {
    id: "scenariosStories",
    title: "Scenarios, narrators, and Stories",
    description: "Opening situations, narrator voices, and the Stories that gather your assets into something playable.",
    cards: [
      {
        id: "scenario",
        title: "Scenario",
        description: "A reusable scene, premise, encounter, or opening situation for roleplay sessions.",
        isLive: false,
      },
      {
        id: "narrator",
        title: "Narrator",
        description: "A narrator style for tone, pacing, prose behavior, and scene presentation.",
        isLive: false,
      },
      {
        id: "story",
        title: "Story",
        description: "Gather characters, locations, outfits, and scenarios into one Story, then play it. Publish it and it becomes an Adventure.",
        isLive: false,
      },
    ],
  },
  {
    id: "worldContinuity",
    title: "Places, factions, events, and the continuity spine",
    description: "The recurring world elements and structured continuity registries that persist across rooms and sessions.",
    cards: [
      {
        id: "location",
        title: "Location",
        description: "A place usable in stories, image prompts, rooms, and canon submissions.",
        isLive: false,
      },
      {
        id: "npcRegistry",
        title: "NPC Registry",
        description: "A reusable NPC relationship, alias, faction, and knowledge registry, a master continuity graph for story rooms.",
        isLive: false,
      },
      {
        id: "factionRegistry",
        title: "Faction Registry",
        description: "A faction-continuity spine for alliances, rivalries, territory, influence, leadership, and pressure.",
        isLive: false,
      },
    ],
  },
];

export const STUDIO_HUB_EXPLAINER = {
  title: "Everything here starts private.",
  body: "Publish finished work to the community as Public, or submit your best into Canon for review. Nothing leaves your Vault until you say so.",
};

export const STUDIO_STORY_BRIDGE = {
  title: "Then gather what you make into a Story.",
  body: "Add characters, locations, and outfits to a Story, then play it. Publish a Story and it becomes an Adventure.",
  actionLabel: "Add to a Story",
};

export const STUDIO_GUIDED_BUILD_SOON = {
  title: "Guided Build is not open yet.",
  body: "Gathering your assets into a Story and playing it tonight is coming; there is no Story builder to hand this level to yet.",
};

export const STUDIO_BOTTOM_BANNER = {
  eyebrow: "Give them a face",
  title: "See your characters in full color.",
  line: "The Image Studio turns any character, outfit, or scene into finished art in moments.",
  ctaLabel: "Open the Image Studio",
  imageSrc: encodeURI("/tmp-mockup-images/canon-character-images/lilith-lux-eden-confrontation.png"),
  route: "/studio/v2/images",
};
