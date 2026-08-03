import {
  contentRatingOptions,
  initialForm,
  playerCharacterOptions,
  roomModeOptions,
  visibilityOptions,
} from "../constants";
import { buildRoomTemplateBuilderSummaryFixture } from "./RoomTemplateBuilder.contract";

const noop = () => {};

const baseForm = {
  ...initialForm,
  title: "The Cat Warmech Built",
  public_description:
    "A fixture-driven Story package with a selected cast, scenario, narrator, and opening message.",
  tags: "aethelgard, adventure, group",
  public_opening_context:
    "The workshop doors are already open, and something impossible is ticking under the central bench.",
  private_room_guidance:
    "Let character agency drive the scene. Surface registry context only when relevant.",
};

const selectedCharacters = [
  {
    id: "character-kessa",
    title: "Kessa Cindervell",
    subtitle: "Artificer",
    initial: "K",
  },
  {
    id: "character-warmech",
    title: "Warmech",
    subtitle: "Arcane-industrial construct",
    initial: "W",
  },
];

const selectedScenario = {
  id: "scenario-workshop",
  title: "The Missing Tuning Gear",
  subtitle: "Investigation",
};

const selectedNarrator = {
  id: "narrator-aethelgard",
  title: "Aethelgard Storyteller",
  subtitle: "Guided fantasy narration",
};

const selectedLocation = {
  id: "location-workshop",
  title: "The Brasswhisker's Workshop",
  subtitle: "Old Crescent",
};

function buildBaseFixture(overrides = {}) {
  return {
    form: baseForm,
    completion: 78,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    referenceLoadError: "",
    effectiveTurnBased: false,
    selectedScenario,
    selectedNarrator,
    selectedLocation,
    showScenarioRecommendations: false,
    summaryProps: buildRoomTemplateBuilderSummaryFixture({
      characterCount: selectedCharacters.length,
      scenarioTitle: selectedScenario.title,
      narratorTitle: selectedNarrator.title,
      locationTitle: selectedLocation.title,
    }),
    selectedCharactersPanelProps: {
      characters: selectedCharacters,
      onOpenCharacterPicker: noop,
      onRemoveCharacter: noop,
    },
    scenarioRecommendationsPanelProps: {
      requiredCharacterTitles: ["Kessa Cindervell"],
      optionalCharacterTitles: ["Warmech"],
      suggestedLocationTitle: selectedLocation.title,
      suggestedNarratorTitle: selectedNarrator.title,
      suggestedNpcRegistryTitles: ["Old Crescent Residents"],
      canApplyRequiredCharacters: true,
      canApplyOptionalCharacters: true,
      canApplySuggestedLocation: true,
      canApplySuggestedNarrator: true,
      canApplySuggestedNpcRegistries: true,
      onApplyAll: noop,
      onApplyRequiredCharacters: noop,
      onApplyOptionalCharacters: noop,
      onApplySuggestedLocation: noop,
      onApplySuggestedNarrator: noop,
      onApplySuggestedNpcRegistries: noop,
      onSkipRecommendations: noop,
    },
    invitedPlayersPanelProps: {
      invitedPlayers: [],
      loadError: "",
      onOpenPlayerPicker: noop,
      onRemovePlayer: noop,
    },
    openingMessageCards: [
      {
        id: "message-1",
        messageLabel: "Opening Message 1",
        speakerValue: "Narrator",
        speakerOptions: [
          { value: "Narrator", label: "Narrator" },
          { value: "Kessa Cindervell", label: "Kessa Cindervell" },
          { value: "Warmech", label: "Warmech" },
          { value: "Player Prompt", label: "Player Prompt" },
        ],
        bodyValue:
          "The brass compass spins toward a door that was not there a moment ago.",
        canRemove: false,
        onChangeSpeaker: noop,
        onChangeBody: noop,
        onRemoveMessage: noop,
      },
    ],
    displayMediaSlot: 0,
    visibilityOptions,
    contentRatingOptions,
    roomModeOptions,
    playerCharacterOptions,
    runtimeAttachmentsContent: null,
    onUpdateField: noop,
    onToggleTurnBased: noop,
    onOpenScenarioPicker: noop,
    onOpenNarratorPicker: noop,
    onOpenLocationPicker: noop,
    onAddOpeningMessage: noop,
    onSelectDisplayMediaSlot: noop,
    onSave: noop,
    ...overrides,
  };
}

export const roomTemplateBuilderReferenceFixture = buildBaseFixture();

export const roomTemplateBuilderRecommendationsFixture = buildBaseFixture({
  showScenarioRecommendations: true,
});

export const roomTemplateBuilderMultiplayerFixture = buildBaseFixture({
  form: {
    ...baseForm,
    turn_based: true,
  },
  effectiveTurnBased: true,
  invitedPlayersPanelProps: {
    invitedPlayers: [
      {
        id: "player-1",
        username: "aethelgard_guest",
        avatarUrl: null,
        displayInitial: "A",
      },
    ],
    loadError: "",
    onOpenPlayerPicker: noop,
    onRemovePlayer: noop,
  },
});

export const roomTemplateBuilderSavingFixture = buildBaseFixture({
  saveStatus: "saving",
  saveDisabled: true,
});

export const roomTemplateBuilderErrorFixture = buildBaseFixture({
  saveStatus: "error",
  saveMessage: "Room template draft could not be saved.",
});
