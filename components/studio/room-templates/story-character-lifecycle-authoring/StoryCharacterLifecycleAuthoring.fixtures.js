export const storyCharacterLifecycleLegacyFixture = Object.freeze({
  selectedCharacters: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      title: "Mira Quill",
      subtitle: "Legacy selection with no lifecycle object",
    },
  ],
});

export const storyCharacterLifecycleFilledFixture = Object.freeze({
  selectedCharacters: [
    {
      id: "22222222-2222-4222-8222-222222222222",
      title: "Kessa Cindervell",
      subtitle: "Persistent engineer",
      lifecycle: {
        contractVersion: "story_character_lifecycle_v0",
        kind: "STORY_PINNED",
        releasePolicy: "NEVER",
      },
      customReferenceField: "preserve-me",
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      title: "Gate Courier",
      subtitle: "Appears only for the opening setup",
      lifecycle: {
        contractVersion: "story_character_lifecycle_v0",
        kind: "OPENING_TEMPORARY",
        releasePolicy: "INITIAL_PHASE_EXIT",
      },
    },
    {
      id: "44444444-4444-4444-8444-444444444444",
      name: "Archive Guide",
      description: "Compatibility alias fixture",
      lifecycle_policy: "OPENING_ONLY",
    },
  ],
});

export const storyCharacterLifecycleAliasFixture = Object.freeze([
  { lifecycleKind: "OPENING" },
  { lifecycle_kind: "OPENING_ONLY" },
  { storyLifecycle: { type: "OPENING_TEMPORARY" } },
  { story_lifecycle: { kind: "SETUP_TEMPORARY" } },
]);
