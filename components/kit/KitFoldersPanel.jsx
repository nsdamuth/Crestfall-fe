"use client";

// Binding shell for the Folders panel (ASSET-FOLDERS plan, package
// AF3). A page passes its surface's folder state (from
// useFolderStore in lib/client/studio/folders) plus the selection
// and the five write callbacks; the ViewModel owns every transient
// state and the View renders. Mounted by AF5 (Media) and AF6
// (Vault); no page mounts it in this package.
import KitFoldersPanelView from "./folders-panel/KitFoldersPanel.view";
import { useKitFoldersPanelViewModel } from "./folders-panel/useKitFoldersPanelViewModel";

export default function KitFoldersPanel(props) {
  const viewProps = useKitFoldersPanelViewModel(props);

  return <KitFoldersPanelView {...viewProps} />;
}
