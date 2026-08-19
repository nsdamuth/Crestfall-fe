export const narratorModuleGroups = [
  {
    id: "prose_style",
    label: "Prose Style",
    description:
      "Shapes story-wide non-dialogue narration, action, environment, and staging without replacing Character voice.",
    modules: [
      {
        id: "cinematic",
        title: "Cinematic",
        body: "Scene-forward, visual, dramatic, and composed through clear spatial beats.",
      },
      {
        id: "literary",
        title: "Literary",
        body: "Elegant, reflective, and prose-rich while remaining readable and interactive.",
      },
      {
        id: "sensory_rich",
        title: "Sensory Rich",
        body: "Leans into selective scent, texture, sound, light, atmosphere, and physical sensation.",
      },
      {
        id: "direct",
        title: "Direct",
        body: "Clear, clean, efficient scene prose with minimal ornament.",
      },
    ],
  },
  {
    id: "detail_level",
    label: "Detail Level",
    description:
      "Guides descriptive density for actions, environment, sensory detail, posture, reactions, and staging. It is not a word-count target and does not control how much a Character speaks.",
    modules: [
      {
        id: "minimal",
        title: "Minimal",
        body: "Uses essential physical and environmental detail while leaving most elaboration to dialogue and player action.",
      },
      {
        id: "balanced",
        title: "Balanced",
        body: "Provides enough descriptive grounding to make scenes clear and immersive without regularly lingering.",
      },
      {
        id: "rich",
        title: "Rich",
        body: "Adds more sensory, physical, environmental, and visible-reaction detail when it helps the scene.",
      },
      {
        id: "lavish",
        title: "Lavish",
        body: "Favors highly textured scene rendering and layered sensory or environmental detail when useful material is present.",
      },
    ],
  },
  {
    id: "pacing",
    label: "Pacing",
    description:
      "Guides how much forward-motion or lingering pressure the Composer applies inside each authorized post. It never overrides Scenario, Storywheel, beats, phases, mechanics, or deterministic progression.",
    modules: [
      {
        id: "fast",
        title: "Fast",
        body: "Favors prompt reactions, economical staging, and quicker movement through material already authorized for the current beat.",
      },
      {
        id: "balanced",
        title: "Balanced",
        body: "Balances forward movement with room for atmosphere, reactions, and Character beats inside the current authorized moment.",
      },
      {
        id: "slow_burn",
        title: "Slow Burn",
        body: "Lets tension, uncertainty, anticipation, and incremental reactions breathe without creating or delaying story-state transitions.",
      },
      {
        id: "scene_heavy",
        title: "Scene Heavy",
        body: "Spends more compositional attention on immediate staging, physicality, environment, and moment-to-moment scene texture.",
      },
    ],
  },
  {
    id: "atmosphere",
    label: "Atmosphere",
    description: "Controls the story-wide emotional and genre flavor of scenes.",
    modules: [
      {
        id: "adventurous",
        title: "Adventurous",
        body: "Wonder, danger, travel, discovery, and forward possibility.",
      },
      {
        id: "dark_fairytale",
        title: "Dark Fairytale",
        body: "Beautiful, strange, dangerous, symbolic, and slightly uncanny.",
      },
      {
        id: "noir",
        title: "Noir",
        body: "Suspicion, leverage, secrets, debts, shadows, and social pressure.",
      },
      {
        id: "romantic",
        title: "Romantic",
        body: "Emotional tension, intimacy, longing, attention, and charged closeness.",
      },
      {
        id: "horror",
        title: "Horror",
        body: "Dread, unease, vulnerability, threat, and controlled fear.",
      },
      {
        id: "whimsical",
        title: "Whimsical",
        body: "Playful strangeness, charm, surprise, and light magical oddity.",
      },
    ],
  },
];

export const narratorResponseDirectionDefaults =
  Object.freeze({
    auto_responder_mode:
      "ADAPTIVE_CAST",

    portrayal_mode:
      "SCENE_ONLY",

    ensemble_character_limit:
      2,
  });


export const narratorResponseDirectionGroups = [
  {
    id:
      "auto_responder_mode",

    label:
      "Primary Interaction",

    description:
      "Controls who owns ordinary AUTO responses.",

    options: [
      {
        value:
          "ADAPTIVE_CAST",

        title:
          "Adaptive Cast",

        body:
          "AUTO may choose the Narrator or an eligible active Character according to the current scene.",
      },
      {
        value:
          "NARRATOR_PRIMARY",

        title:
          "Narrator Primary",

        body:
          "AUTO returns to the Narrator. Players may still explicitly select or directly address individual Characters.",
      },
    ],
  },
  {
    id:
      "portrayal_mode",

    label:
      "Character Portrayal",

    description:
      "Controls how much authority a Narrator-owned response has over loaded Characters.",

    options: [
      {
        value:
          "SCENE_ONLY",

        title:
          "Scene Narration Only — Default",

        body:
          "Narrates environments, transitions, consequences, arrivals, and passive continuity. Named Characters retain their own dialogue and meaningful actions.",
      },
      {
        value:
          "ENSEMBLE",

        title:
          "Ensemble Narration — Opt In",

        body:
          "Allows the Narrator to portray dialogue and meaningful actions for a bounded number of active Scene Cast Characters.",
      },
    ],
  },
];


export const narratorEnsembleCharacterLimitOptions = [
  {
    value: 1,
    title: "1 Character",
  },
  {
    value: 2,
    title: "2 Characters",
  },
  {
    value: 3,
    title: "3 Characters",
  },
  {
    value: "ALL_RELEVANT",
    title: "All Relevant",
  },
];
