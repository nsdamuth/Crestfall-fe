import { Plus, X } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function RoomTemplateOpeningSectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Opening Context and Messages",
  sectionDescription = "",
  publicOpeningContextLabel = "Public Opening Context",
  publicOpeningContextValue = "",
  publicOpeningContextPlaceholder = "",
  speakerLabel = "Speaker",
  speakerOptions = [],
  messageLabel = "Message",
  messagePlaceholder = "",
  openingMessages = [],
  removeMessageLabel = "Remove",
  addMessageLabel = "Add opening message",
  onChangePublicOpeningContext = null,
  onChangeOpeningMessageSpeaker = null,
  onChangeOpeningMessageBody = null,
  onAddOpeningMessage = null,
  onRemoveOpeningMessage = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label={publicOpeningContextLabel}
          value={publicOpeningContextValue}
          onChange={(value) => onChangePublicOpeningContext?.(value)}
          placeholder={publicOpeningContextPlaceholder}
        />

        <div className="grid gap-4">
          {openingMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  {message.messageLabel}
                </p>

                <button
                  type="button"
                  onClick={() => onRemoveOpeningMessage?.(message.id)}
                  disabled={!message.canRemove}
                  className="cf-btn cf-btn--danger cf-btn--sm"
                >
                  <X size={12} />
                  {removeMessageLabel}
                </button>
              </div>

              <div className="mt-4 grid gap-4">
                <CrestfallSelect
                  label={speakerLabel}
                  value={message.speakerValue}
                  onChange={(value) =>
                    onChangeOpeningMessageSpeaker?.(message.id, value)
                  }
                  options={speakerOptions}
                />

                <TextAreaField
                  label={messageLabel}
                  value={message.bodyValue}
                  onChange={(value) =>
                    onChangeOpeningMessageBody?.(message.id, value)
                  }
                  placeholder={messagePlaceholder}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => onAddOpeningMessage?.()}
            className="cf-btn cf-btn--primary w-fit"
          >
            <Plus size={14} />
            {addMessageLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
