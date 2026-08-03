const visibilityOptions = [
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];

const contentRatingOptions = [
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
];

const roomModeOptions = [
  { value: "SOLO", label: "Solo / One-on-one" },
  { value: "GROUP", label: "Group Chat" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const playerCharacterOptions = [
  { value: "DISABLED", label: "Do not use Player Character" },
  { value: "OPTIONAL", label: "Optional Player Character" },
  { value: "RECOMMENDED", label: "Recommended Player Character" },
];

const initialForm = {
  title: "",
  public_description: "",
  room_mode: "GROUP",
  player_character_mode: "OPTIONAL",
  visibility: "PRIVATE",
  content_rating: "SFW",
  tags: "",
  turn_based: false,
  scenario_id: "",
  narrator_id: "",
  location_id: "",

  private_room_guidance: "",
  public_opening_context: "",
  rulesCodexIds: [],
  rulesCodexLinks: [],
};

const initialOpeningMessages = [
  {
    id: "message-1",
    speaker: "Narrator",
    body: "",
  },
];

export { visibilityOptions,
            contentRatingOptions,
            roomModeOptions,
            playerCharacterOptions,
            initialForm,
            initialOpeningMessages
}