function normalizeCharacter(character) {
  const title = String(character?.title || "Untitled Character");

  return {
    id: String(character?.id || ""),
    title,
    subtitle: String(character?.subtitle || ""),
    initial: title.trim().slice(0, 1).toUpperCase() || "?",
  };
}

export function useSelectedCharactersPanelViewModel({
  selectedCharacters = [],
  onOpen,
  onRemove,
} = {}) {
  const characters = Array.isArray(selectedCharacters)
    ? selectedCharacters
        .filter((character) => character?.id)
        .map(normalizeCharacter)
    : [];

  return {
    characters,
    onOpenCharacterPicker: onOpen,
    onRemoveCharacter: onRemove,
  };
}
