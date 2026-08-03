const baseMutualPlayers = [
  {
    id: "player-1",
    username: "ember_archivist",
    tagline: "Keeper of forbidden maps",
    description: "A mutual follower who favors investigative fantasy.",
    imageUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%231a1511'/%3E%3Ccircle cx='300' cy='270' r='130' fill='%23765b35'/%3E%3Cpath d='M120 800c20-220 340-220 360 0' fill='%23473526'/%3E%3C/svg%3E",
    isSelected: true,
  },
  {
    id: "player-2",
    username: "moonlit_scribe",
    tagline: "Collaborative gothic storyteller",
    description: "A mutual follower interested in ensemble scenes.",
    imageUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%230d1320'/%3E%3Ccircle cx='300' cy='270' r='130' fill='%23596682'/%3E%3Cpath d='M120 800c20-220 340-220 360 0' fill='%232e3b52'/%3E%3C/svg%3E",
    isSelected: false,
  },
  {
    id: "player-3",
    username: "ironwood_bard",
    tagline: "Adventure and character drama",
    description: "A mutual follower who enjoys long-running campaigns.",
    imageUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='600' height='800' fill='%23101a14'/%3E%3Ccircle cx='300' cy='270' r='130' fill='%235d704f'/%3E%3Cpath d='M120 800c20-220 340-220 360 0' fill='%2332442f'/%3E%3C/svg%3E",
    isSelected: false,
  },
];

const baseFixture = {
  sectionEyebrow: "Story Editor",
  sectionTitle: "Players and Turn Order",
  sectionDescription:
    "Invite mutual followers for future multiplayer rooms. Multiplayer rooms are always turn-based.",
  turnBasedLabel: "Turn-Based Room",
  effectiveTurnBased: true,
  turnBasedDescription:
    "Turn-based mode is enabled. Player turns and NPC response cycles can be handled by the room runtime later.",
  showTurnBasedRequiredMessage: true,
  turnBasedRequiredMessage:
    "Multiplayer invitees are selected, so turn-based mode is required.",
  inviteesLabel: "Multiplayer Invitees",
  inviteesDescription:
    "Only mutual followers can be selected. Invites will require approval later.",
  addPlayerLabel: "Add Player",
  invitedPlayers: [
    {
      id: "player-1",
      username: "ember_archivist",
      avatarUrl: null,
      displayInitial: "E",
      statusLabel: "Pending invite later",
      removeAriaLabel: "Remove ember_archivist",
    },
  ],
  inviteeStatusLabel: "Pending invite later",
  emptyInviteesMessage: "No multiplayer invitees selected.",
  mutualLoadError: "",
  mutualPlayers: baseMutualPlayers,
  pickerEyebrow: "Multiplayer Picker",
  pickerTitle: "Select Players",
  pickerDescription:
    "Choose mutual followers. Invites will become real pending invitations later.",
  pickerSearchPlaceholder: "Search mutual followers...",
  pickerUserLabel: "User",
  pickerSelectedLabel: "Selected",
  pickerEmptyTitle: "No mutual followers found",
  pickerEmptyDescription:
    "Only users who follow you and whom you also follow can be invited.",
  onToggleTurnBased: null,
  onToggleInvitedPlayer: null,
  onRemoveInvitedPlayer: null,
};

export const roomTemplateMultiplayerSectionDefaultFixture = {
  ...baseFixture,
};

export const roomTemplateMultiplayerSectionFreeformFixture = {
  ...baseFixture,
  effectiveTurnBased: false,
  turnBasedDescription:
    "Freeform mode. Players can choose who responds until turn-based mode is enabled.",
  showTurnBasedRequiredMessage: false,
  invitedPlayers: [],
  mutualPlayers: baseMutualPlayers.map((player) => ({
    ...player,
    isSelected: false,
  })),
};

export const roomTemplateMultiplayerSectionSeveralInviteesFixture = {
  ...baseFixture,
  invitedPlayers: [
    baseFixture.invitedPlayers[0],
    {
      id: "player-2",
      username: "moonlit_scribe",
      avatarUrl: baseMutualPlayers[1].imageUrl,
      displayInitial: "M",
      statusLabel: "Pending invite later",
      removeAriaLabel: "Remove moonlit_scribe",
    },
  ],
  mutualPlayers: baseMutualPlayers.map((player) => ({
    ...player,
    isSelected: player.id === "player-1" || player.id === "player-2",
  })),
};

export const roomTemplateMultiplayerSectionLoadErrorFixture = {
  ...baseFixture,
  mutualLoadError: "Mutual followers could not be loaded.",
};

export const roomTemplateMultiplayerSectionNoMutualsFixture = {
  ...baseFixture,
  invitedPlayers: [],
  mutualPlayers: [],
  showTurnBasedRequiredMessage: false,
};

export const roomTemplateMultiplayerSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Players and Turn Order for a Long-Running Collaborative Story Room",
  sectionDescription:
    "Invite mutual followers for a future multiplayer Story with persistent participants, deliberate turn-taking, narrator-managed response cycles, and long-running collaborative scenes.",
  invitedPlayers: [
    {
      id: "player-long",
      username: "the_exceptionally_long_mutual_follower_username",
      avatarUrl: null,
      displayInitial: "T",
      statusLabel: "Pending invite approval during future multiplayer rollout",
      removeAriaLabel:
        "Remove the_exceptionally_long_mutual_follower_username",
    },
  ],
  mutualPlayers: [
    {
      id: "player-long",
      username: "the_exceptionally_long_mutual_follower_username",
      tagline:
        "Collaborative storyteller specializing in intricate ensemble casts and extended political fantasy chronicles",
      description:
        "A long-content fixture for testing search, card clamping, picker layout, and narrow-screen wrapping.",
      imageUrl: baseMutualPlayers[0].imageUrl,
      isSelected: true,
    },
  ],
};

export const roomTemplateMultiplayerSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Story Package",
  sectionTitle: "Multiplayer Setup",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  turnBasedLabel: "Structured Turns",
  inviteesLabel: "Invited Collaborators",
  addPlayerLabel: "Choose Collaborator",
};

export const roomTemplateMultiplayerSectionMissingCallbacksFixture = {
  ...baseFixture,
  onToggleTurnBased: null,
  onToggleInvitedPlayer: null,
  onRemoveInvitedPlayer: null,
};
