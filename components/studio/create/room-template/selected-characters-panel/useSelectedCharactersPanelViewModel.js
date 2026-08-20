import {
  STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS,
  normalizeStoryCharacterLifecycleAuthoringKind,
} from "@/components/studio/room-templates/storyCharacterLifecycleAuthoring";

function normalizeCharacter(character) {
  const title = String(character?.title || "Untitled Character");

  return {
    id: String(character?.id || ""),
    title,
    subtitle: String(character?.subtitle || ""),
    initial: title.trim().slice(0, 1).toUpperCase() || "?",
    lifecycleKind: normalizeStoryCharacterLifecycleAuthoringKind(character),
  };
}

export function useSelectedCharactersPanelViewModel({
  selectedCharacters = [],
  onOpen,
  onRemove,
  onLifecycleChange,
} = {}) {
  const characters = Array.isArray(selectedCharacters)
    ? selectedCharacters
        .filter((character) => character?.id)
        .map(normalizeCharacter)
    : [];

  return {
    characters,
    lifecycleOptions: STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS,
    onOpenCharacterPicker: onOpen,
    onRemoveCharacter: onRemove,
    onChangeCharacterLifecycle: onLifecycleChange,
  };
}
