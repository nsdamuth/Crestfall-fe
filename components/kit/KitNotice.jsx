"use client";

// Binding shell for the confirmation note (ASSET-FOLDERS plan,
// package AF1). Hands whatever a consumer passes to the ViewModel and
// renders the View. Mounted by AF5 (Media) and AF6 (Vault) beside
// their selection bar; neither wiring lands in this package.
import KitNoticeView from "./notice/KitNotice.view";
import { useKitNoticeViewModel } from "./notice/useKitNoticeViewModel";

export default function KitNotice(props) {
  const viewProps = useKitNoticeViewModel(props);

  return <KitNoticeView {...viewProps} />;
}
