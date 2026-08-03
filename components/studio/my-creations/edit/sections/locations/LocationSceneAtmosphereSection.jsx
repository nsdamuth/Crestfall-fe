"use client";

import LocationSensoryEnvironmentFields from "./LocationSensoryEnvironmentFields";
import LocationSceneAtmosphereSectionView from "./location-scene-atmosphere-section/LocationSceneAtmosphereSection.view";
import { useLocationSceneAtmosphereSectionViewModel } from "./location-scene-atmosphere-section/useLocationSceneAtmosphereSectionViewModel";

export default function LocationSceneAtmosphereSection(props) {
  const {
    viewProps,
    sensoryProfile,
    onChangeSensoryProfile,
  } = useLocationSceneAtmosphereSectionViewModel(props);

  return (
    <LocationSceneAtmosphereSectionView
      {...viewProps}
      sensoryEnvironmentSlot={
        <LocationSensoryEnvironmentFields
          sensoryProfile={sensoryProfile}
          onChange={onChangeSensoryProfile}
        />
      }
    />
  );
}
