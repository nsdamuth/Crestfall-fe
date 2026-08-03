"use client";

import { useState } from "react";

export const WEATHER_MODULE_ID = "core.inWorldWeather.v1";
export const TIME_CALENDAR_MODULE_ID = "core.timeCalendar.v1";

export const DEFAULT_TIME_CALENDAR_PROFILE = Object.freeze({
  dayLengthMinutes: 1440,
  yearLengthDays: 365,
  defaultTurnAdvanceMinutes: 10,
  startDay: 1,
  startMinutes: 540,
  dayLabelPrefix: "Day",
  showExactClockToComposer: false,
});

const DEFAULT_COPY = Object.freeze({
  sectionBody:
    "Attach runtime modules to this location. These modules become part of the story-room middleware stack when the location is used.",
  weatherEyebrow: "In-World Weather",
  weatherTitle: "Weather",
  weatherDescription:
    "Configure reusable weather conditions, climate behavior, allowed and blocked weather, condition weights, sensory notes, and composer presentation for this location.",
  weatherConfigureLabel: "Configure Weather",
  weatherEditLabel: "Edit Weather",
  weatherEnableLabel: "Enable weather rules for this location",
  weatherDisabledLabel: "Weather rules are disabled for this location",
  timeEyebrow: "Time / Calendar Support",
  timeTitle: "Time / Calendar",
  timeDescription:
    "Configure in-world time rules for this location. Parent calendar authority wins by default, while special locations can declare a local override.",
  enableLabel: "Enable time/calendar rules",
  enabledLabel: "Enable time/calendar rules for this location",
  inheritanceModeLabel: "Inheritance Mode",
  turnAdvanceLabel: "Default Turn Advance Minutes",
  dayLengthLabel: "Day Length Minutes",
  yearLengthLabel: "Year Length Days",
  startDayLabel: "Start Day",
  startMinutesLabel: "Start Minutes",
  dayLabelPrefixLabel: "Day Label Prefix",
  exactClockLabel:
    "Allow composer to see exact clock time, not only time-band label",
  runtimeMechanicsFallbackText:
    "Runtime Mechanics controls are supplied by the application Binding Shell.",
  registryAttachmentsFallbackText:
    "Registry attachment controls are supplied by the application Binding Shell.",
});

export function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function hasObjectKeys(value) {
  return Object.keys(normalizeObject(value)).length > 0;
}

