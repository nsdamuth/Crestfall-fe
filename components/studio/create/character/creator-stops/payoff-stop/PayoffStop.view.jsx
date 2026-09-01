"use client";

import CharacterPreview from "../../CharacterPreview";
import { Eyebrow, SectionLabel, TextAreaField } from "../shared/Controls";
import { PAYOFF_NOTES_MAX_LENGTH } from "./PayoffStop.contract";

export default function PayoffStopView({
  creationType = "CHARACTER",
  name = "",
  title = "",
  shortConcept = "",
  species = "",
  customSpecies = "",
  genderPresentation = "",
  customGenderPresentation = "",
  clothingStyle = "",
  creatorDirectives = "",
  extraRuntimeNotes = "",
  onChangeCreatorDirectives = null,
  creatorDirectivesPlaceholder = "Instructions for how the AI should run this character",
  onChangeExtraRuntimeNotes = null,
  onOpenStoryPanel = null,
  previewImageUrl = "",
  previewStatus = "idle",
  previewError = "",
  onGeneratePreview = null,
  // RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 2.2): the preview
  // panel and the Continue-into-a-story panel stay in both scopes;
  // quick create hides Advanced directives (Creator directives, Extra
  // runtime notes), editor only.
  fieldScope = "full",
} = {}) {
  const isQuick = fieldScope === "quick";

  return (
    <>
      <Eyebrow>The soul, forged</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Every choice, brought together.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The finished shape of every choice made so far. This preview lives
        here and nowhere else in the creator.
      </p>

      <div className="mt-6">
        <CharacterPreview
          creationType={creationType}
          form={{
            name,
            title,
            short_concept: shortConcept,
            species,
            custom_species: customSpecies,
            gender_presentation: genderPresentation,
            custom_gender_presentation: customGenderPresentation,
            clothing_style: clothingStyle,
          }}
          previewImageUrl={previewImageUrl}
          previewStatus={previewStatus}
          previewError={previewError}
          onGeneratePreview={onGeneratePreview}
        />
      </div>

      <button
        type="button"
        onClick={() => onOpenStoryPanel?.()}
        className="mt-4 text-[var(--text-ui)] text-[var(--ink-dim)] underline decoration-[var(--line-strong)] underline-offset-4 transition hover:text-[var(--gold-bright)]"
      >
        Continue into a story
      </button>

      {!isQuick ? (
        <div className="mt-6 space-y-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <SectionLabel>Advanced directives</SectionLabel>

          <TextAreaField
            label="Creator directives"
            value={creatorDirectives}
            onChange={onChangeCreatorDirectives}
            placeholder={creatorDirectivesPlaceholder}
            maxLength={PAYOFF_NOTES_MAX_LENGTH}
          />

          <TextAreaField
            label="Extra runtime notes"
            value={extraRuntimeNotes}
            onChange={onChangeExtraRuntimeNotes}
            placeholder="Anything else the story needs to know at runtime"
            maxLength={PAYOFF_NOTES_MAX_LENGTH}
          />
        </div>
      ) : null}
    </>
  );
}
