const noop = () => {};

export const kitFilterChipDefaultFixture = {
  label: "Character",
  count: null,
  isSelected: false,
  variant: "default",
  isDisabled: false,
  onToggle: noop,
};

export const kitFilterChipSelectedFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Story",
  isSelected: true,
};

export const kitFilterChipCountedFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Public",
  count: 128,
};

export const kitFilterChipSortFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Most played",
  variant: "sort",
};

export const kitFilterChipToggleIdleFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Remixable only",
  variant: "toggle",
  isSelected: false,
};

export const kitFilterChipToggleArmedFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Remixable only",
  variant: "toggle",
  isSelected: true,
};

export const kitFilterChipDropdownExpandedFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Rating tier",
  variant: "dropdown",
  isSelected: true,
};

export const kitFilterChipDisabledFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Canon",
  isDisabled: true,
};

export const kitFilterChipLongestLabelFixture = {
  ...kitFilterChipDefaultFixture,
  label: "Faction Registry Attachments",
  count: 4,
};
