"use client";

import AbilitySpellProfileBuilderView from "./ability-spell-profile-builder/AbilitySpellProfileBuilder.view";
import { useAbilitySpellProfileBuilderViewModel } from "./ability-spell-profile-builder/useAbilitySpellProfileBuilderViewModel";

export default function AbilitySpellProfileBuilderShell(props) {
  const viewProps = useAbilitySpellProfileBuilderViewModel(props);
  return <AbilitySpellProfileBuilderView {...viewProps} />;
}
