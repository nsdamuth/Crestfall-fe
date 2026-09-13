const ATTACHED_BINDING = {
  title: "Heroic Progression",
  creationId: "2f574779-3cc7-4b39-b854-f270930d3401",
  moduleId: "core.trackers.v1",
  trigger: "get_tracker_context",
  scopeMode: "STORY_ROOM",
  enabled: true,
  priority: 100,
};

const BASE_FIXTURE = {
  eyebrow: "Story runtime",
  title: "Mechanics module",
  description:
    "Attach one story mechanics module. Story-level mechanics are the highest runtime source for footers and root story state.",
  binding: null,
  attachActionLabel: "Attach mechanics",
  saving: false,
  savingMessage: "Saving runtime mechanics...",
  statusMessage: "",
  errorMessage: "",
  pickerContent: null,
};

export const storyRoomRuntimeMechanicsEmptyFixture = {
  ...BASE_FIXTURE,
};

export const storyRoomRuntimeMechanicsAttachedFixture = {
  ...BASE_FIXTURE,
  binding: ATTACHED_BINDING,
  attachActionLabel: "Replace Mechanics",
};

export const storyRoomRuntimeMechanicsBindingOwnerFixture = {
  ...storyRoomRuntimeMechanicsAttachedFixture,
  binding: {
    ...ATTACHED_BINDING,
    title: "Faction Reputation Rules",
    creationId: "56a9f84e-1b36-4d48-8d53-1cc8e92122ab",
    scopeMode: "BINDING_OWNER",
    enabled: false,
    priority: 40,
  },
};

export const storyRoomRuntimeMechanicsSavingFixture = {
  ...storyRoomRuntimeMechanicsAttachedFixture,
  saving: true,
};

export const storyRoomRuntimeMechanicsSavedFixture = {
  ...storyRoomRuntimeMechanicsAttachedFixture,
  statusMessage: "Runtime mechanics saved.",
};

export const storyRoomRuntimeMechanicsErrorFixture = {
  ...storyRoomRuntimeMechanicsAttachedFixture,
  errorMessage: "Story runtime mechanics could not be saved.",
};
