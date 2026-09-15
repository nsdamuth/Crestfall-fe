// The four states AF4's brief names: none (the bar renders nothing),
// one, many, and soon (Download and Delete on the Soon chip, the
// Vault case for Download per M3). Handlers are noops; the bar holds
// no selection.

const noop = () => {};

const folders = [
  { id: "portraits", parentId: null, name: "Portraits", depth: 1 },
  { id: "portraits-studio", parentId: "portraits", name: "Studio", depth: 2 },
  { id: "locations", parentId: null, name: "Locations", depth: 1 },
];

const handlers = { onAddToFolder: noop, onDownload: noop, onDelete: noop, onDone: noop };

export const kitSelectionBarFixtures = [
  { id: "none", label: "Nothing selected: the bar renders nothing", props: { ...handlers, selectedCount: 0, itemNoun: "image", folders } },
  { id: "one", label: "One image selected", props: { ...handlers, selectedCount: 1, itemNoun: "image", folders } },
  { id: "many", label: "Many images selected", props: { ...handlers, selectedCount: 24, itemNoun: "image", folders } },
  {
    id: "soon",
    label: "Vault: Download and Delete on the Soon chip",
    props: { ...handlers, selectedCount: 3, itemNoun: "creation", folders, isDownloadSoon: true, isDeleteSoon: true },
  },
];

export default kitSelectionBarFixtures;
