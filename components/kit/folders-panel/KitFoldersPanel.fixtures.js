// The four states AF3's brief names: default, empty, deep, longest.
// Each is the Shell's props (the caller's folder state plus a
// selection), so a fixture proves the rows the ViewModel derives and
// not only the View. Callbacks are noops; the store is never
// touched by a fixture.

const noop = () => {};

function folder(id, name, parentId = null, depth = 1) {
  return { id, name, parentId, depth, surface: "MEDIA", createdAt: "2026-09-14T00:00:00.000Z" };
}

const callbacks = {
  onSelectFolder: noop,
  onCreateFolder: noop,
  onRenameFolder: noop,
  onMoveFolder: noop,
  onDeleteFolder: noop,
  onNotice: noop,
  onClose: noop,
};

const defaultFolders = [
  folder("portraits", "Portraits"),
  folder("portraits-studio", "Studio", "portraits", 2),
  folder("locations", "Locations"),
];

const deepFolders = [
  folder("cast", "Cast"),
  folder("cast-heroes", "Heroes", "cast", 2),
  folder("cast-heroes-final", "Final looks", "cast-heroes", 3),
  folder("cast-villains", "Villains", "cast", 2),
];

const LONG_NAME_A = "Reference sheets for every outfit, pose, and lighting test";
const LONG_NAME_B = "Locations scouted in the northern reaches, second pass";

export const kitFoldersPanelFixtures = [
  {
    id: "default",
    label: "Two root folders, one sub-folder, a few filed items",
    props: {
      ...callbacks,
      host: "column",
      surface: "MEDIA",
      folders: defaultFolders,
      itemsByFolder: { portraits: ["img-1", "img-2"], "portraits-studio": ["img-3"], locations: ["img-4"] },
      allCount: 12,
      selectedFolderId: "portraits",
    },
  },
  {
    id: "empty",
    label: "No folders yet: All, the empty line, New folder",
    props: { ...callbacks, host: "column", surface: "MEDIA", folders: [], itemsByFolder: {}, allCount: 0, selectedFolderId: null },
  },
  {
    id: "deep",
    label: "Three levels, the cap, with the deepest row selected",
    props: {
      ...callbacks,
      host: "sheet",
      surface: "VAULT",
      folders: deepFolders.map((entry) => ({ ...entry, surface: "VAULT" })),
      itemsByFolder: { "cast-heroes-final": ["c-1", "c-2", "c-3"], "cast-villains": ["c-4"] },
      allCount: 9,
      selectedFolderId: "cast-heroes-final",
    },
  },
  {
    id: "longest",
    label: "Names at the 60 character cap, truncating at 390 and in the 18rem column",
    props: {
      ...callbacks,
      host: "column",
      surface: "MEDIA",
      folders: [
        folder("long-a", LONG_NAME_A),
        folder("long-a-sub", LONG_NAME_B, "long-a", 2),
        folder("long-a-sub-sub", "Third level with an equally long name for the width check", "long-a-sub", 3),
      ],
      itemsByFolder: { "long-a-sub-sub": Array.from({ length: 128 }, (_, index) => `img-${index}`) },
      allCount: 1284,
      selectedFolderId: null,
    },
  },
];

export default kitFoldersPanelFixtures;
