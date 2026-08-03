"use client";

const ENTRY_MODE_OPTIONS = [
  {
    id: "lightweightNpc",
    label: "Lightweight NPC",
    value: "AD_HOC",
  },
  {
    id: "linkedCharacter",
    label: "Link Existing Character",
    value: "CREATION_REF",
  },
];

function toCharacterCard(character) {
  return {
    id: String(character?.id || ""),
    title: String(character?.title || "Untitled Character"),
    subtitle: String(character?.subtitle || ""),
    description: String(character?.description || ""),
    type: String(character?.type || "CHARACTER"),
    contentRating: String(character?.contentRating || "SFW"),
    imageUrl: String(character?.imageUrl || ""),
  };
}

function findModeId(rawKind) {
  return (
    ENTRY_MODE_OPTIONS.find((option) => option.value === rawKind)?.id ||
    "lightweightNpc"
  );
}

function findRawKind(modeId) {
  return (
    ENTRY_MODE_OPTIONS.find((option) => option.id === modeId)?.value ||
    "AD_HOC"
  );
}

export function useNpcEntryModalViewModel({
  draft = {},
  characterOptions = [],
  linkedCreationIds = [],
  onClose = null,
  onChange = null,
  onSetKind = null,
  onApplyCharacter = null,
  onSave = null,
} = {}) {
  const safeCharacterOptions = Array.isArray(characterOptions)
    ? characterOptions
    : [];
  const selectedCharacterId = String(draft?.creationId || "");
  const linkedIds = (Array.isArray(linkedCreationIds)
    ? linkedCreationIds
    : []
  ).map((id) => String(id || ""));

  const disabledCharacterIds = linkedIds.filter(
    (id) => id && id !== selectedCharacterId
  );

  function chooseMode(modeId) {
    onSetKind?.(findRawKind(modeId));
  }

  function chooseCharacter(characterId) {
    const selectedCharacter = safeCharacterOptions.find(
      (character) => String(character?.id || "") === String(characterId || "")
    );

    if (selectedCharacter) {
      onApplyCharacter?.(selectedCharacter);
    }
  }

  function changeName(value) {
    onChange?.("name", value);
  }

  function changeNotes(value) {
    onChange?.("notes", value);
  }

  return {
    modalTitle: "Person Entry",
    selectedModeId: findModeId(draft?.kind),
    modeOptions: ENTRY_MODE_OPTIONS.map(({ id, label }) => ({ id, label })),
    characterCards: safeCharacterOptions.map(toCharacterCard),
    selectedCharacterIds: selectedCharacterId ? [selectedCharacterId] : [],
    disabledCharacterIds,
    characterSearchPlaceholder: "Search characters and player characters...",
    characterEmptyMessage: "No character assets found yet.",
    linkedCharacterMechanicsNote:
      "Linked Character entries use the Actor Mechanics Profile attached to the Character creation. Lightweight NPC entries may attach a separate NPC_REGISTRY_ENTRY profile below.",
    nameLabel: "Name",
    nameValue: String(draft?.name || ""),
    notesLabel: "Registry Notes",
    notesValue: String(draft?.notes || ""),
    notesRows: 5,
    notesPlaceholder:
      "Continuity notes, role, behavior, restrictions, or why this person matters.",
    saveLabel: "Save Person Entry",
    onClose,
    onChooseMode: chooseMode,
    onChooseCharacter: chooseCharacter,
    onChangeName: changeName,
    onChangeNotes: changeNotes,
    onSave,
  };
}
