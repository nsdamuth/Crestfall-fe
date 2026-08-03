"use client";

import { useMemo } from "react";

import { getCharacterColorPaletteLabel } from "@/components/studio/create/character/constants/characterColorPalettes";
import { kibbeIdentityOptions } from "@/components/studio/create/character/constants/constants";
import {
  CHARACTER_REVIEW_ADVANCED_FIELDS,
  CHARACTER_REVIEW_CONTENT_RATING_OPTIONS,
  CHARACTER_REVIEW_RENDERING_STYLE_OPTIONS,
  CHARACTER_REVIEW_VISIBILITY_OPTIONS,
} from "./CharacterReviewStep.contract";

function normalizeForm(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function resolveKibbeIdentityLabel(value) {
  return (
    kibbeIdentityOptions.find((option) => option.value === value)?.label ||
    "Not chosen"
  );
}

export function normalizeAdultAgeValue(value) {
  if (value && Number(value) < 18) return "18";
  return value;
}

export function buildCharacterReviewSummaryItems(formValue) {
  const form = normalizeForm(formValue);

  return [
    { key: "name", label: "Name", value: form.name || "Unnamed Character" },
    { key: "species", label: "Species", value: form.species || "Not chosen" },
    {
      key: "short_concept",
      label: "Role Archetype",
      value: form.short_concept || "Not chosen",
    },
    {
      key: "outward_personality",
      label: "Outward Personality",
      value: form.outward_personality || "Not chosen",
    },
    {
      key: "mbti_type",
      label: "MBTI Personality Type",
      value: form.mbti_type || "Not chosen",
    },
    {
      key: "western_zodiac_sign",
      label: "Western Zodiac",
      value: form.western_zodiac_sign || "Not chosen",
    },
    {
      key: "east_asian_zodiac_sign",
      label: "East Asian Zodiac",
      value: form.east_asian_zodiac_sign || "Not chosen",
    },
    {
      key: "kibbe_identity",
      label: "Kibbe-Inspired Identity",
      value: resolveKibbeIdentityLabel(form.kibbe_identity),
    },
    {
      key: "body_type",
      label: "Body Type",
      value: form.body_type || "Not chosen",
    },
    {
      key: "rendering",
      label: "Rendering",
      value: `${form.rendering_style || "Either"} / ${
        form.rendering_preset || "Auto"
      }`,
    },
    {
      key: "character_color_palette_id",
      label: "Character Color Palette",
      value: getCharacterColorPaletteLabel(form.character_color_palette_id),
    },
  ];
}

export default function useCharacterReviewStepViewModel({
  form: formValue,
  updateField,
  advancedOpen = false,
  setAdvancedOpen,
} = {}) {
  const form = normalizeForm(formValue);

  const selectFields = useMemo(
    () => [
      {
        key: "visibility",
        label: "Visibility",
        value: form.visibility,
        options: CHARACTER_REVIEW_VISIBILITY_OPTIONS,
      },
      {
        key: "content_rating",
        label: "Content Rating",
        value: form.content_rating,
        options: CHARACTER_REVIEW_CONTENT_RATING_OPTIONS,
      },
      {
        key: "rendering_style",
        label: "Default Rendering Style",
        value: form.rendering_style,
        options: CHARACTER_REVIEW_RENDERING_STYLE_OPTIONS,
      },
    ],
    [form.content_rating, form.rendering_style, form.visibility]
  );

  const advancedFields = useMemo(
    () =>
      CHARACTER_REVIEW_ADVANCED_FIELDS.map((field) => ({
        ...field,
        value: form[field.key],
      })),
    [
      form.appearance_notes,
      form.backstory,
      form.extra_runtime_notes,
      form.greeting,
      form.personality_notes,
      form.relationship_to_player,
      form.scenario,
    ]
  );

  const summaryItems = useMemo(
    () => buildCharacterReviewSummaryItems(form),
    [
      form.body_type,
      form.character_color_palette_id,
      form.east_asian_zodiac_sign,
      form.kibbe_identity,
      form.mbti_type,
      form.name,
      form.outward_personality,
      form.rendering_preset,
      form.rendering_style,
      form.short_concept,
      form.species,
      form.western_zodiac_sign,
    ]
  );

  function handleNormalizeAge() {
    const nextAge = normalizeAdultAgeValue(form.age);

    if (nextAge !== form.age) {
      updateField?.("age", nextAge);
    }
  }

  return {
    viewProps: {
      selectFields,
      ageValue: form.age,
      advancedOpen: Boolean(advancedOpen),
      advancedFields,
      summaryItems,
      onSelectChange: (key, value) => updateField?.(key, value),
      onAgeChange: (value) => updateField?.("age", value),
      onNormalizeAge: handleNormalizeAge,
      onToggleAdvanced: () =>
        setAdvancedOpen?.((current) => !current),
      onAdvancedFieldChange: (key, value) => updateField?.(key, value),
    },
    advancedPromptingProps: {
      value: form.creator_directives,
      onChange: (value) => updateField?.("creator_directives", value),
    },
  };
}
