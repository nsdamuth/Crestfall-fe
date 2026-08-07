"use client";

import {
  CustomValueField,
  Eyebrow,
  FieldPair,
  Fold,
  InlineDropdown,
  SectionLabel,
  TileGrid,
} from "../shared/Controls";
import {
  EAST_ASIAN_ZODIAC_OPTIONS,
  GENDER_PRESENTATION_OPTIONS,
  isKnownRoleArchetype,
  KIND_STOP_CUSTOM_VALUE_MAX_LENGTH,
  MBTI_TYPE_OPTIONS,
  ROLE_ARCHETYPE_OPTIONS,
  SPECIES_OPTIONS,
  WESTERN_ZODIAC_OPTIONS,
} from "./KindStop.contract";

// Photographic species art was retired; every tile falls back to
// TileGrid's geometric placeholder mark.
const SPECIES_TILE_OPTIONS = SPECIES_OPTIONS;

// The being tiles break into labeled categories rather than one
// undifferentiated block, so a user can tell what each group selects.
// Unspecified opens the Folk group (rather than sitting alone in its
// own row) so it starts a full row like every other tile.
const SPECIES_CATEGORIES = [
  {
    label: "Folk",
    values: [
      "",
      "HUMAN",
      "ELF",
      "BASTET",
      "KITSUNE",
      "HARPY",
      "MERFOLK",
      "LAMIA",
      "WEREWOLF",
    ],
  },
  {
    label: "Otherworldly",
    values: ["DEMON", "ANGEL", "VAMPIRE", "GENIE"],
  },
  {
    label: "Other",
    values: ["CONSTRUCT", "ALIEN", "CUSTOM"],
  },
].map((category) => ({
  ...category,
  options: category.values
    .map((value) => SPECIES_TILE_OPTIONS.find((option) => option.value === value))
    .filter(Boolean),
}));

function RoleArchetypeField({ value, onChange }) {
  const isCustomMode = value === "CUSTOM" || (value !== "" && !isKnownRoleArchetype(value));

  if (isCustomMode) {
    return (
      <div>
        <SectionLabel>Role archetype</SectionLabel>
        <CustomValueField
          label="Custom Role Archetype"
          value={value === "CUSTOM" ? "" : value}
          onChange={onChange}
          placeholder="Describe their role or archetype"
          maxLength={KIND_STOP_CUSTOM_VALUE_MAX_LENGTH}
        />
        <button
          type="button"
          onClick={() => onChange?.("")}
          className="mt-[var(--space-2)] text-xs text-[var(--ink-dim)] underline decoration-[var(--line-strong)] underline-offset-4 transition hover:text-[var(--gold-bright)]"
        >
          Choose from the list instead
        </button>
      </div>
    );
  }

  return (
    <InlineDropdown
      label="Role archetype"
      options={ROLE_ARCHETYPE_OPTIONS}
      value={value}
      onChange={onChange}
      placeholder="None"
    />
  );
}

export default function KindStopView({
  species = "",
  customSpecies = "",
  genderPresentation = "",
  customGenderPresentation = "",
  shortConcept = "",
  mbtiType = "",
  westernZodiacSign = "",
  eastAsianZodiacSign = "",
  onChangeSpecies = null,
  onChangeCustomSpecies = null,
  onChangeGenderPresentation = null,
  onChangeCustomGenderPresentation = null,
  onChangeShortConcept = null,
  onChangeMbtiType = null,
  onChangeWesternZodiacSign = null,
  onChangeEastAsianZodiacSign = null,
  typingFoldOpen = false,
  onToggleTypingFold = null,
} = {}) {
  const typingFilled = Boolean(mbtiType || westernZodiacSign || eastAsianZodiacSign);

  return (
    <>
      <Eyebrow>Choose their kind</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What kind of being are they?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Choose from 15 kinds or write your own.
      </p>

      <div className="mt-6 space-y-[var(--space-3)]">
        {SPECIES_CATEGORIES.map((category) => (
          <div key={category.label}>
            <SectionLabel>{category.label}</SectionLabel>
            <TileGrid
              options={category.options}
              value={species}
              onChange={onChangeSpecies}
            />
          </div>
        ))}

        {species === "CUSTOM" ? (
          <CustomValueField
            label="Custom Species"
            value={customSpecies}
            onChange={onChangeCustomSpecies}
            placeholder="Describe the character's species or ancestry"
            maxLength={KIND_STOP_CUSTOM_VALUE_MAX_LENGTH}
          />
        ) : null}
      </div>

      <div className="mt-6">
        <FieldPair>
          <RoleArchetypeField value={shortConcept} onChange={onChangeShortConcept} />

          <div>
            <InlineDropdown
              label="Gender presentation"
              options={GENDER_PRESENTATION_OPTIONS}
              value={genderPresentation}
              onChange={onChangeGenderPresentation}
            />
            {genderPresentation === "CUSTOM" ? (
              <CustomValueField
                label="Custom Gender Presentation"
                value={customGenderPresentation}
                onChange={onChangeCustomGenderPresentation}
                placeholder="Describe the character's gender presentation"
                maxLength={KIND_STOP_CUSTOM_VALUE_MAX_LENGTH}
              />
            ) : null}
          </div>
        </FieldPair>
      </div>

      <Fold
        title="Typing and zodiac"
        sub="Optional personality-typing flavor"
        open={typingFoldOpen}
        onToggle={onToggleTypingFold}
        filled={typingFilled}
      >
        <InlineDropdown
          label="MBTI type"
          options={MBTI_TYPE_OPTIONS}
          value={mbtiType}
          onChange={onChangeMbtiType}
        />
        <InlineDropdown
          label="Western zodiac"
          options={WESTERN_ZODIAC_OPTIONS}
          value={westernZodiacSign}
          onChange={onChangeWesternZodiacSign}
        />
        <InlineDropdown
          label="East Asian zodiac"
          options={EAST_ASIAN_ZODIAC_OPTIONS}
          value={eastAsianZodiacSign}
          onChange={onChangeEastAsianZodiacSign}
        />
      </Fold>
    </>
  );
}
