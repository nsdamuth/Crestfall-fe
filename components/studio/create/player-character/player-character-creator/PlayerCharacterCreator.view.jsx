"use client";

import {
  BookOpen,
  CheckCircle2,
  Eye,
  PersonStanding,
  User,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import CrestfallOptionModal from "@/components/ui/CrestfallOptionModal";
import {
  CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
  genderPresentationOptions,
  speciesOptions,
} from "@/components/studio/create/character/constants/constants";
import { getCharacterColorPaletteLabel } from "@/components/studio/create/character/constants/characterColorPalettes";

const STEP_ICONS = {
  identity: User,
  appearance: Eye,
  body: PersonStanding,
  profile: BookOpen,
  review: CheckCircle2,
};

function resolveIdentityDisplayValue(
  selectedValue,
  customValue,
  emptyFallback,
  customFallback
) {
  const selected = String(selectedValue || "").trim();

  if (selected === "CUSTOM") {
    return String(customValue || "").trim() || customFallback;
  }

  return selected || emptyFallback;
}

export default function PlayerCharacterCreatorView({
  activeStep,
  activeIndex,
  stepItems,
  form,
  progress,
  saveStatus,
  saveMessage,
  saveDisabled,
  roleArchetypeOptions,
  visibilityOptions,
  contentRatingOptions,
  renderingStyleOptions,
  characterColorPaletteContent = null,
  skinToneContent = null,
  eyeColorContent = null,
  hairColorContent = null,
  hairStyleContent = null,
  defaultClothingContent = null,
  bodyTypeContent = null,
  heightContent = null,
  buildContent = null,
  onSelectStep,
  onUpdateField,
  onNormalizeAdultAge,
  onBack,
  onNext,
  onSave,
}) {
  return (
    <section className="mt-8">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Player Character Draft
            </p>
            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              {progress}% filled — all fields can be refined later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Draft →"}
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {stepItems.map((step) => {
            const Icon = STEP_ICONS[step.iconKey] || User;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep?.(step.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  step.active
                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : step.visited
                      ? "border-[var(--gold-ornament)]/25 bg-black/35 text-[var(--gold-ornament)]"
                      : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/25"
                }`}
              >
                <Icon size={17} />
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em]">
                  {step.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <PlayerCharacterPreview form={form} />

        <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
          {activeStep === "identity" ? (
            <IdentityStep
              form={form}
              roleArchetypeOptions={roleArchetypeOptions}
              characterColorPaletteContent={characterColorPaletteContent}
              onUpdateField={onUpdateField}
              onNormalizeAdultAge={onNormalizeAdultAge}
            />
          ) : null}

          {activeStep === "appearance" ? (
            <AppearanceStep
              skinToneContent={skinToneContent}
              eyeColorContent={eyeColorContent}
              hairColorContent={hairColorContent}
              hairStyleContent={hairStyleContent}
              defaultClothingContent={defaultClothingContent}
            />
          ) : null}

          {activeStep === "body" ? (
            <BodyStep
              form={form}
              bodyTypeContent={bodyTypeContent}
              heightContent={heightContent}
              buildContent={buildContent}
              onUpdateField={onUpdateField}
            />
          ) : null}

          {activeStep === "profile" ? (
            <ProfileStep form={form} onUpdateField={onUpdateField} />
          ) : null}

          {activeStep === "review" ? (
            <ReviewStep
              form={form}
              visibilityOptions={visibilityOptions}
              contentRatingOptions={contentRatingOptions}
              renderingStyleOptions={renderingStyleOptions}
              onUpdateField={onUpdateField}
            />
          ) : null}

          {saveMessage ? (
            <p
              className={`mt-4 text-sm ${
                saveStatus === "error" ? "text-red-200" : "text-emerald-200"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onBack?.()}
              disabled={activeIndex === 0}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {activeStep === "review" ? (
              <button
                type="button"
                onClick={() => onSave?.()}
                disabled={saveDisabled}
                className="rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/25 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveStatus === "saving" ? "Saving..." : "Finish Draft →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNext?.()}
                className="rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/25 hover:text-[var(--ink)]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayerCharacterPreview({ form }) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
      <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-gradient-to-br from-black via-black/75 to-[var(--gold-ornament)]/10">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <p className="font-display text-5xl text-[var(--gold-ornament)]">
              {(form.name || "P").slice(0, 1).toUpperCase()}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--ink-dim)]">
              Player Character Image
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-6 font-display text-4xl">
        {form.name || "Unnamed Player Character"}
      </h2>

      <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        {form.alias || form.role_archetype || "Private Persona"}
      </p>

      <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
        <p>
          {resolveIdentityDisplayValue(
            form.species,
            form.custom_species,
            "Species not chosen yet.",
            "Custom species not entered yet."
          )}
        </p>
        <p>
          {resolveIdentityDisplayValue(
            form.gender_presentation,
            form.custom_gender_presentation,
            "Gender presentation not chosen yet.",
            "Custom gender presentation not entered yet."
          )}
        </p>
        <p>{form.personality_summary || "Personality summary not added yet."}</p>
      </div>
    </aside>
  );
}

function IdentityStep({
  form,
  roleArchetypeOptions,
  characterColorPaletteContent,
  onUpdateField,
  onNormalizeAdultAge,
}) {
  return (
    <div>
      <StepTitle
        title="Identity"
        body="Define who this player character is. This is a persona or player identity, not an AI bot."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label="Name"
          value={form.name}
          onChange={(value) => onUpdateField?.("name", value)}
          placeholder="Character name"
        />

        <TextField
          label="Alias / Title"
          value={form.alias}
          onChange={(value) => onUpdateField?.("alias", value)}
          placeholder="Optional alias, title, or handle"
        />

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Age
          </span>

          <input
            type="number"
            min="18"
            inputMode="numeric"
            value={form.age}
            onChange={(event) => onUpdateField?.("age", event.target.value)}
            onBlur={() => onNormalizeAdultAge?.()}
            placeholder="18+"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
          />
        </label>

        <div className="space-y-4">
          <CrestfallSelect
            label="Species"
            value={form.species}
            onChange={(value) => onUpdateField?.("species", value)}
            options={speciesOptions}
          />

          {form.species === "CUSTOM" ? (
            <TextField
              label="Custom Species"
              value={form.custom_species || ""}
              onChange={(value) =>
                onUpdateField?.(
                  "custom_species",
                  value.slice(0, CUSTOM_APPEARANCE_VALUE_MAX_LENGTH)
                )
              }
              placeholder="Describe the player character’s species or ancestry."
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <CrestfallSelect
            label="Gender Presentation"
            value={form.gender_presentation}
            onChange={(value) => onUpdateField?.("gender_presentation", value)}
            options={genderPresentationOptions}
          />

          {form.gender_presentation === "CUSTOM" ? (
            <TextField
              label="Custom Gender Presentation"
              value={form.custom_gender_presentation || ""}
              onChange={(value) =>
                onUpdateField?.(
                  "custom_gender_presentation",
                  value.slice(0, CUSTOM_APPEARANCE_VALUE_MAX_LENGTH)
                )
              }
              placeholder="Describe how the player character presents."
            />
          ) : null}
        </div>

        <CrestfallOptionModal
          title="Select Role Archetype"
          triggerLabel="Role Archetype"
          value={form.role_archetype}
          onChange={(value) => onUpdateField?.("role_archetype", value)}
          options={roleArchetypeOptions}
          groups={["Fantasy", "Modern", "Sci-Fi"]}
          columns={3}
        />

        <div className="md:col-span-2">{characterColorPaletteContent}</div>
      </div>
    </div>
  );
}

function AppearanceStep({
  skinToneContent,
  eyeColorContent,
  hairColorContent,
  hairStyleContent,
  defaultClothingContent,
}) {
  return (
    <div>
      <StepTitle
        title="Appearance"
        body="Define the visual anchor for this player character. Images remain internally generated later; no file uploads."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {skinToneContent}
        {eyeColorContent}
        {hairColorContent}
        {hairStyleContent}
        {defaultClothingContent}
      </div>
    </div>
  );
}

function BodyStep({
  form,
  bodyTypeContent,
  heightContent,
  buildContent,
  onUpdateField,
}) {
  return (
    <div>
      <StepTitle
        title="Body"
        body="Define the adult character’s physical silhouette for narration and image generation."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {bodyTypeContent}
        {heightContent}
        {buildContent}

        <div className="md:col-span-2">
          <TextAreaField
            label="Custom Body Notes"
            value={form.body_notes}
            onChange={(value) => onUpdateField?.("body_notes", value)}
            placeholder="Optional physical details that should affect image generation or narration."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileStep({ form, onUpdateField }) {
  return (
    <div>
      <StepTitle
        title="Profile"
        body="Add lightweight roleplay context. These notes help the narrator frame scenes around your player character without controlling them."
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label="Personality Summary"
          value={form.personality_summary}
          onChange={(value) => onUpdateField?.("personality_summary", value)}
          placeholder="How should this player character generally come across?"
          rows={4}
        />

        <TextAreaField
          label="Backstory"
          value={form.backstory}
          onChange={(value) => onUpdateField?.("backstory", value)}
          placeholder="Optional context about origin, history, goals, important relationships, or story hooks."
          rows={6}
        />

        <TextAreaField
          label="Narration Notes"
          value={form.narrator_notes}
          onChange={(value) => onUpdateField?.("narrator_notes", value)}
          placeholder="Optional notes for how the narrator should recognize or frame this PC."
          rows={4}
        />

        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className="text-sm text-[var(--ink)]">
            Player control boundary
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            These notes inform narration and image generation. The AI should not
            speak or act for this player character unless a room setting
            explicitly allows it.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  visibilityOptions,
  contentRatingOptions,
  renderingStyleOptions,
  onUpdateField,
}) {
  return (
    <div>
      <StepTitle
        title="Review"
        body="Set visibility and image defaults before finishing this private draft."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
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

        <CrestfallSelect
          label="Default Rendering Style"
          value={form.default_rendering_style}
          onChange={(value) => onUpdateField?.("default_rendering_style", value)}
          options={renderingStyleOptions}
        />
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Draft Summary
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SummaryItem label="Name" value={form.name || "Unnamed PC"} />
          <SummaryItem label="Age" value={form.age || "Not chosen"} />
          <SummaryItem
            label="Species"
            value={resolveIdentityDisplayValue(
              form.species,
              form.custom_species,
              "Not chosen",
              "Custom species not entered yet."
            )}
          />
          <SummaryItem
            label="Role Archetype"
            value={form.role_archetype || "Not chosen"}
          />
          <SummaryItem
            label="Personality"
            value={form.personality_summary || "Not chosen"}
          />
          <SummaryItem
            label="Rendering"
            value={form.default_rendering_style || "Either / Auto"}
          />
          <SummaryItem
            label="Character Color Palette"
            value={getCharacterColorPaletteLabel(
              form.character_color_palette_id
            )}
          />
        </div>
      </div>
    </div>
  );
}

function StepTitle({ title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        Player Character Builder
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--ink)]">{value}</p>
    </div>
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

function TextAreaField({ label, value, onChange, placeholder, rows = 5 }) {
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
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}
