// mock, pending CR-031: the advanced editor's full-field read and
// update path (docs/STUDIO-SPEC.md section 4.3, section 7; brief S3
// item 3). This is the ONE named mock module resolving `[id]` to a
// saved-creation fixture with the full field set (quick and
// advanced), wrapping `Editor.fixtures.js`'s four fixture creations.
//
// Resolution law: a `creationId` that matches one of the four keys
// below returns that fixture synchronously and the Binding Shell
// skips the live read (docs/STUDIO-SPEC.md 4.3, "fixture-first"). Any
// other `creationId` returns null and the Binding Shell falls through
// to the existing, unmodified live path
// (`useCreationEditViewModel`'s own `fetchOwnedCreation`), which is
// the "live persistence through the existing creation client where it
// already works" brief S3 item 3 requires. Save, review, archive,
// delete, and default-PC all continue through the same existing
// client calls regardless of how the initial read resolved.
//
// Deleted whole, and this comment with it, when CR-031 lands the real
// full-field read and update-in-place path for `/studio/v2/editor/[id]`.
import { OWNED_CREATIONS_PICKER_MOCK } from "@/components/studio/creation-picker/creation-picker/ownedCreationsPicker.mock";

import { EDITOR_FIXTURE_STATES, featuredMedia } from "./Editor.fixtures";

export const MOCK_SAVED_CREATION_IDS = Object.freeze({
  characterDefault: EDITOR_FIXTURE_STATES.characterDefault.creation.id,
  nonCharacterType: EDITOR_FIXTURE_STATES.nonCharacterType.creation.id,
  story: EDITOR_FIXTURE_STATES.story.creation.id,
  location: EDITOR_FIXTURE_STATES.location.creation.id,
  npcRegistry: EDITOR_FIXTURE_STATES.npcRegistry.creation.id,
  characterTemplate: EDITOR_FIXTURE_STATES.characterTemplate.creation.id,
  emptySections: EDITOR_FIXTURE_STATES.emptySections.creation.id,
  longestContent: EDITOR_FIXTURE_STATES.longestContent.creation.id,
});

const REGISTRY = Object.freeze({
  [MOCK_SAVED_CREATION_IDS.characterDefault]:
    EDITOR_FIXTURE_STATES.characterDefault.creation,
  [MOCK_SAVED_CREATION_IDS.nonCharacterType]:
    EDITOR_FIXTURE_STATES.nonCharacterType.creation,
  [MOCK_SAVED_CREATION_IDS.story]: EDITOR_FIXTURE_STATES.story.creation,
  [MOCK_SAVED_CREATION_IDS.location]: EDITOR_FIXTURE_STATES.location.creation,
  [MOCK_SAVED_CREATION_IDS.npcRegistry]:
    EDITOR_FIXTURE_STATES.npcRegistry.creation,
  [MOCK_SAVED_CREATION_IDS.characterTemplate]:
    EDITOR_FIXTURE_STATES.characterTemplate.creation,
  [MOCK_SAVED_CREATION_IDS.emptySections]:
    EDITOR_FIXTURE_STATES.emptySections.creation,
  [MOCK_SAVED_CREATION_IDS.longestContent]:
    EDITOR_FIXTURE_STATES.longestContent.creation,
});

// ED1B live-route fix: the SW1 creation picker's own mock
// (ownedCreationsPicker.mock.js, pending CR-050) hands the editor ids
// of the form `owned-<type>`, one per product type. Those ids were
// not in REGISTRY, so on the live /studio/v2/editor/[id] route every
// picker selection fell through to the real fetchOwnedCreation call,
// failed, and rendered the load-error state. Every picker id now
// resolves fixture-first here, built from the picker entry itself
// (same title, visibility, canon flag, and art the picker showed)
// over a same-type editor fixture where one exists, or a minimal
// saved-creation shell otherwise. Both registries are deleted whole
// when CR-031/CR-050 land the real reads.
const OWNED_BASE_FIXTURE_BY_TYPE = {
  CHARACTER: EDITOR_FIXTURE_STATES.characterDefault.creation,
  PLAYER_CHARACTER: EDITOR_FIXTURE_STATES.characterDefault.creation,
  ROOM_TEMPLATE: EDITOR_FIXTURE_STATES.story.creation,
  LOCATION: EDITOR_FIXTURE_STATES.location.creation,
  NPC_REGISTRY: EDITOR_FIXTURE_STATES.npcRegistry.creation,
  LORE: EDITOR_FIXTURE_STATES.nonCharacterType.creation,
  CHARACTER_TEMPLATE: EDITOR_FIXTURE_STATES.characterTemplate.creation,
};

function buildOwnedFixture(entry) {
  const base = OWNED_BASE_FIXTURE_BY_TYPE[entry.type] || {
    ownerId: "mock-owner",
    updatedAt: "2026-08-13T00:00:00.000Z",
    contentRating: "SFW",
    status: "DRAFT",
    reviewStatus: "DRAFT",
    description: "",
    chatDisplayMedia: null,
    data: {},
  };

  return {
    ...base,
    id: entry.id,
    title: entry.title,
    type: entry.type,
    visibility: entry.visibility,
    canonStatus: entry.isCanon ? "OFFICIAL" : "NONE",
    featuredMedia: featuredMedia(entry.imageSrc || null),
    // Keep the identity field in step with the picker title so the
    // header and the name input agree.
    data:
      base.data && base.data.name !== undefined
        ? { ...base.data, name: entry.title }
        : base.data || {},
  };
}

const OWNED_REGISTRY = Object.freeze(
  Object.fromEntries(
    OWNED_CREATIONS_PICKER_MOCK.map((entry) => [entry.id, buildOwnedFixture(entry)])
  )
);

// ED1C fixture save (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section
// 3.8): Save on a fixture id persists the edited form HERE, never
// through the live client. The overlay wins over both static
// registries, so Discard, remount, and switch-away-and-back all
// rehydrate the saved edits for the rest of the session. Module
// scope is deliberate: this is the mock's own storage, deleted whole
// with the file when CR-031/CR-050 land the real reads and writes.
const SAVED_OVERLAY = new Map();

export function saveMockCreation(creationId, form) {
  if (!creationId || !form) return;
  SAVED_OVERLAY.set(creationId, { ...form, id: creationId });
}

export function resolveMockSavedCreation(creationId) {
  if (!creationId) return null;
  return (
    SAVED_OVERLAY.get(creationId) ||
    REGISTRY[creationId] ||
    OWNED_REGISTRY[creationId] ||
    null
  );
}
