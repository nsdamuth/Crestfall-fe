export const ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION = "1.0";

export const ROOM_TEMPLATE_BUILDER_REQUIRED_VIEW_PROPS = Object.freeze([
  "form",
  "completion",
  "saveStatus",
  "summaryProps",
  "selectedCharactersPanelProps",
  "invitedPlayersPanelProps",
  "openingMessageCards",
  "onUpdateField",
  "onSave",
]);

export const ROOM_TEMPLATE_BUILDER_PICKER_TYPES = Object.freeze([
  "characters",
  "scenario",
  "narrator",
  "location",
  "openingLocations",
  "players",
]);

export function buildRoomTemplateBuilderSummaryFixture({
  characterCount = 0,
  scenarioTitle = "Not selected",
  narratorTitle = "Not selected",
  locationTitle = "Optional",
} = {}) {
  return {
    eyebrow: "Story",
    summaryRows: [
      {
        id: "characters",
        label: "Characters",
        value: characterCount || "None selected",
      },
      {
        id: "scenario",
        label: "Scenario",
        value: scenarioTitle,
      },
      {
        id: "narrator",
        label: "Narrator",
        value: narratorTitle,
      },
      {
        id: "location",
        label: "Location",
        value: locationTitle,
      },
    ],
  };
}

export function validateRoomTemplateBuilderViewProps(props = {}) {
  return ROOM_TEMPLATE_BUILDER_REQUIRED_VIEW_PROPS.filter(
    (key) => props[key] === undefined
  );
}
