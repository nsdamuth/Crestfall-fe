"use client";

import MechanicsModuleFieldsSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection";

import MechanicsModuleBuilderView from "./mechanics-module-builder/MechanicsModuleBuilder.view";
import { useMechanicsModuleBuilderViewModel } from "./mechanics-module-builder/useMechanicsModuleBuilderViewModel";

export default function MechanicsModuleBuilderShell(props) {
  const { mechanicsFieldsProps, ...viewProps } =
    useMechanicsModuleBuilderViewModel(props);

  return (
    <MechanicsModuleBuilderView
      {...viewProps}
      runtimeFieldsContent={
        <MechanicsModuleFieldsSection {...mechanicsFieldsProps} />
      }
    />
  );
}
