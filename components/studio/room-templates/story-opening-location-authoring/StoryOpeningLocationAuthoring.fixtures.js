export const storyOpeningLocationOptionsFixture = Object.freeze([
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

export const storyOpeningLocationFixedFixture = Object.freeze({
  storyData: {
    location_id:
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    opening_location: {
      version: "story_opening_location_v0",
      mode: "FIXED",
      fixedLocationId:
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    },
  },
  locationOptions: storyOpeningLocationOptionsFixture,
});

export const storyOpeningLocationPlayerSelectFixture = Object.freeze({
  storyData: {
    opening_location: {
      version: "story_opening_location_v0",
      mode: "PLAYER_SELECT",
      allowedLocationIds: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
      allowedLocations: [
        {
          id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          type: "LOCATION",
          title: "Stored Deepcross",
          subtitle: "Stored fallback copy",
        },
        {
          id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          type: "LOCATION",
          title: "Stored Sunreach",
          subtitle: "Stored fallback copy",
        },
      ],
    },
  },
  locationOptions: storyOpeningLocationOptionsFixture,
});

export const storyOpeningLocationStoredFallbackFixture = Object.freeze({
  storyData: {
    openingLocation: {
      mode: "PLAYER_SELECT",
      allowed_location_ids: [
        "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      ],
      allowed_locations: [
        {
          creation_id:
            "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          type: "LOCATION",
          title: "Stored-Only Ruins",
          description:
            "Persisted reference remains displayable even when absent from current picker options.",
          content_rating: "MATURE",
          image_url: "/fixtures/ruins.webp",
        },
      ],
    },
  },
  locationOptions: [],
});

export const storyOpeningLocationMissingReferenceFixture = Object.freeze({
  storyData: {
    opening_location: {
      mode: "PLAYER_SELECT",
      allowedLocationIds: [
        "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      ],
    },
  },
  locationOptions: [],
});

export const storyOpeningLocationInvalidEmptyPlayerSelectFixture =
  Object.freeze({
    storyData: {
      opening_location: {
        mode: "PLAYER_SELECT",
        allowedLocationIds: [],
        allowedLocations: [],
      },
    },
    locationOptions: storyOpeningLocationOptionsFixture,
  });
