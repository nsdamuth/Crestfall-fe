"use client";

import {
  ChipRow,
  CustomValueField,
  Eyebrow,
  Fold,
  InlineDropdown,
  SectionLabel,
  SwatchGrid,
  TextAreaField,
} from "../shared/Controls";
import {
  CUSTOM_VALUE_MAX_LENGTH,
  ETHNIC_APPEARANCE_OPTIONS,
  EYE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  HAIR_STYLE_OPTIONS,
  HAIR_TEXTURE_OPTIONS,
  SKIN_OPTIONS,
} from "./FaceStop.contract";
import { ASSET_NEGATIVE_PROMPT_GUIDANCE_MAX_LENGTH } from "@/lib/shared/image-generation/assetNegativePromptGuidance";

// Every description here just restates its label ("Chinese" / "Use a
// Chinese visual appearance."); the tooltip added no detail the label
// didn't already carry, so it's dropped here rather than kept as noise.
const ETHNIC_APPEARANCE_TILE_OPTIONS = ETHNIC_APPEARANCE_OPTIONS.map(
  ({ description, ...option }) => option
);

function EthnicAppearanceDropdown({ value, onChange }) {
  return (
    <InlineDropdown
      label="Ethnic Appearance"
      options={ETHNIC_APPEARANCE_TILE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

export default function FaceStopView({
  skinTone = "",
  eyeColor = "",
  hairColor = "",
  hairLength = "",
  hairTexture = "",
  hairStyle = "",
  ethnicAppearance = "",
  skinCustomValue = "",
  eyeCustomValue = "",
  hairCustomValue = "",
  onChangeSkinTone = null,
  onChangeEyeColor = null,
  onChangeHairColor = null,
  onChangeHairLength = null,
  onChangeHairTexture = null,
  onChangeHairStyle = null,
  onChangeEthnicAppearance = null,
  onChangeSkinCustomValue = null,
  onChangeEyeCustomValue = null,
  onChangeHairCustomValue = null,
  moreHairOpen = false,
  onToggleMoreHair = null,
  defaultClothingControl = null,
  negativePrompt = "",
  onChangeNegativePrompt = null,
} = {}) {
  return (
    <>
      <Eyebrow>Define their appearance</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Appearance
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Define the first visual anchor. Rendering style remains changeable later;
        the character identity is not locked to one image style.
      </p>

      <div className="mt-6">
        <SectionLabel>Skin</SectionLabel>
        <SwatchGrid
          options={SKIN_OPTIONS}
          value={skinTone}
          onChange={onChangeSkinTone}
        />
        {skinTone === "CUSTOM" ? (
          <CustomValueField
            label="Custom Skin Tone"
            value={skinCustomValue}
            onChange={onChangeSkinCustomValue}
            placeholder="Describe the skin tone"
            maxLength={CUSTOM_VALUE_MAX_LENGTH}
          />
        ) : null}
      </div>

      <div className="mt-6">
        <SectionLabel>Eyes</SectionLabel>
        <SwatchGrid
          options={EYE_OPTIONS}
          value={eyeColor}
          onChange={onChangeEyeColor}
        />
        {eyeColor === "CUSTOM" ? (
          <CustomValueField
            label="Custom Eye Color"
            value={eyeCustomValue}
            onChange={onChangeEyeCustomValue}
            placeholder="Describe the eye color"
            maxLength={CUSTOM_VALUE_MAX_LENGTH}
          />
        ) : null}
      </div>

      <div className="mt-6">
        <SectionLabel>Hair</SectionLabel>
        <SwatchGrid
          options={HAIR_COLOR_OPTIONS}
          value={hairColor}
          onChange={onChangeHairColor}
        />
        {hairColor === "CUSTOM" ? (
          <CustomValueField
            label="Custom Hair Color"
            value={hairCustomValue}
            onChange={onChangeHairCustomValue}
            placeholder="Describe the hair color"
            maxLength={CUSTOM_VALUE_MAX_LENGTH}
          />
        ) : null}
      </div>

      <div className="mt-6">
        <EthnicAppearanceDropdown
          value={ethnicAppearance}
          onChange={onChangeEthnicAppearance}
        />
      </div>

      {defaultClothingControl ? (
        <div className="mt-6">{defaultClothingControl}</div>
      ) : null}

      <div className="mt-6 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <SectionLabel>Image Generation Guidance</SectionLabel>
        <p className="mb-[var(--space-3)] text-sm leading-6 text-[var(--ink-dim)]">
          Optional persistent guidance that is added automatically whenever this character is selected in Image Studio.
        </p>
        <TextAreaField
          label="Negative Prompt"
          value={negativePrompt}
          onChange={onChangeNegativePrompt}
          placeholder="What should image generation avoid for this character?"
          maxLength={ASSET_NEGATIVE_PROMPT_GUIDANCE_MAX_LENGTH}
        />
      </div>

      <Fold
        title="More hair"
        sub="Length, texture, and style"
        open={moreHairOpen}
        onToggle={onToggleMoreHair}
      >
        <div>
          <SectionLabel>Length</SectionLabel>
          <ChipRow
            options={HAIR_LENGTH_OPTIONS}
            value={hairLength}
            onChange={onChangeHairLength}
          />
        </div>

        <div>
          <SectionLabel>Texture</SectionLabel>
          <ChipRow
            options={HAIR_TEXTURE_OPTIONS}
            value={hairTexture}
            onChange={onChangeHairTexture}
          />
        </div>

        <div>
          <SectionLabel>Style</SectionLabel>
          <ChipRow
            options={HAIR_STYLE_OPTIONS}
            value={hairStyle}
            onChange={onChangeHairStyle}
          />
        </div>
      </Fold>
    </>
  );
}
