import { Clock, CloudSun, Settings } from "lucide-react";

import {
  SectionTitle,
  SelectField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function SlotFallback({ children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--ink-dim)]">
      {children}
    </div>
  );
}

export default function LocationRuntimeModulesSectionView({
  sectionBody,
  weatherEyebrow,
  weatherTitle,
  weatherDescription,
  weatherConfigureLabel,
  weatherEditLabel,
  weatherEnableLabel,
  weatherDisabledLabel,
  timeEyebrow,
  timeTitle,
  timeDescription,
  enableLabel,
  enabledLabel,
  inheritanceModeLabel,
  turnAdvanceLabel,
  dayLengthLabel,
  yearLengthLabel,
  startDayLabel,
  startMinutesLabel,
  dayLabelPrefixLabel,
  exactClockLabel,
  weatherModuleId,
  hasWeatherBinding = false,
  weatherEnabled = false,
  weatherModuleTitle,
  weatherStatusLabel,
  moduleId,
  timeCalendarEnabled = false,
  inheritanceMode = "INHERITABLE",
  timeCalendarProfile = {},
  statusLabel,
  runtimeBehaviorLabel,
  runtimeMechanicsSlot = null,
  registryAttachmentsSlot = null,
  runtimeMechanicsFallbackText,
  registryAttachmentsFallbackText,
  onOpenWeatherConfig = () => {},
  onToggleWeather = () => {},
  onToggleTimeCalendar = () => {},
  onChangeInheritanceMode = () => {},
  onChangeTurnAdvance = () => {},
  onChangeDayLength = () => {},
  onChangeYearLength = () => {},
  onChangeStartDay = () => {},
  onChangeStartMinutes = () => {},
  onChangeDayLabelPrefix = () => {},
  onChangeExactClockVisibility = () => {},
}) {
  return (
    <div>
      <SectionTitle body={sectionBody} />

      <div className="mt-6 grid gap-4">
        {runtimeMechanicsSlot || (
          <SlotFallback>{runtimeMechanicsFallbackText}</SlotFallback>
        )}

        <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
                <CloudSun size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  {weatherEyebrow}
                </p>
                <h3 className="mt-2 font-display text-3xl">{weatherTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-dim)]">
                  {weatherDescription}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWeatherConfig}
              className="cf-btn cf-btn--primary shrink-0"
            >
              <Settings size={14} />
              {hasWeatherBinding ? weatherEditLabel : weatherConfigureLabel}
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {hasWeatherBinding ? (
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
                <input
                  type="checkbox"
                  checked={weatherEnabled}
                  onChange={(event) => onToggleWeather(event.target.checked)}
                  className="h-4 w-4 accent-[var(--gold-ornament)]"
                />
                <span>
                  {weatherEnabled ? weatherEnableLabel : weatherDisabledLabel}
                </span>
              </label>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
                No Weather module is attached. Configure Weather to create and attach the location&apos;s
                in-world weather rules.
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]">
              <p>
                Module ID:{" "}
                <span className="text-[var(--ink)]">
                  {weatherModuleId}
                </span>
              </p>
              <p>
                Status:{" "}
                <span className="text-[var(--ink)]">
                  {weatherStatusLabel}
                </span>
              </p>
              <p>
                Bound module:{" "}
                <span className="text-[var(--ink)]">
                  {weatherModuleTitle}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
              <Clock size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {timeEyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl">{timeTitle}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-dim)]">
                {timeDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
              <input
                type="checkbox"
                checked={timeCalendarEnabled}
                onChange={(event) =>
                  onToggleTimeCalendar(event.target.checked)
                }
                className="h-4 w-4 accent-[var(--gold-ornament)]"
              />
              <span>{timeCalendarEnabled ? enabledLabel : enableLabel}</span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              {/* ED1C dropdown law: branded kit dropdown grammar. */}
              <SelectField
                label={inheritanceModeLabel}
                value={inheritanceMode}
                onChange={(value) => onChangeInheritanceMode(value)}
                options={[
                  {
                    value: "INHERITABLE",
                    label: "Inheritable / Parent authority can win",
                  },
                  {
                    value: "OVERRIDE",
                    label: "Local override / This location wins",
                  },
                ]}
              />

              <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                <span>{turnAdvanceLabel}</span>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={timeCalendarProfile.defaultTurnAdvanceMinutes}
                  onChange={(event) => onChangeTurnAdvance(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                <span>{dayLengthLabel}</span>
                <input
                  type="number"
                  min="60"
                  max="10080"
                  value={timeCalendarProfile.dayLengthMinutes}
                  onChange={(event) => onChangeDayLength(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                <span>{yearLengthLabel}</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={timeCalendarProfile.yearLengthDays}
                  onChange={(event) => onChangeYearLength(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                <span>{startDayLabel}</span>
                <input
                  type="number"
                  min="1"
                  value={timeCalendarProfile.startDay}
                  onChange={(event) => onChangeStartDay(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
                <span>{startMinutesLabel}</span>
                <input
                  type="number"
                  min="0"
                  max="10079"
                  value={timeCalendarProfile.startMinutes}
                  onChange={(event) => onChangeStartMinutes(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink-dim)] md:col-span-2">
                <span>{dayLabelPrefixLabel}</span>
                <input
                  type="text"
                  value={timeCalendarProfile.dayLabelPrefix}
                  onChange={(event) =>
                    onChangeDayLabelPrefix(event.target.value)
                  }
                  placeholder="Day"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
              <input
                type="checkbox"
                checked={Boolean(
                  timeCalendarProfile.showExactClockToComposer
                )}
                onChange={(event) =>
                  onChangeExactClockVisibility(event.target.checked)
                }
                className="h-4 w-4 accent-[var(--gold-ornament)]"
              />
              <span>{exactClockLabel}</span>
            </label>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]">
              <p>
                Module ID:{" "}
                <span className="text-[var(--ink)]">{moduleId}</span>
              </p>
              <p>
                Status:{" "}
                <span className="text-[var(--ink)]">{statusLabel}</span>
              </p>
              <p>
                Runtime behavior:{" "}
                <span className="text-[var(--ink)]">
                  {runtimeBehaviorLabel}
                </span>
              </p>
              <p>
                Current turn pacing:{" "}
                <span className="text-[var(--ink)]">
                  {timeCalendarProfile.defaultTurnAdvanceMinutes} minute(s)
                </span>
              </p>
            </div>
          </div>
        </div>

        {registryAttachmentsSlot || (
          <SlotFallback>{registryAttachmentsFallbackText}</SlotFallback>
        )}
      </div>
    </div>
  );
}
