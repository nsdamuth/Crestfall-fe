const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Identity",
  sectionDescription:
    "Define how this Story behaves as a reusable playable setup.",
  roomModeLabel: "Story Mode",
  playerCharacterModeLabel: "Player Character",
  tagsLabel: "Tags",
});

export const ROOM_TEMPLATE_MODE_OPTIONS = Object.freeze([
  { value: "SOLO", label: "Solo / One-on-one" },
  { value: "GROUP", label: "Group Chat" },
  { value: "FLEXIBLE", label: "Flexible" },
]);

export const ROOM_TEMPLATE_PLAYER_CHARACTER_OPTIONS = Object.freeze([
  { value: "DISABLED", label: "Do not use Player Character" },
  { value: "OPTIONAL", label: "Optional Player Character" },
  { value: "RECOMMENDED", label: "Recommended Player Character" },
]);

export function formatRoomTemplateIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseRoomTemplateIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getRoomTemplateIdentitySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    roomModeValue: data.room_mode || "GROUP",
    roomModeOptions: ROOM_TEMPLATE_MODE_OPTIONS,
    playerCharacterModeValue: data.player_character_mode || "OPTIONAL",
    playerCharacterModeOptions: ROOM_TEMPLATE_PLAYER_CHARACTER_OPTIONS,
    tagsValue: formatRoomTemplateIdentityTags(data.tags),
    onSelectRoomMode: (value) => updateDataField?.("room_mode", value),
    onSelectPlayerCharacterMode: (value) =>
      updateDataField?.("player_character_mode", value),
    onChangeTags: (value) =>
      updateDataField?.("tags", parseRoomTemplateIdentityTags(value)),
  };
}

export function useRoomTemplateIdentitySectionViewModel(props = {}) {
  return getRoomTemplateIdentitySectionViewProps(props);
}
