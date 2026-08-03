"use client";

import WeatherModuleConfigModal from "@/components/studio/my-creations/edit/sections/locations/WeatherModuleConfigModal";
import LocationRegistryAttachmentsSection from "@/components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection";
import RuntimeMechanicsModulesSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection";

import LocationRuntimeModulesSectionView from "./location-runtime-modules-section/LocationRuntimeModulesSection.view";
import { useLocationRuntimeModulesSectionViewModel } from "./location-runtime-modules-section/useLocationRuntimeModulesSectionViewModel";

export default function LocationRuntimeModulesSection(props) {
  const {
    form,
    updateDataField,
    viewProps,
    weatherModalOpen,
    weatherBinding,
    locationTitle,
    closeWeatherModal,
    handleWeatherModuleSaved,
  } = useLocationRuntimeModulesSectionViewModel(props);

  return (
    <>
      <LocationRuntimeModulesSectionView
        {...viewProps}
        runtimeMechanicsSlot={
          <RuntimeMechanicsModulesSection
            form={form}
            updateDataField={updateDataField}
            ownerLabel="this location"
            defaultInheritanceMode="INHERITABLE"
            defaultMechanicsScopeMode="BINDING_OWNER"
            showSectionTitle={false}
          />
        }
        registryAttachmentsSlot={
          <LocationRegistryAttachmentsSection
            form={form}
            updateDataField={updateDataField}
          />
        }
      />

      {weatherModalOpen ? (
        <WeatherModuleConfigModal
          locationTitle={locationTitle}
          weatherBinding={weatherBinding}
          onClose={closeWeatherModal}
          onSaved={handleWeatherModuleSaved}
        />
      ) : null}
    </>
  );
}
