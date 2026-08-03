"use client";

import { useNpcRegistryBuilderViewModel } from "@/components/studio/create/npc-registry/npc-registry-builder/useNpcRegistryBuilderViewModel";

export function useNpcRegistryBuilder(options) {
  const { compatibilityProps } = useNpcRegistryBuilderViewModel(options);
  return compatibilityProps;
}
