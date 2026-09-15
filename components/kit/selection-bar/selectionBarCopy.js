// The selection bar's copy and the noun helper, pure and React-free so
// the diagnostics can import them without the ViewModel's React and
// window dependencies.

export const SELECTION_BAR_COPY = Object.freeze({
  selected: (count) => `${count} selected`,
  addToFolder: "Add to folder",
  download: "Download",
  delete: "Delete",
  deleting: "Deleting...",
  done: "Done",
  cancel: "Cancel",
  notAvailable: "Not available yet",
  pickerTitle: "Add to folder",
  pickerEmpty: "No folders yet. Create one from Folders first.",
  deleteEyebrow: "Permanent deletion",
  deleteTitle: (count, noun) => `Delete ${count} selected ${noun}?`,
  deleteBody: "This cannot be undone.",
  deleteConfirm: (count) => `Delete ${count}`,
});

export function pluralize(count, noun) {
  const word = typeof noun === "string" && noun.trim() ? noun.trim() : "item";
  return count === 1 ? word : `${word}s`;
}
