"use client";

import WeatherModuleConfigModalView from "./weather-module-config-modal/WeatherModuleConfigModal.view";
import { useWeatherModuleConfigModalViewModel } from "./weather-module-config-modal/useWeatherModuleConfigModalViewModel";

export default function WeatherModuleConfigModal(props) {
  const viewProps = useWeatherModuleConfigModalViewModel(props);

  return <WeatherModuleConfigModalView {...viewProps} />;
}
