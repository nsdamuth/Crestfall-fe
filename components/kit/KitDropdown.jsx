"use client";

import KitDropdownView from "./dropdown/KitDropdown.view";
import { useKitDropdownViewModel } from "./dropdown/useKitDropdownViewModel";

export default function KitDropdown(props) {
  const viewProps = useKitDropdownViewModel(props);

  return <KitDropdownView {...viewProps} />;
}
