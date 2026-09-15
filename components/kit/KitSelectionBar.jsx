"use client";

// Binding shell for the selection bar (ASSET-FOLDERS plan, package
// AF4). A page passes its own selection count, its folder tree, and
// the four handlers; the ViewModel owns the picker and confirm flags
// and the View renders. Mounted by AF5 (Media) and AF6 (Vault); no
// page mounts it in this package.
import KitSelectionBarView from "./selection-bar/KitSelectionBar.view";
import { useKitSelectionBarViewModel } from "./selection-bar/useKitSelectionBarViewModel";

export default function KitSelectionBar(props) {
  const viewProps = useKitSelectionBarViewModel(props);

  return <KitSelectionBarView {...viewProps} />;
}
