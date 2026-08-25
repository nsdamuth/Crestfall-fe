import CrestfallSelect from "@/components/ui/CrestfallSelect";
import { TextAreaField } from "@/components/studio/create/room-template/RoomTemplateFields";

export default function OpeningMessageCardView({
  messageLabel = "Opening Message",
  speakerValue = "",
  speakerOptions = [],
  bodyValue = "",
  canRemove = false,
  onChangeSpeaker,
  onChangeBody,
  onRemoveMessage,
} = {}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          {messageLabel}
        </p>

        <button
          type="button"
          onClick={() => onRemoveMessage?.()}
          disabled={!canRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <CrestfallSelect
          label="Speaker"
          value={speakerValue}
          onChange={(value) => onChangeSpeaker?.(value)}
          options={speakerOptions}
        />

        <TextAreaField
          label="Message"
          value={bodyValue}
          onChange={(value) => onChangeBody?.(value)}
          placeholder="Opening message or prompt."
          rows={4}
        />
      </div>
    </div>
  );
}
