export const myCreationsHubFixture = Object.freeze({
  creations: [
    {
      id: "creation-character-1",
      type: "CHARACTER",
      title: "Kessa Cindervell",
      description: "A Bastet artificer and sharp-eyed appraiser.",
      visibility: "PRIVATE",
      status: "DRAFT",
      content_rating: "SFW",
      updated_at: "2026-07-31T20:20:33.583Z",
      data: {
        role: "Artificer",
        tags: ["Aethelgard", "Artificer"],
        canon_status: "NONE",
      },
    },
    {
      id: "creation-location-1",
      type: "LOCATION",
      title: "The Brasswhisker's Workshop",
      description: "A guarded appraisal workshop in the trade district.",
      visibility: "UNLISTED",
      status: "DRAFT",
      contentRating: "SFW",
      updatedAt: "2026-07-27T07:07:22.008Z",
      data: {
        location_type: "Workshop",
        tags: ["Aethelgard", "Workshop"],
      },
    },
    {
      id: "creation-scenario-1",
      type: "SCENARIO",
      title: "The Ticking Charm",
      description: "A mystery scenario centered on a silver charm.",
      visibility: "PUBLIC",
      status: "APPROVED",
      canon_status: "CANON_ALIGNED",
      data: {
        tags: ["Mystery", "Aethelgard"],
      },
    },
    {
      id: "creation-player-character-1",
      type: "PLAYER_CHARACTER",
      title: "Static",
      description: "A controlled player character with a technical helmet.",
      visibility: "PRIVATE",
      status: "DRAFT",
      data: {
        role: "Signal-Bearer",
        tags: ["Player", "Technology"],
      },
    },
  ],
});

export const myCreationsHubEmptyFixture = Object.freeze({ creations: [] });
