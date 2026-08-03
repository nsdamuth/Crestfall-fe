import {
  Compass,
  Eye,
  Flag,
  KeyRound,
  Lock,
  RefreshCcw,
} from "lucide-react";

const storyCircleSteps = [
  {
    id: "you",
    label: "1. You",
    title: "Starting State",
    helper:
      "Who begins in a familiar situation? What is normal before the scenario changes?",
  },
  {
    id: "need",
    label: "2. Need",
    title: "Need / Want",
    helper:
      "What is missing, threatened, desired, unresolved, or emotionally necessary?",
  },
  {
    id: "go",
    label: "3. Go",
    title: "Crossing Point",
    helper:
      "What pulls the player or cast into unfamiliar pressure, danger, mystery, or opportunity?",
  },
  {
    id: "search",
    label: "4. Search",
    title: "Complications",
    helper:
      "What trials, investigations, choices, obstacles, or social pressures shape the middle?",
  },
  {
    id: "find",
    label: "5. Find",
    title: "Discovery",
    helper:
      "What is found, revealed, achieved, or misunderstood as apparent success?",
  },
  {
    id: "take",
    label: "6. Take",
    title: "Cost",
    helper:
      "What price, consequence, sacrifice, danger, or emotional cost follows?",
  },
  {
    id: "return",
    label: "7. Return",
    title: "Resolution Path",
    helper:
      "How does the story return toward safety, home, clarity, or a changed situation?",
  },
  {
    id: "change",
    label: "8. Change",
    title: "Meaningful Change",
    helper:
      "What changes because this scenario happened? What lesson, state, unlock, or relationship shift remains?",
  },
];

const middlewareModules = [
  {
    id: "phase_gates",
    title: "Phase Gates",
    icon: Flag,
    body:
      "Track story beats and prevent jumping to later phases before required story conditions are met.",
  },
  {
    id: "reward_gates",
    title: "Reward Gates",
    icon: KeyRound,
    body:
      "Lock rewards, codes, characters, images, or reveals until scenario conditions are completed.",
  },
  {
    id: "knowledge_boundaries",
    title: "Knowledge Boundaries",
    icon: Lock,
    body:
      "Help prevent NPCs from knowing events, secrets, or facts they have not witnessed or learned.",
  },
  {
    id: "hidden_media_unlocks",
    title: "Hidden Media Unlocks",
    icon: Eye,
    body:
      "Reveal prestaged images, scenes, or future media only when story conditions are satisfied.",
  },
  {
    id: "time_weather",
    title: "Time / Weather Support",
    icon: Compass,
    body:
      "Allow room state to track broad time, weather, atmosphere, and travel pacing later.",
  },
  {
    id: "recap_support",
    title: "Recap Support",
    icon: RefreshCcw,
    body:
      "Support structured recaps, phase summaries, and memory rollover prompts later.",
  },
];

const toneOptions = [
  { value: "", label: "Not chosen" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "MYSTERY", label: "Mystery" },
  { value: "DARK_FAIRYTALE", label: "Dark Fairytale" },
  { value: "NOIR", label: "Noir" },
  { value: "ROMANCE", label: "Romance" },
  { value: "HORROR", label: "Horror" },
  { value: "COMEDY", label: "Comedy" },
  { value: "POLITICAL_INTRIGUE", label: "Political Intrigue" },
];

const participantModeOptions = [
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "SOLO", label: "Solo" },
  { value: "GROUP_CAPABLE", label: "Group-capable" },
];

const visibilityOptions = [
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];

const contentRatingOptions = [
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
];

const initialForm = {
  title: "",
  public_description: "",
  tone: "",
  participant_mode: "FLEXIBLE",

  required_characters: [],
  optional_characters: [],
  suggested_location: null,
  suggested_narrator: null,
  suggested_npc_registries: [],

  boundRegistries: {
    factionRegistryIds: [],
    organizationRegistryIds: [],
  },

  boundRegistryLinks: {
    factionRegistries: [],
    organizationRegistries: [],
  },

  opening_scene: "",
  opening_messages: "",
  private_runtime_guidance: "",
  drift_fixes: "",
  failure_handling: "",

  tags: "",
  visibility: "PRIVATE",
  content_rating: "SFW",
};

export { storyCircleSteps,
    middlewareModules,
    toneOptions,
    participantModeOptions,
    visibilityOptions,
    contentRatingOptions,
    initialForm,
 }