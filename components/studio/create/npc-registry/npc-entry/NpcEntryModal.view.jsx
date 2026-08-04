import CreationPickerPanel from "@/components/studio/creations/pickers/CreationPickerPanel";

import ModalActions from "../ModalActions";
import ModalShell from "../ModalShell";
import { TextArea, TextInput } from "../RegistryUtils";

export default function NpcEntryModalView({
  modalTitle = "Person Entry",
  selectedModeId = "lightweightNpc",
  modeOptions = [],
  characterCards = [],
  selectedCharacterIds = [],
  disabledCharacterIds = [],
  characterSearchPlaceholder = "Search characters and player characters...",
  characterEmptyMessage = "No character assets found yet.",
  linkedCharacterMechanicsNote = "",
  actorMechanicsProfileAttachmentContent = null,
  nameLabel = "Name",
  nameValue = "",
  notesLabel = "Registry Notes",
  notesValue = "",
  notesRows = 5,
  notesPlaceholder = "",
  saveLabel = "Save Person Entry",
  onClose = null,
  onChooseMode = null,
  onChooseCharacter = null,
  onChangeName = null,
  onChangeNotes = null,
  onSave = null,
}) {
  const isLinkedCharacterMode = selectedModeId === "linkedCharacter";

  return (
    <ModalShell title={modalTitle} onClose={onClose}>
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-2">
          {modeOptions.map((option) => {
            const active = option?.id === selectedModeId;

            return (
              <button
                key={option?.id || option?.label}
                type="button"
                onClick={() => onChooseMode?.(option?.id || "")}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                  active
                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {option?.label || "Entry Mode"}
              </button>
            );
          })}
        </div>

        {isLinkedCharacterMode ? (
          <>
            <CreationPickerPanel
              items={characterCards}
              selectedIds={selectedCharacterIds}
              disabledIds={disabledCharacterIds}
              searchPlaceholder={characterSearchPlaceholder}
              emptyMessage={characterEmptyMessage}
              onSelect={(item) => onChooseCharacter?.(item?.id || "")}
            />

            {linkedCharacterMechanicsNote ? (
              <p className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/5 px-4 py-3 text-xs leading-5 text-[var(--muted)]">
                {linkedCharacterMechanicsNote}
              </p>
            ) : null}
          </>
        ) : (
          <TextInput
            label={nameLabel}
            value={nameValue}
            onChange={(value) => onChangeName?.(value)}
          />
        )}

        {!isLinkedCharacterMode && actorMechanicsProfileAttachmentContent ? (
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-4">
            {actorMechanicsProfileAttachmentContent}
          </div>
        ) : null}

        <TextArea
          label={notesLabel}
          value={notesValue}
          onChange={(value) => onChangeNotes?.(value)}
          rows={notesRows}
          placeholder={notesPlaceholder}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel={saveLabel}
        />
      </div>
    </ModalShell>
  );
}
