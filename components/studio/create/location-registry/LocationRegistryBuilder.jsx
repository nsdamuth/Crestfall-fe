"use client";

import LocationRegistryBuilderView from "./location-registry-builder/LocationRegistryBuilder.view";
import { useLocationRegistryBuilderViewModel } from "./location-registry-builder/useLocationRegistryBuilderViewModel";

export default function LocationRegistryBuilder(props) {
  const viewProps = useLocationRegistryBuilderViewModel(props);

  return <LocationRegistryBuilderView {...viewProps} />;
}
