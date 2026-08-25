"use client";

import WalletProfileEditorView from "./wallet-profile-editor/WalletProfileEditor.view";
import { useWalletProfileEditorViewModel } from "./wallet-profile-editor/useWalletProfileEditorViewModel";
import WalletProfileJsonEditorModal from "./wallet-profile-json-editor/WalletProfileJsonEditorModal";

export default function WalletProfileEditor(props) {
  const { viewProps, jsonEditorProps } = useWalletProfileEditorViewModel(props);

  return (
    <>
      <WalletProfileEditorView {...viewProps} />
      {jsonEditorProps ? (
        <WalletProfileJsonEditorModal {...jsonEditorProps} />
      ) : null}
    </>
  );
}
