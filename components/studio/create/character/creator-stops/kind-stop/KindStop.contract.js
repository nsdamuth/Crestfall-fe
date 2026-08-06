import {
  CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
  eastAsianZodiacOptions,
  genderPresentationOptions,
  mbtiTypeOptions,
  roleArchetypeOptions,
  speciesOptions,
  westernZodiacOptions,
} from "../../constants/constants";

export const KIND_STOP_CUSTOM_VALUE_MAX_LENGTH = CUSTOM_APPEARANCE_VALUE_MAX_LENGTH;

function toUnspecified(option) {
  return option.value === "" ? { ...option, label: "Unspecified" } : option;
}

export const SPECIES_OPTIONS = speciesOptions.map(toUnspecified);
export const GENDER_PRESENTATION_OPTIONS = genderPresentationOptions.map(toUnspecified);
export const MBTI_TYPE_OPTIONS = mbtiTypeOptions;
export const WESTERN_ZODIAC_OPTIONS = westernZodiacOptions;
export const EAST_ASIAN_ZODIAC_OPTIONS = eastAsianZodiacOptions;

export const ROLE_ARCHETYPE_OPTIONS = roleArchetypeOptions.map((option) =>
  option.value === "" ? { ...option, label: "None" } : option
);

export function isKnownRoleArchetype(value) {
  return ROLE_ARCHETYPE_OPTIONS.some((option) => option.value === value);
}