export function normalizeNumber(value, fallback) {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getWeatherBinding(data = {}) {
  return normalizeArray(data.engine_module_bindings).find(
    (binding) => binding?.moduleId === WEATHER_MODULE_ID
  );
}

export function getTimeCalendarBinding(data = {}) {
  return normalizeArray(data.engine_module_bindings).find(
    (binding) => binding?.moduleId === TIME_CALENDAR_MODULE_ID
  );
}

export function getTimeCalendarBindingData(binding = {}) {
  return normalizeObject(binding?.data || binding?.instanceData);
}

export function getTimeCalendarProfile(binding = {}) {
  const bindingData = getTimeCalendarBindingData(binding);
  const nestedProfile = normalizeObject(
    bindingData.calendarProfile || bindingData.calendar_profile
  );
  const source = hasObjectKeys(nestedProfile) ? nestedProfile : bindingData;

  return {
    dayLengthMinutes: normalizeNumber(
      source.dayLengthMinutes || source.day_length_minutes,
      DEFAULT_TIME_CALENDAR_PROFILE.dayLengthMinutes
    ),
    yearLengthDays: normalizeNumber(
      source.yearLengthDays || source.year_length_days,
      DEFAULT_TIME_CALENDAR_PROFILE.yearLengthDays
    ),
    defaultTurnAdvanceMinutes: normalizeNumber(
      source.defaultTurnAdvanceMinutes ||
        source.default_turn_advance_minutes ||
        source.turnAdvanceMinutes ||
        source.turn_advance_minutes,
      DEFAULT_TIME_CALENDAR_PROFILE.defaultTurnAdvanceMinutes
    ),
    startDay: normalizeNumber(
      source.startDay || source.start_day,
      DEFAULT_TIME_CALENDAR_PROFILE.startDay
    ),
    startMinutes: normalizeNumber(
      source.startMinutes || source.start_minutes,
      DEFAULT_TIME_CALENDAR_PROFILE.startMinutes
    ),
    dayLabelPrefix:
      normalizeString(source.dayLabelPrefix || source.day_label_prefix) ||
      DEFAULT_TIME_CALENDAR_PROFILE.dayLabelPrefix,
    showExactClockToComposer:
      source.showExactClockToComposer === true ||
      source.show_exact_clock_to_composer === true,
  };
}

export function upsertWeatherBinding({ data, weatherBinding, patch }) {
  const bindings = normalizeArray(data.engine_module_bindings);
  const existingIndex = bindings.findIndex(
    (binding) => binding?.moduleId === WEATHER_MODULE_ID
  );
  const existingBinding =
    existingIndex >= 0 ? normalizeObject(bindings[existingIndex]) : {};

  const nextBinding = {
    ...existingBinding,
    ...patch,
    moduleId: WEATHER_MODULE_ID,
    moduleInstanceId:
      patch.moduleInstanceId ??
      weatherBinding?.moduleInstanceId ??
      existingBinding.moduleInstanceId ??
      "",
    moduleInstanceTitle:
      patch.moduleInstanceTitle ??
      weatherBinding?.moduleInstanceTitle ??
      existingBinding.moduleInstanceTitle ??
      "",
    enabled:
      patch.enabled ??
      weatherBinding?.enabled ??
      existingBinding.enabled ??
      true,
    priority:
      patch.priority ??
      (Number.isFinite(Number(weatherBinding?.priority))
        ? Number(weatherBinding.priority)
        : Number.isFinite(Number(existingBinding.priority))
          ? Number(existingBinding.priority)
          : 45),
    operationTriggers: {
      chatTurnDefault: "get_weather_context",
      ...(existingBinding.operationTriggers || {}),
      ...(weatherBinding?.operationTriggers || {}),
      ...(patch.operationTriggers || {}),
    },
  };

  return existingIndex >= 0
    ? bindings.map((binding, index) =>
        index === existingIndex ? nextBinding : binding
      )
    : [...bindings, nextBinding];
}

export function upsertTimeCalendarBinding({
  data,
  timeCalendarBinding,
  patch = {},
}) {
  const bindings = normalizeArray(data.engine_module_bindings);
  const existingIndex = bindings.findIndex(
    (binding) => binding?.moduleId === TIME_CALENDAR_MODULE_ID
  );
  const existingBinding =
    existingIndex >= 0 ? normalizeObject(bindings[existingIndex]) : {};

  const currentBindingData = getTimeCalendarBindingData(existingBinding);
  const patchData = normalizeObject(patch.data);
  const patchCalendarProfile = normalizeObject(
    patchData.calendarProfile || patchData.calendar_profile
  );

  const nextCalendarProfile = {
    ...getTimeCalendarProfile(existingBinding),
    ...patchCalendarProfile,
  };

  const nextData = {
    ...currentBindingData,
    ...patchData,
    calendarProfile: nextCalendarProfile,
  };

  if (!normalizeString(nextData.calendarAuthorityMode)) {
    delete nextData.calendarAuthorityMode;
  }

  delete nextData.calendar_profile;
  delete nextData.calendar_authority_mode;
  delete nextData.instanceData;

  const nextBinding = {
    ...existingBinding,
    ...patch,
    moduleId: TIME_CALENDAR_MODULE_ID,
    enabled:
      patch.enabled ??
      timeCalendarBinding?.enabled ??
      existingBinding.enabled ??
      true,
    inheritanceMode:
      patch.inheritanceMode ||
      timeCalendarBinding?.inheritanceMode ||
      existingBinding.inheritanceMode ||
      "INHERITABLE",
    priority:
      patch.priority ??
      (Number.isFinite(Number(timeCalendarBinding?.priority))
        ? Number(timeCalendarBinding.priority)
        : Number.isFinite(Number(existingBinding.priority))
          ? Number(existingBinding.priority)
          : 56),
    operationTriggers: {
      chatTurnDefault: "get_calendar_context",
      ...(existingBinding.operationTriggers || {}),
      ...(timeCalendarBinding?.operationTriggers || {}),
      ...(patch.operationTriggers || {}),
    },
    data: nextData,
  };

  delete nextBinding.instanceData;

  return existingIndex >= 0
    ? bindings.map((binding, index) =>
        index === existingIndex ? nextBinding : binding
      )
    : [...bindings, nextBinding];
}

export function useLocationRuntimeModulesSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const [weatherModalOpen, setWeatherModalOpen] = useState(false);
  const data = normalizeObject(form.data);
  const weatherBinding = getWeatherBinding(data);
  const timeCalendarBinding = getTimeCalendarBinding(data);
  const timeCalendarProfile = getTimeCalendarProfile(timeCalendarBinding);

  const hasWeatherBinding = Boolean(weatherBinding?.moduleInstanceId);
  const weatherEnabled =
    hasWeatherBinding && weatherBinding?.enabled !== false;

  const hasTimeCalendarBinding = Boolean(timeCalendarBinding);
  const timeCalendarEnabled =
    hasTimeCalendarBinding && timeCalendarBinding?.enabled !== false;
  const inheritanceMode =
    timeCalendarBinding?.inheritanceMode || "INHERITABLE";

  function writeWeatherBinding(patch) {
    updateDataField?.(
      "engine_module_bindings",
      upsertWeatherBinding({
        data,
        weatherBinding,
        patch,
      })
    );
  }

  function writeTimeCalendarBinding(patch) {
    updateDataField?.(
      "engine_module_bindings",
      upsertTimeCalendarBinding({
        data,
        timeCalendarBinding,
        patch,
      })
    );
  }

  function updateTimeCalendarProfileField(field, rawValue) {
    const numericFields = new Set([
      "defaultTurnAdvanceMinutes",
      "dayLengthMinutes",
      "yearLengthDays",
      "startDay",
      "startMinutes",
    ]);

    const value = numericFields.has(field)
      ? normalizeNumber(rawValue, timeCalendarProfile[field])
      : rawValue;

    writeTimeCalendarBinding({
      enabled: true,
      data: {
        calendarProfile: {
          [field]: value,
        },
      },
    });
  }

  function handleWeatherModuleSaved({
    moduleInstanceId,
    moduleInstanceTitle,
    priority,
  }) {
    updateDataField?.(
      "engine_module_bindings",
      upsertWeatherBinding({
        data,
        weatherBinding,
        patch: {
          moduleInstanceId,
          moduleInstanceTitle,
          enabled: true,
          priority: Number.isFinite(Number(priority)) ? Number(priority) : 45,
          operationTriggers: {
            chatTurnDefault: "get_weather_context",
          },
        },
      })
    );
  }

  return {
    form,
    updateDataField,
    weatherModalOpen,
    weatherBinding,
    locationTitle: data.name || form.title,
    closeWeatherModal: () => setWeatherModalOpen(false),
    handleWeatherModuleSaved,
    viewProps: {
      ...DEFAULT_COPY,
      weatherModuleId: WEATHER_MODULE_ID,
      hasWeatherBinding,
      weatherEnabled,
      weatherModuleTitle:
        normalizeString(weatherBinding?.moduleInstanceTitle) ||
        "No weather module attached",
      weatherStatusLabel: hasWeatherBinding
        ? weatherBinding?.enabled === false
          ? "Bound but disabled"
          : "Bound and enabled"
        : "Not configured",
      onOpenWeatherConfig: () => setWeatherModalOpen(true),
      onToggleWeather: (enabled) => {
        if (!hasWeatherBinding) {
          setWeatherModalOpen(true);
          return;
        }

        writeWeatherBinding({ enabled: Boolean(enabled) });
      },
      moduleId: TIME_CALENDAR_MODULE_ID,
      timeCalendarEnabled,
      inheritanceMode,
      timeCalendarProfile,
      statusLabel: hasTimeCalendarBinding
        ? timeCalendarBinding?.enabled === false
          ? "Bound but disabled"
          : "Bound and enabled"
        : "Not bound",
      runtimeBehaviorLabel:
        inheritanceMode === "OVERRIDE"
          ? "This location overrides parent calendar rules."
          : "Parent calendar authority may take precedence.",
      onToggleTimeCalendar: (enabled) =>
        writeTimeCalendarBinding({ enabled: Boolean(enabled) }),
      onChangeInheritanceMode: (value) => {
        const nextMode = normalizeString(value).toUpperCase() || "INHERITABLE";
        writeTimeCalendarBinding({
          enabled: true,
          inheritanceMode: nextMode,
          data: {
            calendarAuthorityMode:
              nextMode === "OVERRIDE" ? "LOCAL_OVERRIDE" : "",
          },
        });
      },
      onChangeTurnAdvance: (value) =>
        updateTimeCalendarProfileField("defaultTurnAdvanceMinutes", value),
      onChangeDayLength: (value) =>
        updateTimeCalendarProfileField("dayLengthMinutes", value),
      onChangeYearLength: (value) =>
        updateTimeCalendarProfileField("yearLengthDays", value),
      onChangeStartDay: (value) =>
        updateTimeCalendarProfileField("startDay", value),
      onChangeStartMinutes: (value) =>
        updateTimeCalendarProfileField("startMinutes", value),
      onChangeDayLabelPrefix: (value) =>
        updateTimeCalendarProfileField("dayLabelPrefix", value),
      onChangeExactClockVisibility: (value) =>
        updateTimeCalendarProfileField(
          "showExactClockToComposer",
          Boolean(value)
        ),
    },
  };
}
