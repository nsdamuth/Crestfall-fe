export const roomTemplateStoryAuthoringLocationOptionsFixture =
  Object.freeze([
    {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      type: "LOCATION",
      title: "Deepcross",
      subtitle: "Fogbound market district",
      contentRating: "SFW",
      imageUrl: "/fixtures/deepcross.webp",
    },
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      type: "LOCATION",
      title: "Sunreach",
      subtitle: "High terraces above the eastern gate",
      contentRating: "SFW",
      imageUrl: "/fixtures/sunreach.webp",
    },
    {
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      type: "LOCATION",
      title: "Brasswhisker Workshop",
      subtitle: "Workshop in the Old Crescent",
      contentRating: "TEEN",
      imageUrl: "/fixtures/brasswhisker.webp",
    },
  ]);

export const roomTemplateStoryAuthoringFixedFixture = Object.freeze({
  form: {
    title: "The Bronze Seal",
    location_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    opening_location: {
      version: "story_opening_location_v0",
      mode: "FIXED",
      fixedLocationId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    },
  },
  selectedCharacters: [
    { id: "character-mira", title: "Mira Quill", subtitle: "Night clerk" },
  ],
  locationOptions: roomTemplateStoryAuthoringLocationOptionsFixture,
});

export const roomTemplateStoryAuthoringPlayerSelectFixture = Object.freeze({
  form: {
    title: "Crossroads at Dawn",
    opening_location: {
      version: "story_opening_location_v0",
      mode: "PLAYER_SELECT",
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
      allowedLocations: [
        { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", type: "LOCATION", title: "Stored Deepcross" },
        { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", type: "LOCATION", title: "Stored Sunreach" },
      ],
    },
  },
  selectedCharacters: [
    {
      id: "character-mira",
      title: "Mira Quill",
      subtitle: "Persistent shopkeeper",
      lifecycle: {
        contractVersion: "story_character_lifecycle_v0",
        kind: "STORY_PINNED",
        releasePolicy: "NEVER",
      },
    },
    {
      id: "character-courier",
      title: "Gate Courier",
      subtitle: "Opening messenger",
      lifecycle: {
        contractVersion: "story_character_lifecycle_v0",
        kind: "OPENING_TEMPORARY",
        releasePolicy: "INITIAL_PHASE_EXIT",
      },
    },
  ],
  locationOptions: roomTemplateStoryAuthoringLocationOptionsFixture,
});

export const roomTemplateStoryAuthoringInvalidPlayerSelectFixture = Object.freeze({
  form: {
    title: "Broken Opening Set",
    opening_location: {
      version: "story_opening_location_v0",
      mode: "PLAYER_SELECT",
      allowedLocationIds: [],
      allowedLocations: [],
    },
  },
  selectedCharacters: [],
  locationOptions: roomTemplateStoryAuthoringLocationOptionsFixture,
});

export const roomTemplateStoryAuthoringLegacyCharactersFixture = Object.freeze({
  form: {
    title: "Legacy Story",
    location_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  },
  selectedCharacters: [
    { id: "character-kessa", title: "Kessa Cindervell", subtitle: "Legacy selected Character" },
    { id: "character-mira", title: "Mira Quill", subtitle: "Legacy selected Character" },
  ],
  locationOptions: roomTemplateStoryAuthoringLocationOptionsFixture,
});
