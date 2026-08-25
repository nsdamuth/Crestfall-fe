import {
  bodyTypeOptions,
  buildOptions,
  heightOptions,
  kibbeIdentityOptions,
  proportionOptions,
} from "../../constants/constants";

export const SILHOUETTE_NOTES_MAX_LENGTH = 480;

export const KIBBE_IDENTITY_OPTIONS = kibbeIdentityOptions.map((option) =>
  option.value === "" ? { ...option, label: "Not chosen" } : option
);

export const BODY_TYPE_OPTIONS = bodyTypeOptions.map((option) => option.label);
export const HEIGHT_OPTIONS = heightOptions.map((option) => option.label);
export const BUILD_OPTIONS = buildOptions.map((option) => option.label);

function labelToValue(options, label) {
  return options.find((option) => option.label === label)?.value ?? "";
}

function valueToLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? "";
}

export function bodyTypeValueFromLabel(label) {
  return labelToValue(bodyTypeOptions, label);
}
export function bodyTypeLabelFromValue(value) {
  return valueToLabel(bodyTypeOptions, value);
}
export function heightValueFromLabel(label) {
  return labelToValue(heightOptions, label);
}
export function heightLabelFromValue(value) {
  return valueToLabel(heightOptions, value);
}
export function buildValueFromLabel(label) {
  return labelToValue(buildOptions, label);
}
export function buildLabelFromValue(value) {
  return valueToLabel(buildOptions, value);
}

export const PROPORTION_OPTIONS = proportionOptions;

export const DEFAULT_CLOTHING_MODE_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "OUTFIT", label: "Single outfit" },
  { value: "WARDROBE", label: "Wardrobe" },
];
