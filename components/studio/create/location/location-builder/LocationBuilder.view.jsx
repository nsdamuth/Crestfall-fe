"use client";

import {
  Image as ImageIcon,
  MapPin,
  Save,
  Tag,
  X,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  LOCATION_IMAGE_PROMPT_MAX_LENGTH,
  LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
} from "./LocationBuilder.contract";

export default function LocationBuilderView({
  form,
  locationData,
  classificationFields,
  promptLabel,
  promptPlaceholder,
  candidates,
  selectedCover,
  runtimeSummary,
  visibilityOptions,
  contentRatingOptions,
  renderingStyleOptions,
  imageCountOptions,
  sensoryEnvironmentContent = null,
  runtimeModulesContent = null,
  registryAttachmentsContent = null,
  parentPickerContent = null,
  saveStatus,
  saveMessage,
  saveDisabled,
  onUpdateField,
  onUpdateLocationData,
  onUpdateInheritance,
  onSelectCover,
  onOpenParentPicker,
  onClearParentLocation,
  onSave,
}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Location Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">
          {form.name || "Unnamed Location"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--muted)]">
          Build a world space that can carry scene context, inheritance,
          registries, runtime modules, and image guidance.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Summary
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {locationData.locationScale ? (
              <SummaryPill label={locationData.locationScale} />
            ) : null}

            {locationData.space_type ? (
              <SummaryPill label={locationData.space_type} />
            ) : null}

            {locationData.mood ? (
              <SummaryPill label={locationData.mood} />
            ) : null}

            {locationData.parentLocationTitle ? (
              <SummaryPill label={`Parent: ${locationData.parentLocationTitle}`} />
            ) : (
              <SummaryPill label="No parent" />
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Runtime
          </p>

          <div className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
            <RuntimeLine
              label="Weather"
              value={
                locationData.inheritance?.inheritsWeather === false
                  ? "Local only"
                  : "Inherits"
              }
            />
            <RuntimeLine
              label="Time / Calendar"
              value={
                locationData.inheritance?.inheritsTime === false
                  ? "Local only"
                  : "Inherits"
              }
            />
            <RuntimeLine
              label="Weather Module"
              value={
                runtimeSummary.hasWeatherModule ? "Configured" : "Not configured"
              }
            />
            <RuntimeLine
              label="Time Module"
              value={
                runtimeSummary.hasTimeCalendarModule
                  ? "Configured"
                  : "Not configured"
              }
            />
            <RuntimeLine
              label="Registries"
              value={`${runtimeSummary.registryCount} attached`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save Draft"}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <div className="grid gap-6">
        <EditorCard eyebrow="Location Profile" title="Identity">
          <div className="grid gap-5">
            <TextField
              label="Name"
              value={form.name}
              onChange={(value) => onUpdateField?.("name", value)}
              placeholder="e.g., Moonwell Tea House"
            />

            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(value) => onUpdateField?.("description", value)}
              placeholder="Brief public/private description."
              rows={4}
            />

            <TextField
              label="Tags"
              value={form.tags}
              onChange={(value) => onUpdateField?.("tags", value)}
              placeholder="e.g., city, magical, market, tavern"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <CrestfallSelect
                label="Visibility"
                value={form.visibility}
                onChange={(value) => onUpdateField?.("visibility", value)}
                options={visibilityOptions}
              />

              <CrestfallSelect
                label="Content Rating"
                value={form.content_rating}
                onChange={(value) => onUpdateField?.("content_rating", value)}
                options={contentRatingOptions}
              />
            </div>
          </div>
        </EditorCard>

        <EditorCard eyebrow="World Detail" title="Location Guidance">
          <div className="grid gap-5">
            <TextAreaField
              label={promptLabel}
              value={form.prompt}
              onChange={(value) => onUpdateField?.("prompt", value)}
              placeholder={promptPlaceholder}
              rows={7}
            />

            <TextAreaField
              label="Standalone Image Prompt"
              value={form.image_prompt}
              onChange={(value) =>
                onUpdateField?.("image_prompt", value)
              }
              placeholder="Optional standalone prompt for generating catalogue, preview, or reference images of this location."
              rows={5}
              maxLength={LOCATION_IMAGE_PROMPT_MAX_LENGTH}
              helperText="Optional. Used later for standalone location image generation. Max 2,000 characters."
            />

            <TextAreaField
              label="Negative Prompt"
              value={form.negative_prompt}
              onChange={(value) =>
                onUpdateField?.("negative_prompt", value)
              }
              placeholder="Optional negatives this location should contribute when used in image generation."
              rows={5}
              maxLength={LOCATION_NEGATIVE_PROMPT_MAX_LENGTH}
              helperText="Optional. Compiled into the negative prompt when this location is selected. Max 2,000 characters."
            />
          </div>
        </EditorCard>

        <EditorCard eyebrow="Classification" title="Scale, Space, Mood">
          <div className="grid gap-4 md:grid-cols-3">
            {classificationFields?.map((field) => (
              <CrestfallSelect
                key={field.id}
                label={field.label}
                value={locationData[field.id] || ""}
                onChange={(value) => onUpdateLocationData?.(field.id, value)}
                options={field.options}
              />
            ))}
          </div>
        </EditorCard>

        <EditorCard eyebrow="Sensory Runtime" title="Sensory Environment">
          {sensoryEnvironmentContent}
        </EditorCard>

        <EditorCard eyebrow="Hierarchy" title="Parent Location">
          {locationData.parentLocationId ? (
            <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div
                className="h-20 w-20 rounded-xl border border-white/10 bg-black/40 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    locationData.parentLocationImageUrl ||
                    "/images/placeholder-card.jpg"
                  })`,
                }}
              />

              <div>
                <p className="font-display text-2xl">
                  {locationData.parentLocationTitle || "Selected Parent Location"}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {locationData.parentLocationScale ? (
                    <SummaryPill label={locationData.parentLocationScale} />
                  ) : null}

                  {locationData.parentLocationSpaceType ? (
                    <SummaryPill label={locationData.parentLocationSpaceType} />
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenParentPicker?.()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
                >
                  <MapPin size={14} />
                  Change
                </button>

                <button
                  type="button"
                  onClick={onClearParentLocation}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-red-400/40 hover:text-red-200"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                Choose a broader parent location such as a realm, planet, city,
                district, building, or room. Parent locations provide inherited
                runtime context when enabled.
              </p>

              <button
                type="button"
                onClick={() => onOpenParentPicker?.()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
              >
                <MapPin size={14} />
                Select Parent
              </button>
            </div>
          )}
        </EditorCard>

        <EditorCard eyebrow="Inheritance" title="Runtime Inheritance">
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
            These settings control whether this location inherits runtime context
            from parent locations. Local modules can still declare explicit
            overrides when needed.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <CheckField
              label="Inherit Weather"
              checked={locationData.inheritance?.inheritsWeather !== false}
              onChange={(value) => onUpdateInheritance?.("inheritsWeather", value)}
            />

            <CheckField
              label="Inherit Time / Calendar"
              checked={locationData.inheritance?.inheritsTime !== false}
              onChange={(value) => onUpdateInheritance?.("inheritsTime", value)}
            />

            <CheckField
              label="Inherit Knowledge Rules"
              checked={locationData.inheritance?.inheritsKnowledgeRules !== false}
              onChange={(value) =>
                onUpdateInheritance?.("inheritsKnowledgeRules", value)
              }
            />

            <CheckField
              label="Inherit Travel Rules"
              checked={locationData.inheritance?.inheritsTravelRules !== false}
              onChange={(value) => onUpdateInheritance?.("inheritsTravelRules", value)}
            />
          </div>
        </EditorCard>

        <EditorCard eyebrow="Runtime Modules" title="Location Runtime Modules">
          {runtimeModulesContent}
        </EditorCard>

        <EditorCard eyebrow="Location Registries" title="Registry Attachments">
          {registryAttachmentsContent}
        </EditorCard>

        <EditorCard eyebrow="Cover Image" title="Optional Cover Image">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
              Cover images are optional. Later, generated location previews can
              be saved here without making the image picker dominate the builder.
            </p>

            <p className="text-sm text-[var(--muted)]">
              Selected:{" "}
              <span className="text-[var(--foreground)]">
                {selectedCover || "None"}
              </span>
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {candidates.map((candidate) => {
              const active = selectedCover === candidate.id;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => onSelectCover?.(candidate.id)}
                  className={`aspect-[4/3] overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 ${
                    active
                      ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15"
                      : "border-white/10 bg-black/35 hover:border-[var(--muted-gold)]/35"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
                    <div className="text-center">
                      <ImageIcon
                        className="mx-auto text-[var(--muted-gold)]"
                        size={26}
                      />
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                        {candidate.label}
                      </p>
                      <p className="mt-1 px-4 text-xs text-[var(--muted)]">
                        Placeholder
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <CrestfallSelect
              label="Rendering Style"
              value={form.rendering_style}
              onChange={(value) => onUpdateField?.("rendering_style", value)}
              options={renderingStyleOptions}
            />

            <CrestfallSelect
              label="Number of Test Images"
              value={form.image_count}
              onChange={(value) => onUpdateField?.("image_count", value)}
              options={imageCountOptions}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <Tag className="mt-1 text-[var(--muted-gold)]" size={18} />
              <div>
                <p className="text-sm text-[var(--foreground)]">
                  Future quick-save workflow
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Later, successful custom prompts from Image Studio can be
                  saved directly into this location without leaving the image
                  editor.
                </p>
              </div>
            </div>
          </div>
        </EditorCard>
      </div>

      {parentPickerContent}
    </section>
  );
}

function EditorCard({ eyebrow, title, children }) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 font-display text-4xl">{title}</h2>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function RuntimeLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function SummaryPill({ label }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
      {label}
    </span>
  );
}

function CheckField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--muted-gold)]"
      />
      <span>{label}</span>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  maxLength,
  helperText,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />

      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}