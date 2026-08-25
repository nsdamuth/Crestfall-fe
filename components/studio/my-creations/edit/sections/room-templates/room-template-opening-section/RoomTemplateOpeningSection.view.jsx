import { Plus, X } from "lucide-react";

import {
  DEEP_LONGFORM_MAX_LENGTH,
  SectionTitle,
  SelectField,
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

      <div className="mt-[var(--space-6)] grid gap-[var(--space-5)]">
        <TextAreaField
          label={publicOpeningContextLabel}
          value={publicOpeningContextValue}
          onChange={(value) => onChangePublicOpeningContext?.(value)}
          placeholder={publicOpeningContextPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <div className="grid gap-[var(--space-4)]">
          {openingMessages.map((message) => (
            // Opening message rows are repeatable list items, kept
            // with their own list-item border (same allowance the
            // sibling card lists use), but the eyebrow moves off the
            // gold-panel-header recipe to the tier 4 group label.
            <div
              key={message.id}
              className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-5)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
                <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
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

              <div className="mt-[var(--space-4)] grid gap-[var(--space-4)]">
                <SelectField
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
                  maxLength={DEEP_LONGFORM_MAX_LENGTH}
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
