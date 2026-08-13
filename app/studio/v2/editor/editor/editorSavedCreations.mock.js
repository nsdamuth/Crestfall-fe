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
import { EDITOR_FIXTURE_STATES } from "./Editor.fixtures";

export const MOCK_SAVED_CREATION_IDS = Object.freeze({
  characterDefault: EDITOR_FIXTURE_STATES.characterDefault.creation.id,
  nonCharacterType: EDITOR_FIXTURE_STATES.nonCharacterType.creation.id,
  story: EDITOR_FIXTURE_STATES.story.creation.id,
  location: EDITOR_FIXTURE_STATES.location.creation.id,
  npcRegistry: EDITOR_FIXTURE_STATES.npcRegistry.creation.id,
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
  [MOCK_SAVED_CREATION_IDS.emptySections]:
    EDITOR_FIXTURE_STATES.emptySections.creation,
  [MOCK_SAVED_CREATION_IDS.longestContent]:
    EDITOR_FIXTURE_STATES.longestContent.creation,
});

export function resolveMockSavedCreation(creationId) {
  if (!creationId) return null;
  return REGISTRY[creationId] || null;
}
