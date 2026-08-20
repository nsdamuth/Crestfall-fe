import { Image as ImageIcon, Loader2, Plus, X } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  SectionTitle,
  TextAreaField,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function RoomTemplateOpeningSectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Opening Context and Messages",
  sectionDescription = "",
  publicOpeningContextLabel = "Public Opening Context",
  publicOpeningContextValue = "",
  publicOpeningContextPlaceholder = "",
  openingImageLabel = "Opening Image",
  openingImageDescription = "",
  chooseOpeningImageLabel = "Choose Image",
  replaceOpeningImageLabel = "Replace Image",
  removeOpeningImageLabel = "Remove",
  closePickerLabel = "Close",
  openingImageSources = [],
  selectedOpeningImage = null,
  pickerOpen = false,
  activeSourceId = "",
  pickerImages = [],
  pickerLoading = false,
  pickerError = "",
  speakerLabel = "Speaker",
  speakerOptions = [],
  messageLabel = "Message",
  messagePlaceholder = "",
  openingMessages = [],
  removeMessageLabel = "Remove",
  addMessageLabel = "Add opening message",
  onChangePublicOpeningContext = null,
  onOpenOpeningImagePicker = null,
  onCloseOpeningImagePicker = null,
  onSelectOpeningImageSource = null,
  onSelectOpeningImage = null,
  onRemoveOpeningImage = null,
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
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <section className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {openingImageLabel}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                {openingImageDescription}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenOpeningImagePicker?.()}
                disabled={!openingImageSources.length}
                className="cf-btn cf-btn--primary cf-btn--sm"
              >
                {selectedOpeningImage
                  ? replaceOpeningImageLabel
                  : chooseOpeningImageLabel}
              </button>
              {selectedOpeningImage ? (
                <button
                  type="button"
                  onClick={() => onRemoveOpeningImage?.()}
                  className="cf-btn cf-btn--danger cf-btn--sm"
                >
                  {removeOpeningImageLabel}
                </button>
              ) : null}
            </div>
          </div>

          {selectedOpeningImage?.displayUrl ? (
            <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedOpeningImage.displayUrl}
                alt={`${selectedOpeningImage.sourceTitle || "Story"} opening`}
                className="mx-auto h-auto max-h-[26rem] max-w-full object-contain"
              />
              <div className="border-t border-white/10 px-4 py-3 text-xs text-[var(--muted)]">
                Source:{" "}
                <span className="text-[var(--foreground)]">
                  {selectedOpeningImage.sourceTitle}
                </span>
              </div>
            </div>
          ) : null}
        </section>

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

      {pickerOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[var(--radius-md)] border border-white/10 bg-[var(--background)] p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  {openingImageLabel}
                </p>
                <h3 className="mt-2 font-display text-3xl">
                  Choose Story Opening Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onCloseOpeningImagePicker?.()}
                className="cf-btn cf-btn--ghost cf-btn--sm"
                aria-label={closePickerLabel}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {openingImageSources.map((source) => (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => onSelectOpeningImageSource?.(source.id)}
                  className={
                    activeSourceId === source.id
                      ? "cf-btn cf-btn--primary cf-btn--sm"
                      : "cf-btn cf-btn--ghost cf-btn--sm"
                  }
                >
                  {source.title}
                </button>
              ))}
            </div>

            {pickerLoading ? (
              <div className="mt-8 flex justify-center">
                <Loader2 className="animate-spin text-[var(--gold-ornament)]" />
              </div>
            ) : null}

            {pickerError ? (
              <p className="mt-6 text-sm text-red-200">{pickerError}</p>
            ) : null}

            {!pickerLoading && !pickerError && !pickerImages.length ? (
              <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-white/10 p-8 text-center text-sm text-[var(--muted)]">
                <ImageIcon className="mx-auto mb-3" />
                No eligible images are available for this attachment.
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pickerImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => onSelectOpeningImage?.(image)}
                  className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/30 text-left transition hover:border-[var(--gold-ornament)]/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.thumbnailUrl || image.displayUrl}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <p className="px-3 py-2 text-xs text-[var(--muted)]">
                    {image.width || "?"} × {image.height || "?"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
