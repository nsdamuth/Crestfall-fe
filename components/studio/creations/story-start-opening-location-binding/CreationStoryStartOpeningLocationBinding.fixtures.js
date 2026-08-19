export const creationStoryStartFixedProfileFixture =
  Object.freeze({
    surface: "PROFILE_PAGE",
    supportsChat: true,
    starting: false,
    error: "",
    openingLocation: {
      selectionRequired: false,
      pickerOpen: false,
      options: [],
      allowedLocationIds: [],
      selectedLocationId: "",
    },
  });

export const creationStoryStartPlayerSelectProfileFixture =
  Object.freeze({
    surface: "PROFILE_PAGE",
    supportsChat: true,
    starting: false,
    error: "",
    openingLocation: {
      selectionRequired: true,
      pickerOpen: true,
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
      selectedLocationId:
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      options: [
        {
          id:
            "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          title: "Deepcross",
          subtitle:
            "Fogbound market district",
          imageUrl:
            "https://example.test/deepcross.webp",
        },
        {
          id:
            "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          title: "Sunreach",
          subtitle:
            "High terraces above the eastern gate",
          imageUrl:
            "https://example.test/sunreach.webp",
        },
      ],
    },
  });

export const creationStoryStartPlayerSelectPreviewFixture =
  Object.freeze({
    surface: "PREVIEW_MODAL",
    supportsChat: true,
    starting: false,
    error: "",
    openingLocation: {
      selectionRequired: true,
      pickerOpen: false,
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
      selectedLocationId: "",
      options: [
        {
          id:
            "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          title: "Deepcross",
          subtitle:
            "Fogbound market district",
          imageUrl:
            "https://example.test/deepcross.webp",
        },
        {
          id:
            "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          title: "Sunreach",
          subtitle:
            "High terraces above the eastern gate",
          imageUrl:
            "https://example.test/sunreach.webp",
        },
      ],
    },
  });

export const creationStoryStartInvalidSelectionFixture =
  Object.freeze({
    surface: "PREVIEW_MODAL",
    supportsChat: true,
    starting: false,
    error:
      "Choose one of the allowed starting Locations.",
    openingLocation: {
      selectionRequired: true,
      pickerOpen: true,
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ],
      selectedLocationId:
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      options: [
        {
          id:
            "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          title: "Deepcross",
          subtitle:
            "Fogbound market district",
          imageUrl:
            "https://example.test/deepcross.webp",
        },
      ],
    },
  });

export const creationStoryStartPendingFixture =
  Object.freeze({
    surface: "PROFILE_PAGE",
    supportsChat: true,
    starting: true,
    error: "",
    openingLocation: {
      selectionRequired: true,
      pickerOpen: true,
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ],
      selectedLocationId:
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      options: [
        {
          id:
            "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          title: "Deepcross",
          subtitle:
            "Fogbound market district",
          imageUrl:
            "https://example.test/deepcross.webp",
        },
      ],
    },
  });

export const creationStoryStartNotChatCapableFixture =
  Object.freeze({
    surface: "PREVIEW_MODAL",
    supportsChat: false,
    starting: false,
    error: "",
    openingLocation: {
      selectionRequired: true,
      pickerOpen: false,
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ],
      selectedLocationId: "",
      options: [
        {
          id:
            "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          title: "Deepcross",
        },
      ],
    },
  });
