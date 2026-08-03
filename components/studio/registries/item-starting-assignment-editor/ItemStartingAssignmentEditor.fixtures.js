export const itemStartingAssignmentUnassignedFixture = Object.freeze({
  id: "item-unassigned",
  name: "Unclaimed Silver Charm",
  startingAssignment: {
    holderType: "UNASSIGNED",
    holderCreationId: null,
    holderCreationType: null,
    holderTitle: "",
    placement: {
      specificity: "UNSPECIFIED",
      path: [],
      note: "",
    },
    placementNote: "",
  },
});

export const itemStartingAssignmentStoryFixture = Object.freeze({
  id: "item-story-ledger",
  name: "Workshop Ledger",
  startingAssignment: {
    holderType: "STORY",
    holderCreationId: null,
    holderCreationType: null,
    holderTitle: "Story Inventory",
    placement: {
      specificity: "EXPLICIT",
      path: [
        {
          id: "placement-story-satchel",
          kind: "CONTAINER",
          key: "TRAVEL_SATCHEL",
          label: "Travel satchel",
        },
      ],
      note: "Available to the Story party before the first scene begins.",
    },
    placementNote:
      "Available to the Story party before the first scene begins.",
  },
});

export const itemStartingAssignmentCharacterFixture = Object.freeze({
  id: "item-kessa-charm",
  name: "Kessa's Silver Charm",
  startingAssignment: {
    holderType: "CHARACTER",
    holderCreationId: "creation-kessa",
    holderCreationType: "CHARACTER",
    holderTitle: "Kessa Brasswhisker",
    placement: {
      specificity: "EXPLICIT",
      path: [
        {
          id: "placement-carried",
          kind: "CARRY_STATE",
          key: "CARRIED",
          label: "Carried",
        },
        {
          id: "placement-coat-pocket",
          kind: "SLOT",
          key: "INNER_COAT_POCKET",
          label: "Inner coat pocket",
        },
      ],
      note: "The charm is concealed but immediately reachable.",
    },
    placementNote: "The charm is concealed but immediately reachable.",
  },
});

export const itemStartingAssignmentLegacyFixture = Object.freeze({
  id: "item-legacy-key",
  name: "Legacy Workshop Key",
  startingAssignment: {
    holder_type: "LOCATION",
    holder_creation_id: "creation-brasswhisker-workshop",
    holder_creation_type: "LOCATION",
    holder_title: "Brasswhisker Workshop",
    item_placement: {
      specificity: "EXPLICIT",
      placement_path: [
        {
          id: "placement-legacy-office",
          type: "AREA",
          title: "Back office",
        },
        {
          id: "placement-legacy-drawer",
          type: "CONTAINER",
          name: "Locked desk drawer",
        },
      ],
      placement_note: "Stored beneath the false bottom.",
    },
    placement_note: "Stored beneath the false bottom.",
  },
});

export const itemStartingAssignmentPickerFixtures = Object.freeze({
  CHARACTER: [
    {
      id: "creation-kessa",
      type: "CHARACTER",
      title: "Kessa Brasswhisker",
    },
    {
      id: "creation-orrin",
      type: "CHARACTER",
      title: "Orrin Vale",
    },
  ],
  PLAYER_CHARACTER: [
    {
      id: "creation-player-sable",
      type: "PLAYER_CHARACTER",
      title: "Sable Mercer",
    },
  ],
  LOCATION: [
    {
      id: "creation-brasswhisker-workshop",
      type: "LOCATION",
      title: "Brasswhisker Workshop",
    },
    {
      id: "creation-old-crescent-market",
      type: "LOCATION",
      title: "Old Crescent Market",
    },
  ],
});
