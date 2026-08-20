"use client";

import WalletProfileBuilderView from "./wallet-profile-builder/WalletProfileBuilder.view";
import { useWalletProfileBuilderViewModel } from "./wallet-profile-builder/useWalletProfileBuilderViewModel";

export default function WalletProfileBuilderShell(props) {
  const viewProps = useWalletProfileBuilderViewModel(props);
  return <WalletProfileBuilderView {...viewProps} />;
}
