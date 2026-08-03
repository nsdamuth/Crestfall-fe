const sharedCopy = {
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
  weatherModuleId: "core.inWorldWeather.v1",
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
  moduleId: "core.timeCalendar.v1",
  runtimeMechanicsFallbackText:
    "Runtime Mechanics controls are supplied by the application Binding Shell.",
  registryAttachmentsFallbackText:
    "Registry attachment controls are supplied by the application Binding Shell.",
};

export const locationRuntimeModulesBoundFixture = Object.freeze({
  ...sharedCopy,
  hasWeatherBinding: true,
  weatherEnabled: true,
  weatherModuleTitle: "Aethelgard Prism Climate",
  weatherStatusLabel: "Bound and enabled",
  timeCalendarEnabled: true,
  inheritanceMode: "OVERRIDE",
  timeCalendarProfile: {
    dayLengthMinutes: 1680,
    yearLengthDays: 420,
    defaultTurnAdvanceMinutes: 15,
    startDay: 12,
    startMinutes: 360,
    dayLabelPrefix: "Cycle",
    showExactClockToComposer: true,
  },
  statusLabel: "Bound and enabled",
  runtimeBehaviorLabel: "This location overrides parent calendar rules.",
});

export const locationRuntimeModulesInheritedFixture = Object.freeze({
  ...sharedCopy,
  hasWeatherBinding: true,
  weatherEnabled: true,
  weatherModuleTitle: "Parent District Weather",
  weatherStatusLabel: "Bound and enabled",
  timeCalendarEnabled: true,
  inheritanceMode: "INHERITABLE",
  timeCalendarProfile: {
    dayLengthMinutes: 1440,
    yearLengthDays: 365,
    defaultTurnAdvanceMinutes: 10,
    startDay: 1,
    startMinutes: 540,
    dayLabelPrefix: "Day",
    showExactClockToComposer: false,
  },
  statusLabel: "Bound and enabled",
  runtimeBehaviorLabel: "Parent calendar authority may take precedence.",
});

export const locationRuntimeModulesDisabledFixture = Object.freeze({
  ...sharedCopy,
  hasWeatherBinding: true,
  weatherEnabled: false,
  weatherModuleTitle: "Seasonal Weather Rules",
  weatherStatusLabel: "Bound but disabled",
  timeCalendarEnabled: false,
  inheritanceMode: "INHERITABLE",
  timeCalendarProfile: {
    dayLengthMinutes: 1440,
    yearLengthDays: 365,
    defaultTurnAdvanceMinutes: 10,
    startDay: 1,
    startMinutes: 540,
    dayLabelPrefix: "Day",
    showExactClockToComposer: false,
  },
  statusLabel: "Bound but disabled",
  runtimeBehaviorLabel: "Parent calendar authority may take precedence.",
});

export const locationRuntimeModulesUnboundFixture = Object.freeze({
  ...sharedCopy,
  hasWeatherBinding: false,
  weatherEnabled: false,
  weatherModuleTitle: "No weather module attached",
  weatherStatusLabel: "Not configured",
  timeCalendarEnabled: false,
  inheritanceMode: "INHERITABLE",
  timeCalendarProfile: {
    dayLengthMinutes: 1440,
    yearLengthDays: 365,
    defaultTurnAdvanceMinutes: 10,
    startDay: 1,
    startMinutes: 540,
    dayLabelPrefix: "Day",
    showExactClockToComposer: false,
  },
  statusLabel: "Not bound",
  runtimeBehaviorLabel: "Parent calendar authority may take precedence.",
});
