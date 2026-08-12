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

// 1.1.0 (K1) fixtures: variant, O1 collapsed-preview resting state,
// O4 counter rule, mono, select composing KitDropdown.

export const kitFormFieldTextareaCollapsedEmptyFixture = {
  label: "Backstory",
  variant: "textarea",
  value: "",
  placeholder: "Tell the story of how they came to the Vermillion Coast",
  helper: "Tap to expand and write.",
  maxLength: 2000,
  count: 0,
  isDisabled: false,
  onChange: noop,
};

export const kitFormFieldTextareaCollapsedFilledFixture = {
  ...kitFormFieldTextareaCollapsedEmptyFixture,
  value:
    "A wanderer of the black crown sky, Lilith left the Vermillion Coast the night the tide turned to ash and has not looked back since.",
  count: 133,
};

export const kitFormFieldTextareaExpandedFixture = {
  ...kitFormFieldTextareaCollapsedFilledFixture,
  startExpanded: true,
};

export const kitFormFieldSelectFixture = {
  label: "Kind",
  variant: "select",
  value: "mage",
  options: [
    { value: "warrior", label: "Warrior", description: "Frontline melee specialist" },
    { value: "mage", label: "Mage", description: "Arcane damage and control" },
    { value: "rogue", label: "Rogue", description: "Stealth and precision" },
    { value: "cleric", label: "Cleric", isDisabled: true },
  ],
  isDisabled: false,
  onSelect: noop,
};

export const kitFormFieldNumberFixture = {
  label: "Age",
  variant: "number",
  value: "27",
  placeholder: "0",
  helper: "In years, at the story's start.",
  isDisabled: false,
  onChange: noop,
};

export const kitFormFieldMonoFixture = {
  label: "Reference ID",
  value: "CF-2026-08-12-LX09",
  mono: true,
  helper: "Assigned on creation, read only elsewhere.",
  isDisabled: false,
  onChange: noop,
};

export const kitFormFieldLongestContentFixture = {
  ...kitFormFieldTextareaCollapsedEmptyFixture,
  label: "Advanced prompting notes",
  value:
    "The full combined budget line renders at group level; this single field's preview line must truncate rather than wrap or overflow its one-control-height resting state no matter how long the entered value runs, from the opening sentence through every clause that follows until the character limit itself is finally reached.",
  maxLength: 320,
  count: 312,
};
