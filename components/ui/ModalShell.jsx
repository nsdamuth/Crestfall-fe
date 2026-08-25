"use client";

import ModalShellView from "./modal-shell/ModalShell.view";
import { useModalShellViewModel } from "./modal-shell/useModalShellViewModel";

export default function ModalShell(props) {
  const viewProps = useModalShellViewModel(props);

  return <ModalShellView {...viewProps} />;
}
