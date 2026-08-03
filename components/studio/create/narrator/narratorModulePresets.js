export const narratorModuleGroups = [
  {
    id: "prose_style",
    label: "Prose Style",
    description: "Controls the narrator’s sentence style and descriptive voice.",
    modules: [
      {
        id: "cinematic",
        title: "Cinematic",
        body: "Scene-forward, visual, dramatic, and composed like a film sequence.",
      },
      {
        id: "literary",
        title: "Literary",
        body: "Elegant, reflective, and prose-rich without becoming purple.",
      },
      {
        id: "sensory_rich",
        title: "Sensory Rich",
        body: "Leans into scent, texture, sound, light, atmosphere, and physical sensation.",
      },
      {
        id: "direct",
        title: "Direct",
        body: "Clear, clean, efficient narration with minimal ornament.",
      },
    ],
  },
  {
    id: "detail_level",
    label: "Detail Level",
    description: "Controls how much detail the narrator tends to include.",
    modules: [
      {
        id: "minimal",
        title: "Minimal",
        body: "Short, light narration that leaves more room for dialogue and player action.",
      },
      {
        id: "balanced",
        title: "Balanced",
        body: "Moderate detail with enough description to ground scenes without slowing play.",
      },
      {
        id: "rich",
        title: "Rich",
        body: "More descriptive texture, emotional detail, and environmental grounding.",
      },
      {
        id: "lavish",
        title: "Lavish",
        body: "Highly detailed, atmospheric narration for slower, more immersive scenes.",
      },
    ],
  },
  {
    id: "pacing",
    label: "Pacing",
    description: "Controls how quickly scenes move and how much the narrator lingers.",
    modules: [
      {
        id: "fast",
        title: "Fast",
        body: "Moves quickly through setup and keeps scenes action-forward.",
      },
      {
        id: "balanced",
        title: "Balanced",
        body: "Keeps scenes moving while allowing room for atmosphere and character beats.",
      },
      {
        id: "slow_burn",
        title: "Slow Burn",
        body: "Lingers on tension, mood, gradual reveals, and emotional build-up.",
      },
      {
        id: "scene_heavy",
        title: "Scene Heavy",
        body: "Prioritizes environment, staging, and moment-to-moment scene texture.",
      },
    ],
  },
  {
    id: "dialogue_style",
    label: "Dialogue Style",
    description: "Controls how dialogue is framed and supported.",
    modules: [
      {
        id: "naturalistic",
        title: "Naturalistic",
        body: "Dialogue sounds grounded, conversational, and character-driven.",
      },
      {
        id: "dramatic",
        title: "Dramatic",
        body: "Dialogue carries stronger emotional weight, tension, and theatrical timing.",
      },
      {
        id: "subtle",
        title: "Subtle",
        body: "Uses implication, pauses, indirect meaning, and social pressure.",
      },
      {
        id: "banter",
        title: "Banter",
        body: "Supports playful exchanges, teasing, wit, and quick back-and-forth.",
      },
    ],
  },
  {
    id: "knowledge_behavior",
    label: "Knowledge Behavior",
    description: "Controls how much the narrator protects mystery and NPC knowledge limits.",
    modules: [
      {
        id: "loose",
        title: "Loose",
        body: "Allows easier exposition and smoother explanation when useful.",
      },
      {
        id: "moderate",
        title: "Moderate",
        body: "Balances clarity with mystery and character-limited knowledge.",
      },
      {
        id: "strict",
        title: "Strict",
        body: "NPCs should only know what they could reasonably know or witness.",
      },
      {
        id: "mystery_preserving",
        title: "Mystery Preserving",
        body: "Truth emerges through fragments, contradiction, implication, and discovery.",
      },
    ],
  },
  {
    id: "atmosphere",
    label: "Atmosphere",
    description: "Controls the emotional and genre flavor of scenes.",
    modules: [
      {
        id: "adventurous",
        title: "Adventurous",
        body: "Wonder, danger, travel, discovery, and forward motion.",
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
