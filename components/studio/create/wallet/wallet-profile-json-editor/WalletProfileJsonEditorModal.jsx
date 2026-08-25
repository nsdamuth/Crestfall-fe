"use client";

import WalletProfileJsonEditorModalView from "./WalletProfileJsonEditorModal.view";
import { useWalletProfileJsonEditorViewModel } from "./useWalletProfileJsonEditorViewModel";

export default function WalletProfileJsonEditorModal(props) {
  const viewProps = useWalletProfileJsonEditorViewModel(props);
  return <WalletProfileJsonEditorModalView {...viewProps} />;
}
