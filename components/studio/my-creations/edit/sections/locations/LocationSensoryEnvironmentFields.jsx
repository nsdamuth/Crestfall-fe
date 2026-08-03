"use client";

import LocationSensoryEnvironmentFieldsView from "./location-sensory-environment-fields/LocationSensoryEnvironmentFields.view";
import { useLocationSensoryEnvironmentFieldsViewModel } from "./location-sensory-environment-fields/useLocationSensoryEnvironmentFieldsViewModel";

export default function LocationSensoryEnvironmentFields(props) {
  const viewModel = useLocationSensoryEnvironmentFieldsViewModel(props);

  return <LocationSensoryEnvironmentFieldsView {...viewModel} />;
}
