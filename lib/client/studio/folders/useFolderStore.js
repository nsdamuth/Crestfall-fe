"use client";

// React binding for the folder store: one hook a page calls with its
// surface, returning the live state and the five writes. Reads go
// through useSyncExternalStore, so there is no effect and no
// set-state-in-effect; the server snapshot is the empty tree, and the
// browser snapshot replaces it on hydration.
import { useMemo, useSyncExternalStore } from "react";

import { getFolderStore } from "./folderStore.js";

export function useFolderStore(surface) {
  const store = useMemo(() => getFolderStore(surface), [surface]);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return useMemo(
    () => ({
      surface,
      folders: state.folders,
      itemsByFolder: state.itemsByFolder,
      createFolder: store.createFolder,
      renameFolder: store.renameFolder,
      moveFolder: store.moveFolder,
      deleteFolder: store.deleteFolder,
      setItemFolder: store.setItemFolder,
    }),
    [surface, state, store]
  );
}
