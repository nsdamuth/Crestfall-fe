const noop = () => {};

export const editorSaveBarIdleFixture = {
  hasUnsavedChanges: true,
  saveStatus: "idle",
  saveMessage: "",
  onSave: noop,
  onDiscard: noop,
};

export const editorSaveBarSavingFixture = {
  ...editorSaveBarIdleFixture,
  saveStatus: "saving",
};

export const editorSaveBarSavedFixture = {
  hasUnsavedChanges: false,
  saveStatus: "saved",
  saveMessage: "Saved.",
  onSave: noop,
  onDiscard: noop,
};

export const editorSaveBarErrorFixture = {
  ...editorSaveBarIdleFixture,
  saveStatus: "error",
  saveMessage: "Could not save. Try again.",
};

export const editorSaveBarHiddenFixture = {
  hasUnsavedChanges: false,
  saveStatus: "idle",
  saveMessage: "",
  onSave: noop,
  onDiscard: noop,
};
