const noop = () => {};

export const kitFormFieldDefaultFixture = {
  label: "Display name",
  value: "",
  placeholder: "Enter a display name",
  helper: "Shown on your public profile.",
  isDisabled: false,
  onChange: noop,
};

export const kitFormFieldFilledFixture = {
  ...kitFormFieldDefaultFixture,
  value: "Lilith of the Vermillion Coast",
};

export const kitFormFieldErrorFixture = {
  ...kitFormFieldDefaultFixture,
  label: "Character name",
  value: "L",
  helper: "",
  error: "Name must be at least 2 characters.",
};

export const kitFormFieldSuccessFixture = {
  ...kitFormFieldDefaultFixture,
  label: "Handle",
  value: "lilith-lux",
  helper: "",
  success: "This handle is available.",
};

export const kitFormFieldCounterFixture = {
  label: "Short bio",
  value: "A wanderer of the black crown sky.",
  placeholder: "Tell us about your character",
  helper: "Keep it brief.",
  maxLength: 40,
  count: 35,
  isDisabled: false,
  onChange: noop,
};

export const kitFormFieldCounterAtLimitFixture = {
  ...kitFormFieldCounterFixture,
  value: "A wanderer of the black crown sky forever",
  count: 40,
};

export const kitFormFieldFoldedFixture = {
  label: "Advanced Creator Guidance",
  isFolded: true,
  onToggleFold: noop,
  children: null,
};

export const kitFormFieldFoldedOpenChildrenFixture = {
  label: "Advanced Prompting",
  isFolded: false,
  onToggleFold: noop,
  maxLength: 32000,
  count: 4820,
};

export const kitFormFieldDisabledFixture = {
  ...kitFormFieldDefaultFixture,
  label: "Locked field",
  value: "Cannot be changed",
  helper: "This field is managed elsewhere.",
  isDisabled: true,
};

export const kitFormFieldLongestLabelFixture = {
  label: "The complete lineage and titles field, spanning several ancestral houses",
  value: "",
  placeholder:
    "Enter the full ancestral lineage, every house, and every title held across the Vermillion Coast",
  helper:
    "This supporting helper line is intentionally long enough to prove the field wraps text instead of overflowing its bed.",
  isDisabled: false,
  onChange: noop,
};
