"use client";

import { Save } from "lucide-react";

export default function StorylineBuilderShellView({
  eyebrow = "Storyline Builder",
  displayTitle = "Untitled Storyline",
  description = "",
  titleLabel = "Title",
  titleValue = "",
  onChangeTitle = () => {},
  descriptionLabel = "Description",
  descriptionValue = "",
  onChangeDescription = () => {},
  visibilityLabel = "Visibility",
  visibilityValue = "PRIVATE",
  visibilityOptions = [],
  onChangeVisibility = () => {},
  contentRatingLabel = "Content Rating",
  contentRatingValue = "SFW",
  contentRatingOptions = [],
  onChangeContentRating = () => {},
  tagsLabel = "Tags",
  tagsValue = "",
  tagsPlaceholder = "One tag per line",
  onChangeTags = () => {},
  saveButtonLabel = "Save Draft",
  saveDisabled = false,
  onSaveDraft = () => {},
  saveMessage = "",
  saveMessageTone = "success",
  nodeEditorSlot = null,
  openWorldSettingsSlot = null,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-4xl">{displayTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              {titleLabel}
            </span>
            <input
              value={titleValue}
              onChange={(event) => onChangeTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              {descriptionLabel}
            </span>
            <textarea
              rows={4}
              value={descriptionValue}
              onChange={(event) => onChangeDescription(event.target.value)}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {visibilityLabel}
              </span>
              <select
                value={visibilityValue}
                onChange={(event) => onChangeVisibility(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {contentRatingLabel}
              </span>
              <select
                value={contentRatingValue}
                onChange={(event) => onChangeContentRating(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none"
              >
                {contentRatingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              {tagsLabel}
            </span>
            <textarea
              rows={3}
              value={tagsValue}
              onChange={(event) => onChangeTags(event.target.value)}
              placeholder={tagsPlaceholder}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saveDisabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
        >
          <Save size={15} />
          {saveButtonLabel}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveMessageTone === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <div className="space-y-6">
        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          {nodeEditorSlot}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          {openWorldSettingsSlot}
        </div>
      </div>
    </section>
  );
}
