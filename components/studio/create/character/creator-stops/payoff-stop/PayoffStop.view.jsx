"use client";

import CharacterPreviewView from "../../character-preview/CharacterPreview.view";
import { useCharacterPreviewViewModel } from "../../character-preview/useCharacterPreviewViewModel";
import { Eyebrow, SectionLabel, TextAreaField } from "../shared/Controls";
import { PAYOFF_NOTES_MAX_LENGTH } from "./PayoffStop.contract";

export default function PayoffStopView({
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
  onChangeExtraRuntimeNotes = null,
} = {}) {
  const previewProps = useCharacterPreviewViewModel({
    form: {
      name,
      title,
      short_concept: shortConcept,
      species,
      custom_species: customSpecies,
      gender_presentation: genderPresentation,
      custom_gender_presentation: customGenderPresentation,
      clothing_style: clothingStyle,
    },
  });

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
        <CharacterPreviewView {...previewProps} />
      </div>

      <div className="mt-6 space-y-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <SectionLabel>Advanced directives</SectionLabel>

        <TextAreaField
          label="Creator directives"
          value={creatorDirectives}
          onChange={onChangeCreatorDirectives}
          placeholder="Instructions for how the AI should run this character"
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
    </>
  );
}
