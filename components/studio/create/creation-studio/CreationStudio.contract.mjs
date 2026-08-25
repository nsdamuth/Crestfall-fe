export const CREATION_STUDIO_EXPERIENCE_VERSION =
  "creation_studio_experience_v2";

export const CREATION_STUDIO_MODE_STORAGE_KEY =
  "crestfall.creationStudio.mode.v1";

export const CREATION_STUDIO_MODES = Object.freeze({
  QUICK: "QUICK",
  GUIDED: "GUIDED",
  FULL: "FULL",
});

export const LORE_CREATION_ASSET = Object.freeze({
  title: "Lore Asset",
  description:
    "Author a structured, shareable sourcebook publication with chapters, Character references, and library images.",
  href: "/studio/create/lore",
  image: "/assets/covers/crestfall-book-cover.png",
  eyebrow: "World Publication",
  disabled: false,
});

export const CREATION_STUDIO_MODE_OPTIONS = Object.freeze([
  {
    id: CREATION_STUDIO_MODES.QUICK,
    label: "Quick Start",
    description: "The four fastest ways to begin creating in Crestfall.",
  },
  {
    id: CREATION_STUDIO_MODES.GUIDED,
    label: "Guided Build",
    description: "A recommended path from first Character to a complete toolkit foundation.",
  },
  {
    id: CREATION_STUDIO_MODES.FULL,
    label: "Full Studio",
    description: "Every builder, registry, template, and mechanics tool.",
  },
]);

export const QUICK_START_ASSET_TITLES = Object.freeze([
  "Character",
  "Player Character",
  "Location",
  "Outfit / Clothing",
]);

export const GUIDED_BUILD_STEPS = Object.freeze([
  {
    id: "CHARACTER",
    number: 1,
    title: "Create a Character",
    assetTitle: "Character",
    creationTypes: ["CHARACTER"],
    requiredCount: 1,
    eyebrow: "People First",
    why:
      "Characters are the heart of Crestfall. They give future locations, scenarios, and stories someone to revolve around.",
    next:
      "Once you have a Character, Crestfall will recommend a place for them to exist.",
    optionalAssetTitles: [],
  },
  {
    id: "LOCATION",
    number: 2,
    title: "Create a Location",
    assetTitle: "Location",
    creationTypes: ["LOCATION"],
    requiredCount: 1,
    eyebrow: "Give Them a Place",
    why:
      "Locations provide setting, visual direction, world context, and a reusable place for future sessions.",
    next:
      "Once a Location exists, define what is happening there with a Scenario.",
    optionalAssetTitles: ["Outfit / Clothing"],
  },
  {
    id: "SCENARIO",
    number: 3,
    title: "Create a Scenario",
    assetTitle: "Scenario",
    creationTypes: ["SCENARIO"],
    requiredCount: 1,
    eyebrow: "Define the Situation",
    why:
      "A Scenario establishes the opening premise, encounter, mystery, conflict, or situation that begins play.",
    next:
      "With a Character, Location, and Scenario available, you are ready to assemble a Story.",
    optionalAssetTitles: ["Player Character", "Narrator"],
  },
  {
    id: "STORY",
    number: 4,
    title: "Create a Story",
    assetTitle: "Story",
    creationTypes: ["ROOM_TEMPLATE"],
    requiredCount: 1,
    eyebrow: "Assemble the Session",
    why:
      "A Story brings your people, setting, premise, and optional runtime assets together into a reusable session blueprint.",
    next:
      "After your first Story, continue through the guided chapters to build presentation, continuity, connected stories, mechanics, and reusable assets.",
    optionalAssetTitles: [],
  },
]);

