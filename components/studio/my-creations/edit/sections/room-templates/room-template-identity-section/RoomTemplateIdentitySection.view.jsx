import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  SectionTitle,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function RoomTemplateIdentitySectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Story Identity",
  sectionDescription = "",
  roomModeLabel = "Story Mode",
  roomModeValue = "GROUP",
  roomModeOptions = [],
  playerCharacterModeLabel = "Player Character",
  playerCharacterModeValue = "OPTIONAL",
  playerCharacterModeOptions = [],
  tagsLabel = "Tags",
  tagsValue = "",
  onSelectRoomMode = null,
  onSelectPlayerCharacterMode = null,
  onChangeTags = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CrestfallSelect
          label={roomModeLabel}
          value={roomModeValue}
          onChange={(value) => onSelectRoomMode?.(value)}
          options={roomModeOptions}
        />

        <CrestfallSelect
          label={playerCharacterModeLabel}
          value={playerCharacterModeValue}
          onChange={(value) => onSelectPlayerCharacterMode?.(value)}
          options={playerCharacterModeOptions}
        />

        <TextField
          label={tagsLabel}
          value={tagsValue}
          onChange={(value) => onChangeTags?.(value)}
        />
      </div>
    </div>
  );
}
