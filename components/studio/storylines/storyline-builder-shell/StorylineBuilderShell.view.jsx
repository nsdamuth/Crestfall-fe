"use client";

import { Save } from "lucide-react";

import KitDropdownView from "@/components/kit/dropdown/KitDropdown.view";
import CreateActionBar from "@/components/studio/create/create-action-bar/CreateActionBar";

export default function StorylineBuilderShellView({
  eyebrow = "Adventure Builder",
  displayTitle = "Untitled Adventure",
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
  saveButtonLabel = "Save draft",
  saveDisabled = false,
  onSaveDraft = () => {},
  saveMessage = "",
  saveMessageTone = "success",
  nodeEditorSlot = null,
  openWorldSettingsSlot = null,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      {/* MOBILE-SHELLS: min-w-0 on both grid children. Without it the
          implicit base column is sized by min-width:auto, so any nowrap
          descendant becomes the page's horizontal scroll width. This is
          the single-column rule for this shell: one column in DOM order
          below xl, each child free to shrink to the gutter. */}
      <aside className="min-w-0 self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-1)] p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-4xl">{displayTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              {titleLabel}
            </span>
            <input
              value={titleValue}
              onChange={(event) => onChangeTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--bed-deep)] shadow-[var(--shadow-bed)] px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              {descriptionLabel}
            </span>
            <textarea
              rows={4}
              value={descriptionValue}
              onChange={(event) => onChangeDescription(event.target.value)}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 outline-none"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                {visibilityLabel}
              </span>
              <div className="mt-2 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
                <KitDropdownView
                  options={visibilityOptions}
                  selectedValues={visibilityValue ? [visibilityValue] : []}
                  isMultiSelect={false}
                  onToggleOption={(nextValue) => onChangeVisibility(nextValue)}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                {contentRatingLabel}
              </span>
              <div className="mt-2 w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
                <KitDropdownView
                  options={contentRatingOptions}
                  selectedValues={contentRatingValue ? [contentRatingValue] : []}
                  isMultiSelect={false}
                  onToggleOption={(nextValue) => onChangeContentRating(nextValue)}
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              {tagsLabel}
            </span>
            <textarea
              rows={3}
              value={tagsValue}
              onChange={(event) => onChangeTags(event.target.value)}
              placeholder={tagsPlaceholder}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saveDisabled}
          className="cf-btn cf-btn--primary mt-6 w-full"
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

      <div className="min-w-0 space-y-6">
        <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-1)] p-6">
          {nodeEditorSlot}
        </div>

        <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-1)] p-6">
          {openWorldSettingsSlot}
        </div>
      </div>

      {/* MOBILE-SHELLS: the aside's Save draft is a full scroll away on a
          phone, so the same action docks to the bottom edge below md. The
          aside button is untouched and is what renders on desktop. */}
      <CreateActionBar
        label={saveButtonLabel}
        onAction={onSaveDraft}
        disabled={saveDisabled}
      />
    </section>
  );
}
