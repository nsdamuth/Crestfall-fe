"use client";

import LoreEngineUseView from "./lore-engine-use/LoreEngineUse.view";
import { useLoreEngineUseViewModel } from "./lore-engine-use/useLoreEngineUseViewModel";

export default function LoreEngineUse(props) {
  const viewProps = useLoreEngineUseViewModel(props);
  return <LoreEngineUseView {...viewProps} />;
}
