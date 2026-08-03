const toneOptions = [
  { value: "", label: "Not chosen" },
  { value: "CINEMATIC", label: "Cinematic" },
  { value: "LITERARY", label: "Literary" },
  { value: "DARK_FAIRYTALE", label: "Dark Fairytale" },
  { value: "NOIR", label: "Noir" },
  { value: "EPIC_FANTASY", label: "Epic Fantasy" },
  { value: "HORROR", label: "Horror" },
  { value: "ROMANTIC", label: "Romantic" },
  { value: "COMEDIC", label: "Comedic" },
  { value: "NEUTRAL", label: "Neutral" },
];

const pacingOptions = [
  { value: "", label: "Not chosen" },
  { value: "SLOW_BURN", label: "Slow Burn" },
  { value: "BALANCED", label: "Balanced" },
  { value: "FAST", label: "Fast" },
  { value: "SCENE_HEAVY", label: "Scene Heavy" },
  { value: "DIALOGUE_HEAVY", label: "Dialogue Heavy" },
];

const detailOptions = [
  { value: "", label: "Not chosen" },
  { value: "MINIMAL", label: "Minimal" },
  { value: "BALANCED", label: "Balanced" },
  { value: "RICH", label: "Rich" },
  { value: "LAVISH", label: "Lavish" },
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
  name: "",
  description: "",
  tone: "",
  pacing: "",
  detail_level: "",
  narrator_guidance: "",
  avoid_guidance: "",
  tags: "",
  visibility: "PRIVATE",
  content_rating: "SFW",
};

export {
    toneOptions,
    pacingOptions,
    detailOptions,
    visibilityOptions,
    contentRatingOptions,
    initialForm
}