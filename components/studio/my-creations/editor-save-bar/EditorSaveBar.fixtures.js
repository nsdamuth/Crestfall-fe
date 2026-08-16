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

// Contract 2.0.0 visibility law: a clean form after a successful
// save renders NOTHING. This fixture proves the hidden-after-save
// state alongside editorSaveBarHiddenFixture (hidden at rest).
export const editorSaveBarSavedFixture = {
  hasUnsavedChanges: false,
  saveStatus: "saved",
  saveMessage: "",
  onSave: noop,
  onDiscard: noop,
};

export const editorSaveBarErrorFixture = {
  ...editorSaveBarIdleFixture,
  saveStatus: "error",
  saveMessage: "Your changes could not be saved. Please try again.",
};

export const editorSaveBarHiddenFixture = {
  hasUnsavedChanges: false,
  saveStatus: "idle",
  saveMessage: "",
  onSave: noop,
  onDiscard: noop,
};
