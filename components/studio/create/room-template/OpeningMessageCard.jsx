import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  TextAreaField,
} from "@/components/studio/create/room-template/RoomTemplateFields";

export default function OpeningMessageCard({
  message,
  index,
  selectedCharacters,
  onChange,
  onRemove,
}) {
  const speakerOptions = [
    { value: "Narrator", label: "Narrator" },
    ...selectedCharacters.map((character) => ({
      value: character.title,
      label: character.title,
    })),
    { value: "Player Prompt", label: "Player Prompt" },
  ];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Opening Message {index + 1}
        </p>

        <button
          type="button"
          onClick={() => onRemove(message.id)}
          disabled={index === 0}
          className="cf-btn cf-btn--danger cf-btn--sm"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <CrestfallSelect
          label="Speaker"
          value={message.speaker}
          onChange={(value) => onChange(message.id, "speaker", value)}
          options={speakerOptions}
        />

        <TextAreaField
          label="Message"
          value={message.body}
          onChange={(value) => onChange(message.id, "body", value)}
          placeholder="Opening message or prompt."
          rows={4}
        />
      </div>
    </div>
  );
}
