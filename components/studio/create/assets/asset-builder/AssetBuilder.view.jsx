"use client";

import {
  CloudSun,
  Image as ImageIcon,
  MapPin,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  ASSET_IMAGE_PROMPT_MAX_LENGTH,
  ASSET_NEGATIVE_PROMPT_MAX_LENGTH,
} from "./AssetBuilder.contract";

export default function AssetBuilderView({
  config,
  creationType,
  form,
  extraFields,
  extraValues,
  candidates,
  selectedCover,
  supportsImagePromptFields,
  parentLocation,
  visibilityOptions,
  contentRatingOptions,
  renderingStyleOptions,
  imageCountOptions,
  poseEditorContent = null,
  locationRuntimeContent = null,
  locationRegistryContent = null,
  parentPickerContent = null,
  saveStatus,
  saveMessage,
  saveDisabled,
  onUpdateField,
  onUpdateExtra,
  onSelectCover,
  onOpenParentPicker,
  onClearParentLocation,
  onSave,
}) {
  const isLocation = creationType === "LOCATION";
  const isPose = creationType === "POSE";

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.46fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          {config.typeLabel} Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">{config.title}</h2>

        <p className="mt-3 leading-7 text-[var(--ink-dim)]">
          {config.description}
        </p>

        <div className="mt-6 grid gap-4">
          {!isPose ? (
            <>
              <TextField
                label="Name"
                value={form.name}
                onChange={(value) => onUpdateField?.("name", value)}
                placeholder={`e.g., ${config.typeLabel} Name`}
              />

              <TextAreaField
                label={config.promptLabel}
                value={form.prompt}
                onChange={(value) => onUpdateField?.("prompt", value)}
                placeholder={config.promptPlaceholder}
                rows={7}
              />
            </>
          ) : null}

          {supportsImagePromptFields ? (
            <>
              <TextAreaField
                label="Standalone Image Prompt"
                value={form.image_prompt}
                onChange={(value) => onUpdateField?.("image_prompt", value)}
                placeholder={`Optional standalone prompt for generating catalogue, preview, or reference images of this ${config.typeLabel.toLowerCase()} as its own visual asset.`}
                rows={5}
                maxLength={ASSET_IMAGE_PROMPT_MAX_LENGTH}
                helperText={`Optional. Used for standalone ${config.typeLabel.toLowerCase()} catalogue/reference generation. Max 2,000 characters.`}
              />

              <TextAreaField
                label="Negative Prompt"
                value={form.negative_prompt}
                onChange={(value) => onUpdateField?.("negative_prompt", value)}
                placeholder={`Optional negatives this ${config.typeLabel.toLowerCase()} should contribute when selected in image generation.`}
                rows={5}
                maxLength={ASSET_NEGATIVE_PROMPT_MAX_LENGTH}
                helperText={`Optional. Compiled into the negative prompt when this ${config.typeLabel.toLowerCase()} is selected. Max 2,000 characters.`}
              />
            </>
          ) : null}

          {extraFields.map((field) => (
            <CrestfallSelect
              key={field.id}
              label={field.label}
              value={extraValues[field.id] || ""}
              onChange={(value) => onUpdateExtra?.(field.id, value)}
              options={field.options}
            />
          ))}

          {isLocation ? (
            <LocationParentPanel
              parentLocation={parentLocation}
              onOpenParentPicker={onOpenParentPicker}
              onClearParentLocation={onClearParentLocation}
            />
          ) : null}

          {isLocation ? (
            <RuntimeInheritancePanel
              inheritance={extraValues.inheritance}
              onUpdateInheritance={(inheritance) =>
                onUpdateExtra?.("inheritance", inheritance)
              }
            />
          ) : null}

          {isLocation ? (
            <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
                  <CloudSun size={18} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                    Runtime Modules
                  </p>
                  <p className="mt-2 font-display text-2xl">
                    In-World Weather
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                    Configure weather rules now, or leave blank and add them
                    later from the Location edit page.
                  </p>
                </div>
              </div>

              {locationRuntimeContent ? (
                <div className="mt-4">{locationRuntimeContent}</div>
              ) : null}

              {locationRegistryContent ? (
                <div className="mt-4 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
                  {locationRegistryContent}
                </div>
              ) : null}
            </div>
          ) : null}

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

          <button
            type="button"
            disabled
            className="cf-btn cf-btn--secondary w-full"
          >
            <Sparkles size={15} />
            Generate test images soon
          </button>

          <TextField
            label="Description"
            value={form.description}
            onChange={(value) => onUpdateField?.("description", value)}
            placeholder="Brief public/private description."
          />

          {!isPose ? (
            <TextField
              label="Tags"
              value={form.tags}
              onChange={(value) => onUpdateField?.("tags", value)}
              placeholder="Type tags later."
            />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
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

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="cf-btn cf-btn--primary w-full"
          >
            <Save size={15} />
            {saveStatus === "saving" ? "Saving..." : "Save draft"}
          </button>

          {saveMessage ? (
            <p
              className={`text-sm ${
                saveStatus === "error" ? "text-red-200" : "text-emerald-200"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}
        </div>
      </aside>

      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
        {poseEditorContent ? (
          <div className="mb-6">{poseEditorContent}</div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Cover Image
            </p>
            <h2 className="mt-2 font-display text-3xl">Pick a Cover Image</h2>
          </div>

          <p className="text-sm text-[var(--ink-dim)]">
            Selected:{" "}
            <span className="text-[var(--ink)]">
              {selectedCover || "None"}
            </span>
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => {
            const active = selectedCover === candidate.id;

            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => onSelectCover?.(candidate.id)}
                className={`aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border text-left transition hover:-translate-y-1 ${
                  active
                    ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15"
                    : "border-white/10 bg-black/35 hover:border-[var(--gold-ornament)]/35"
                }`}
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
                  <div className="text-center">
                    <ImageIcon
                      className="mx-auto text-[var(--gold-ornament)]"
                      size={34}
                    />
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                      {candidate.label}
                    </p>
                    <p className="mt-2 px-4 text-sm text-[var(--ink-dim)]">
                      Generated preview placeholder
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <div className="flex items-start gap-3">
            <Tag className="mt-1 text-[var(--gold-ornament)]" size={18} />
            <div>
              <p className="text-sm text-[var(--ink)]">
                Future quick-save workflow
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                Later, successful custom prompts from Image Studio can be saved
                directly into this same asset type without leaving the image
                editor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {parentPickerContent}
    </section>
  );
}

function LocationParentPanel({
  parentLocation,
  onOpenParentPicker,
  onClearParentLocation,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        Parent Location
      </span>

      {parentLocation.id ? (
        <div className="mt-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-16 w-16 shrink-0 rounded-xl border border-white/10 bg-black/40 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  parentLocation.imageUrl || "/images/placeholder-card.jpg"
                })`,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="font-display text-xl">
                {parentLocation.title || "Selected Parent Location"}
              </p>

              <div className="mt-1 flex flex-wrap gap-2">
                {parentLocation.scale ? (
                  <LocationPill>{parentLocation.scale}</LocationPill>
                ) : null}
                {parentLocation.spaceType ? (
                  <LocationPill>{parentLocation.spaceType}</LocationPill>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpenParentPicker?.()}
              className="cf-btn cf-btn--secondary"
            >
              <MapPin size={14} />
              Change parent
            </button>

            <button
              type="button"
              onClick={() => onClearParentLocation?.()}
              className="cf-btn cf-btn--danger"
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm leading-6 text-[var(--ink-dim)]">
            Choose a broader parent location such as a realm, city, district,
            or building. This controls inherited runtime context.
          </p>

          <button
            type="button"
            onClick={() => onOpenParentPicker?.()}
            className="cf-btn cf-btn--secondary mt-4"
          >
            <MapPin size={14} />
            Select parent
          </button>
        </div>
      )}
    </div>
  );
}

function RuntimeInheritancePanel({ inheritance = {}, onUpdateInheritance }) {
  const values = {
    inheritsWeather: inheritance.inheritsWeather !== false,
    inheritsTime: inheritance.inheritsTime !== false,
    inheritsKnowledgeRules: inheritance.inheritsKnowledgeRules !== false,
    inheritsTravelRules: inheritance.inheritsTravelRules !== false,
  };

  function update(field, checked) {
    onUpdateInheritance?.({
      ...inheritance,
      [field]: checked,
    });
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        Runtime Inheritance
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        These settings control whether this location inherits runtime context
        from parent locations.
      </p>

      <div className="mt-4 grid gap-3">
        <InheritanceCheckbox
          label="Inherit Weather"
          checked={values.inheritsWeather}
          onChange={(checked) => update("inheritsWeather", checked)}
        />
        <InheritanceCheckbox
          label="Inherit Time / Calendar"
          checked={values.inheritsTime}
          onChange={(checked) => update("inheritsTime", checked)}
        />
        <InheritanceCheckbox
          label="Inherit Knowledge Rules"
          checked={values.inheritsKnowledgeRules}
          onChange={(checked) => update("inheritsKnowledgeRules", checked)}
        />
        <InheritanceCheckbox
          label="Inherit Travel Rules"
          checked={values.inheritsTravelRules}
          onChange={(checked) => update("inheritsTravelRules", checked)}
        />
      </div>
    </div>
  );
}

function InheritanceCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm text-[var(--ink-dim)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 accent-[var(--gold-ornament)]"
      />
      <span>{label}</span>
    </label>
  );
}

function LocationPill({ children }) {
  return (
    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
      {children}
    </span>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
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
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />

      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--ink-dim)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
