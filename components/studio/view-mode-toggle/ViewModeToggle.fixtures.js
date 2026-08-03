export const viewModeToggleGridFixture = {
  value: "grid",
  label: "View",
  onChange: null,
};

export const viewModeToggleListFixture = {
  ...viewModeToggleGridFixture,
  value: "list",
};

export const viewModeToggleCustomLabelFixture = {
  ...viewModeToggleGridFixture,
  label: "Layout",
};

export const viewModeToggleLongLabelFixture = {
  ...viewModeToggleListFixture,
  label: "Collection Display Mode",
};

export const viewModeToggleNoLabelFixture = {
  ...viewModeToggleGridFixture,
  label: "",
};
