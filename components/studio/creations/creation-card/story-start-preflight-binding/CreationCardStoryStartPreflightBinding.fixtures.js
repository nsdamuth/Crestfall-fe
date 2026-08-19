export const creationCardStoryStartCharacterFixture =
  Object.freeze({
    creation: {
      id:
        "11111111-1111-4111-8111-111111111111",
      type: "CHARACTER",
      title: "Mira Quill",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status: "NOT_REQUIRED",
    },
  });

export const creationCardStoryStartUnsavedRoomTemplateFixture =
  Object.freeze({
    creation: {
      id: "",
      type: "ROOM_TEMPLATE",
      title: "Unsaved Story",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status: "NOT_REQUIRED",
    },
  });

export const creationCardStoryStartRoomTemplateNeedsPreflightFixture =
  Object.freeze({
    creation: {
      id:
        "22222222-2222-4222-8222-222222222222",
      type: "ROOM_TEMPLATE",
      title: "Crossroads at Dawn",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status: "REQUIRED",
    },
  });

export const creationCardStoryStartRoomTemplatePlayerSelectFixture =
  Object.freeze({
    creation: {
      id:
        "22222222-2222-4222-8222-222222222222",
      type: "ROOM_TEMPLATE",
      title: "Crossroads at Dawn",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status: "READY",
      storyCreation: {
        id:
          "22222222-2222-4222-8222-222222222222",
        type: "ROOM_TEMPLATE",
        title: "Crossroads at Dawn",
        opening_location: {
          version:
            "story_opening_location_v0",
          mode:
            "PLAYER_SELECT",
        },
      },
      selectionRequired: true,
      selectedLocationId: "",
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
    },
  });

export const creationCardStoryStartRoomTemplateFixedFixture =
  Object.freeze({
    creation: {
      id:
        "33333333-3333-4333-8333-333333333333",
      type: "ROOM_TEMPLATE",
      title: "The Bronze Seal",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status: "READY",
      storyCreation: {
        id:
          "33333333-3333-4333-8333-333333333333",
        type: "ROOM_TEMPLATE",
        title: "The Bronze Seal",
        opening_location: {
          version:
            "story_opening_location_v0",
          mode: "FIXED",
        },
      },
      selectionRequired: false,
      selectedLocationId: "",
      allowedLocationIds: [],
    },
  });

export const creationCardStoryStartFallbackPlayerSelectFixture =
  Object.freeze({
    creation: {
      id:
        "44444444-4444-4444-8444-444444444444",
      type: "ROOM_TEMPLATE",
      title: "Fallback Story",
    },
    supportsChat: true,
    starting: false,
    preflight: {
      status:
        "FAILED_FALLBACK_READY",
      storyCreation: {
        id:
          "44444444-4444-4444-8444-444444444444",
        type: "ROOM_TEMPLATE",
        title: "Fallback Story",
      },
      selectionRequired: true,
      selectedLocationId: "",
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ],
      errorMessage:
        "Preview hydration failed; fallback Creation data was used.",
    },
  });

export const creationCardStoryStartBusyFixture =
  Object.freeze({
    creation: {
      id:
        "55555555-5555-4555-8555-555555555555",
      type: "ROOM_TEMPLATE",
      title: "Busy Story",
    },
    supportsChat: true,
    starting: true,
    preflight: {
      status: "READY",
    },
  });

export const creationCardStoryStartNotChatCapableFixture =
  Object.freeze({
    creation: {
      id:
        "66666666-6666-4666-8666-666666666666",
      type: "LOCATION",
      title: "Deepcross",
    },
    supportsChat: false,
    starting: false,
    preflight: {
      status: "NOT_REQUIRED",
    },
  });