const POST_CORE_GUIDED_STEPS = Object.freeze([
  {
    id: "PLAYER_CHARACTER",
    number: 5,
    title: "Create a Player Character",
    assetTitle: "Player Character",
    creationTypes: ["PLAYER_CHARACTER"],
    requiredCount: 1,
    eyebrow: "Enter the Story",
    why:
      "A Player Character defines who you bring into Stories and gives future rooms a reusable player identity.",
    next:
      "With the cast established, begin giving Characters reusable visual presentation assets.",
  },
  {
    id: "OUTFIT",
    number: 6,
    title: "Create an Outfit",
    assetTitle: "Outfit / Clothing",
    creationTypes: ["OUTFIT"],
    requiredCount: 1,
    eyebrow: "Establish the Look",
    why:
      "Outfits make clothing reusable across Characters, images, and story contexts instead of rebuilding appearance instructions each time.",
    next:
      "Once an Outfit exists, organize clothing choices into a Wardrobe.",
  },
  {
    id: "WARDROBE",
    number: 7,
    title: "Create a Wardrobe",
    assetTitle: "Wardrobe",
    creationTypes: ["WARDROBE"],
    requiredCount: 1,
    eyebrow: "Organize Clothing",
    why:
      "A Wardrobe groups Outfit presets and defines default or contextual clothing choices for a Character.",
    next:
      "With clothing organized, add reusable body language and framing through a Pose.",
  },
  {
    id: "POSE",
    number: 8,
    title: "Create a Pose",
    assetTitle: "Pose",
    creationTypes: ["POSE"],
    requiredCount: 1,
    eyebrow: "Shape Presentation",
    why:
      "Poses provide reusable body language, composition, and framing for character cards and generated scenes.",
    next:
      "Next, define the voice that presents and paces your Story.",
  },
  {
    id: "NARRATOR",
    number: 9,
    title: "Create a Narrator",
    assetTitle: "Narrator",
    creationTypes: ["NARRATOR"],
    requiredCount: 1,
    eyebrow: "Choose the Voice",
    why:
      "A Narrator controls tone, pacing, prose behavior, and scene presentation across reusable Stories.",
    next:
      "Once the voice is established, create an Image Preset for visual consistency.",
  },
  {
    id: "IMAGE_PRESET",
    number: 10,
    title: "Create an Image Preset",
    assetTitle: "Image Preset",
    creationTypes: ["IMAGE_PRESET"],
    requiredCount: 1,
    eyebrow: "Preserve Visual Style",
    why:
      "Image Presets preserve reusable style, mood, framing, and generation direction across visual assets.",
    next:
      "Your cast and presentation foundation are ready. Expand the world with continuity registries.",
  },
  {
    id: "NPC_REGISTRY",
    number: 11,
    title: "Create an NPC Registry",
    assetTitle: "NPC Registry",
    creationTypes: ["NPC_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Organize Recurring People",
    why:
      "An NPC Registry preserves recurring people, aliases, relationships, factions, and knowledge across sessions.",
    next:
      "After organizing people, connect the places they inhabit through a Location Registry.",
  },
  {
    id: "LOCATION_REGISTRY",
    number: 12,
    title: "Create a Location Registry",
    assetTitle: "Location Registry",
    creationTypes: ["LOCATION_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Connect the World",
    why:
      "A Location Registry adds parent places, routes, ownership, common people, and continuity relationships to Locations.",
    next:
      "Once people and places are connected, define the major powers operating within them.",
  },
  {
    id: "FACTION_REGISTRY",
    number: 13,
    title: "Create a Faction Registry",
    assetTitle: "Faction Registry",
    creationTypes: ["FACTION_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Map Informal Power",
    why:
      "A Faction Registry tracks alliances, rivalries, territory, influence, leadership, and pressure between power groups.",
    next:
      "Next, define a formal institution or organized group.",
  },
  {
    id: "ORGANIZATION_REGISTRY",
    number: 14,
    title: "Create an Organization Registry",
    assetTitle: "Organization Registry",
    creationTypes: ["ORGANIZATION_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Map Institutions",
    why:
      "An Organization Registry models companies, agencies, schools, churches, teams, clubs, and other formal groups.",
    next:
      "With people, places, and groups established, preserve important objects and ownership history.",
  },
  {
    id: "ITEM_REGISTRY",
    number: 15,
    title: "Create an Item Registry",
    assetTitle: "Item Registry",
    creationTypes: ["ITEM_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Track Important Objects",
    why:
      "An Item Registry preserves artifacts, weapons, documents, props, ownership, and location history across sessions.",
    next:
      "Next, create a ledger for the incidents and history that change your world.",
  },
  {
    id: "EVENT_REGISTRY",
    number: 16,
    title: "Create an Event Registry",
    assetTitle: "Event Registry",
    creationTypes: ["EVENT_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Preserve World History",
    why:
      "An Event Registry records incidents, scandals, holidays, conflicts, consequences, and world-shaping history.",
    next:
      "Once events are tracked, define unresolved objectives and branching work through a Quest Registry.",
  },
  {
    id: "QUEST_REGISTRY",
    number: 17,
    title: "Create a Quest Registry",
    assetTitle: "Quest Registry",
    creationTypes: ["QUEST_REGISTRY"],
    requiredCount: 1,
    eyebrow: "Track Objectives",
    why:
      "A Quest Registry preserves hooks, tasks, leads, requirements, branches, rewards, and unresolved objectives.",
    next:
      "Your continuity foundation is ready. Build another Story so multiple sessions can be connected meaningfully.",
  },
  {
    id: "SECOND_STORY",
    number: 18,
    title: "Create a Second Story",
    assetTitle: "Story",
    creationTypes: ["ROOM_TEMPLATE"],
    requiredCount: 2,
    eyebrow: "Create the Next Chapter",
    why:
      "A second Story gives a Storyline two real session blueprints to connect instead of creating an empty continuity path.",
    next:
      "With at least two Stories available, connect them through a Storyline.",
  },
  {
    id: "STORYLINE",
    number: 19,
    title: "Create a Storyline",
    assetTitle: "Storyline",
    creationTypes: ["STORYLINE"],
    requiredCount: 1,
    eyebrow: "Connect Stories",
    why:
      "A Storyline orders Stories and Scenarios, preserves the same chat between them, and defines what begins next.",
    next:
      "With connected Stories established, add formal state and runtime rules.",
  },
  {
    id: "STATS_POOLS_PROFILE",
    number: 20,
    title: "Create a Stats & Pools Profile",
    assetTitle: "Stats & Pools Profile",
    creationTypes: ["STATS_POOLS_PROFILE"],
    requiredCount: 1,
    eyebrow: "Define Actor State",
    why:
      "Stats & Pools Profiles define reusable attributes, HP, stamina, mana, modifiers, and conditions.",
    next:
      "Once actor state exists, define how cumulative experience resolves into levels and tiers.",
  },
  {
    id: "PROGRESSION_PROFILE",
    number: 21,
    title: "Create a Progression Profile",
    assetTitle: "Progression Profile",
    creationTypes: ["PROGRESSION_PROFILE"],
    requiredCount: 1,
    eyebrow: "Define Actor Growth",
    why:
      "Progression Profiles define reusable cumulative-experience thresholds, level resolution, and tier ranges.",
    next:
      "Once growth is defined, author the reusable skills and proficiency ranks actors can advance.",
  },
  {
    id: "SKILLS_PROFILE",
    number: 22,
    title: "Create a Skills Profile",
    assetTitle: "Skills Profile",
    creationTypes: ["SKILLS_PROFILE"],
    requiredCount: 1,
    eyebrow: "Define Skills & Proficiencies",
    why:
      "Skills Profiles define reusable skills, proficiency ranks, point costs, and Progression prerequisites.",
    next:
      "Once skills exist, define the abilities, spells, techniques, attacks, and passives actors may reference.",
  },
  {
    id: "ABILITY_SPELL_PROFILE",
    number: 23,
    title: "Create an Ability & Spell Profile",
    assetTitle: "Ability & Spell Profile",
    creationTypes: ["ABILITY_SPELL_PROFILE"],
    requiredCount: 1,
    eyebrow: "Define Abilities & Spells",
    why:
      "Ability & Spell Profiles define reusable spells, abilities, techniques, special attacks, passives, prerequisites, costs, targeting, and use policies.",
    next:
      "Once reusable capabilities exist, define the gameplay currencies actors can own and mutate.",
  },
  {
    id: "WALLET_PROFILE",
    number: 24,
    title: "Create a Wallet Profile",
    assetTitle: "Wallet Profile",
    creationTypes: ["WALLET_PROFILE"],
    requiredCount: 1,
    eyebrow: "Define Gameplay Currency",
    why:
      "Wallet Profiles define reusable currencies, starting balances, and authored minimum and maximum balance bounds while actor balances remain isolated Story state.",
    next:
      "Once gameplay currency exists, define the commands, effects, triggers, and guards that operate on actor state.",
  },
  {
    id: "MECHANICS_MODULE",
    number: 25,
    title: "Create a Mechanics Module",
    assetTitle: "Mechanics Module",
    creationTypes: ["MECHANICS_MODULE"],
    requiredCount: 1,
    eyebrow: "Define Runtime Logic",
    why:
      "Mechanics Modules provide reusable meters, counters, flags, stages, triggers, commands, effects, and guards.",
    next:
      "Next, package stats and mechanics for a specific kind of actor.",
  },
  {
    id: "ACTOR_MECHANICS_PROFILE",
    number: 26,
    title: "Create an Actor Mechanics Profile",
    assetTitle: "Actor Mechanics Profile",
    creationTypes: ["ACTOR_MECHANICS_PROFILE"],
    requiredCount: 1,
    eyebrow: "Package Actor Mechanics",
    why:
      "An Actor Mechanics Profile combines stats, progression, skills, abilities, wallets, inventory, and mechanics bindings for actors.",
    next:
      "After the deterministic systems exist, explain their verified interpretation through a Rules Codex.",
  },
  {
    id: "RULES_CODEX",
    number: 27,
    title: "Create a Rules Codex",
    assetTitle: "Rules Codex",
    creationTypes: ["RULES_CODEX"],
    requiredCount: 1,
    eyebrow: "Explain Verified Rules",
    why:
      "A Rules Codex gives the interpretation layer scoped guidance without replacing guards, registries, state, or player agency.",
    next:
      "Your mechanics foundation is ready. Capture a successful Character structure as a reusable template.",
  },
  {
    id: "CHARACTER_TEMPLATE",
    number: 28,
    title: "Create a Character Template",
    assetTitle: "Character Template",
    creationTypes: ["CHARACTER_TEMPLATE"],
    requiredCount: 1,
    eyebrow: "Reuse What Works",
    why:
      "A Character Template turns a successful builder structure into a reusable starting point for future Characters.",
    next:
      "You now have a foundation in every major Creation Studio tool and can deepen whichever systems best serve your project.",
  },
]);

export const GUIDED_BUILD_CHAPTER_DEFINITIONS = Object.freeze([
  {
    id: "CORE_STORY_FOUNDATION",
    order: 1,
    eyebrow: "Chapter 1",
    title: "Core Story Foundation",
    description:
      "Create the minimum reusable foundation for a playable Story.",
    steps: GUIDED_BUILD_STEPS,
  },
  {
    id: "CAST_PRESENTATION",
    order: 2,
    eyebrow: "Chapter 2",
    title: "Cast & Presentation",
    description:
      "Define the player identity, reusable clothing, visual direction, narrator voice, and generation style.",
    steps: POST_CORE_GUIDED_STEPS.slice(0, 6),
  },
  {
    id: "WORLD_CONTINUITY",
    order: 3,
    eyebrow: "Chapter 3",
    title: "World & Continuity",
    description:
      "Connect recurring people, places, powers, objects, history, and objectives across sessions.",
    steps: POST_CORE_GUIDED_STEPS.slice(6, 13),
  },
  {
    id: "CONNECTED_STORIES",
    order: 4,
    eyebrow: "Chapter 4",
    title: "Connected Stories",
    description:
      "Create another reusable Story and connect multiple sessions into a continuing path.",
    steps: POST_CORE_GUIDED_STEPS.slice(13, 15),
  },
  {
    id: "RULES_MECHANICS",
    order: 5,
    eyebrow: "Chapter 5",
    title: "Rules & Mechanics",
    description:
      "Define state, runtime operations, actor packages, and verified interpretation guidance in dependency order.",
    steps: POST_CORE_GUIDED_STEPS.slice(15, 23),
  },
  {
    id: "REUSE_SCALE",
    order: 6,
    eyebrow: "Chapter 6",
    title: "Reuse & Scale",
    description:
      "Turn a successful Character structure into a reusable blueprint for faster future creation.",
    steps: POST_CORE_GUIDED_STEPS.slice(23),
  },
]);

export const FULL_STUDIO_SECTION_DEFINITIONS = Object.freeze([
  {
    id: "CHARACTERS_VISUALS",
    eyebrow: "Characters & Visual Assets",
    title: "People, Identities, Clothing, and Poses",
    description:
      "Build the people, player identities, clothing sets, and reusable visual ingredients used throughout Crestfall.",
    assetTitles: [
      "Character",
      "Player Character",
      "Outfit / Clothing",
      "Wardrobe",
      "Pose",
    ],
    defaultOpen: true,
  },
  {
    id: "STORIES_SESSIONS",
    eyebrow: "Stories & Sessions",
    title: "Scenarios, Voices, Stories, and Storylines",
    description:
      "Create opening situations, narrator voices, reusable session blueprints, and connected continuity paths.",
    assetTitles: ["Scenario", "Narrator", "Story", "Storyline", "Lore Asset"],
  },
  {
    id: "WORLDS_CONTINUITY",
    eyebrow: "Worlds & Continuity",
    title: "Places, People, Factions, Events, Quests, and Objects",
    description:
      "Define the recurring world elements and structured continuity spines that persist across rooms and sessions.",
    assetTitles: ["Location"],
    includeRegistries: true,
  },
  {
    id: "RULES_MECHANICS",
    eyebrow: "Rules & Mechanics",
    title: "State, Runtime Logic, Actor Packages, and Codices",
    description:
      "Create formal stats, progression, skills, abilities, spells, gameplay wallets, meters, commands, effects, guards, and verified interpretation guidance.",
    assetTitles: [
      "Stats & Pools Profile",
      "Progression Profile",
      "Skills Profile",
      "Ability & Spell Profile",
      "Wallet Profile",
      "Mechanics Module",
      "Actor Mechanics Profile",
      "Rules Codex",
    ],
  },
  {
    id: "TEMPLATES_GENERATION",
    eyebrow: "Templates & Generation",
    title: "Reusable Blueprints and Image Presets",
    description:
      "Create reusable starting points and generation settings for faster, more consistent creation.",
    assetTitles: ["Character Template", "Image Preset"],
  },
]);

export function normalizeCreationStudioMode(value) {
  return Object.values(CREATION_STUDIO_MODES).includes(value)
    ? value
    : CREATION_STUDIO_MODES.GUIDED;
}

export function buildCreationTypeCounts(creations = []) {
  return creations.reduce((counts, creation) => {
    const type = String(creation?.type || creation?.data?.type || "")
      .trim()
      .toUpperCase();

    if (!type) return counts;

    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
}

export function getGuidedStepCount(step, creationTypeCounts = {}) {
  return step.creationTypes.reduce(
    (total, type) => total + Number(creationTypeCounts[type] || 0),
    0
  );
}

export function isGuidedStepComplete(step, creationTypeCounts = {}) {
  return (
    getGuidedStepCount(step, creationTypeCounts) >=
    Number(step.requiredCount || 1)
  );
}

export function buildGuidedStepStates(creationTypeCounts = {}) {
  let previousStepsComplete = true;

  return GUIDED_BUILD_STEPS.map((step) => {
    const count = getGuidedStepCount(step, creationTypeCounts);
    const complete = isGuidedStepComplete(step, creationTypeCounts);
    const visible = step.number === 1 || previousStepsComplete;
    const current = visible && !complete && previousStepsComplete;

    if (!complete) {
      previousStepsComplete = false;
    }

    return {
      ...step,
      count,
      complete,
      visible,
      current,
    };
  });
}

export function buildGuidedChapterStates(creationTypeCounts = {}) {
  const coreSteps = buildGuidedStepStates(creationTypeCounts);
  const coreComplete = coreSteps.every((step) => step.complete);
  let recommendationAssigned = false;

  return GUIDED_BUILD_CHAPTER_DEFINITIONS.map((chapter, chapterIndex) => {
    const sourceSteps = chapterIndex === 0 ? coreSteps : chapter.steps;
    const visible = chapterIndex === 0 || coreComplete;

    const steps = sourceSteps.map((step) => {
      const count =
        typeof step.count === "number"
          ? step.count
          : getGuidedStepCount(step, creationTypeCounts);
      const complete =
        typeof step.complete === "boolean"
          ? step.complete
          : isGuidedStepComplete(step, creationTypeCounts);
      const stepVisible = chapterIndex === 0 ? step.visible : visible;
      const current =
        stepVisible && !complete && !recommendationAssigned;

      if (current) {
        recommendationAssigned = true;
      }

      return {
        ...step,
        count,
        complete,
        visible: stepVisible,
        current,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      };
    });

    const completedStepCount = steps.filter((step) => step.complete).length;
    const complete = steps.length > 0 && completedStepCount === steps.length;
    const current = steps.some((step) => step.current);

    return {
      ...chapter,
      visible,
      steps,
      completedStepCount,
      totalStepCount: steps.length,
      complete,
      current,
    };
  });
}

export function getFirstIncompleteGuidedStep(stepStates = []) {
  return stepStates.find((step) => step.visible && !step.complete) || null;
}

export function getRecommendedGuidedStep(chapterStates = []) {
  return (
    chapterStates
      .flatMap((chapter) => chapter.steps || [])
      .find((step) => step.current) || null
  );
}

export function getGuidedProgress(chapterStates = []) {
  const steps = chapterStates.flatMap((chapter) => chapter.steps || []);
  const completedStepCount = steps.filter((step) => step.complete).length;

  return {
    completedStepCount,
    totalStepCount: steps.length,
    coreComplete: Boolean(chapterStates[0]?.complete),
    allComplete:
      steps.length > 0 && completedStepCount === steps.length,
  };
}

export function getAssetByTitle(assets = [], title = "") {
  return assets.find((asset) => asset.title === title) || null;
}

export function getAssetsByTitle(assets = [], titles = []) {
  return titles
    .map((title) => getAssetByTitle(assets, title))
    .filter(Boolean);
}

export function buildFullStudioSections({
  creationAssets = [],
  registryTypes = [],
} = {}) {
  return FULL_STUDIO_SECTION_DEFINITIONS.map((section) => ({
    ...section,
    assets: [
      ...getAssetsByTitle(creationAssets, section.assetTitles),
      ...(section.includeRegistries ? registryTypes : []),
    ],
  }));
}
