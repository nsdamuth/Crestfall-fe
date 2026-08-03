import { Clock, CloudSun, Settings } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

function SlotFallback({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--muted)]">
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

        <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-3 text-[var(--muted-gold)]">
                <CloudSun size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                  {weatherEyebrow}
                </p>
                <h3 className="mt-2 font-display text-3xl">{weatherTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {weatherDescription}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenWeatherConfig}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              <Settings size={14} />
              {hasWeatherBinding ? weatherEditLabel : weatherConfigureLabel}
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {hasWeatherBinding ? (
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={weatherEnabled}
                  onChange={(event) => onToggleWeather(event.target.checked)}
                  className="h-4 w-4 accent-[var(--muted-gold)]"
                />
                <span>
                  {weatherEnabled ? weatherEnableLabel : weatherDisabledLabel}
                </span>
              </label>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                No Weather module is attached. Configure Weather to create and attach the location&apos;s
                in-world weather rules.
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--muted)]">
              <p>
                Module ID:{" "}
                <span className="text-[var(--foreground)]">
                  {weatherModuleId}
                </span>
              </p>
              <p>
                Status:{" "}
                <span className="text-[var(--foreground)]">
                  {weatherStatusLabel}
                </span>
              </p>
              <p>
                Bound module:{" "}
                <span className="text-[var(--foreground)]">
                  {weatherModuleTitle}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/30 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-3 text-[var(--muted-gold)]">
              <Clock size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                {timeEyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl">{timeTitle}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {timeDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={timeCalendarEnabled}
                onChange={(event) =>
                  onToggleTimeCalendar(event.target.checked)
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              <span>{timeCalendarEnabled ? enabledLabel : enableLabel}</span>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{inheritanceModeLabel}</span>
                <select
                  value={inheritanceMode}
                  onChange={(event) =>
                    onChangeInheritanceMode(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                >
                  <option value="INHERITABLE">
                    Inheritable / Parent authority can win
                  </option>
                  <option value="OVERRIDE">
                    Local override / This location wins
                  </option>
                </select>
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{turnAdvanceLabel}</span>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={timeCalendarProfile.defaultTurnAdvanceMinutes}
                  onChange={(event) => onChangeTurnAdvance(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{dayLengthLabel}</span>
                <input
                  type="number"
                  min="60"
                  max="10080"
                  value={timeCalendarProfile.dayLengthMinutes}
                  onChange={(event) => onChangeDayLength(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{yearLengthLabel}</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={timeCalendarProfile.yearLengthDays}
                  onChange={(event) => onChangeYearLength(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{startDayLabel}</span>
                <input
                  type="number"
                  min="1"
                  value={timeCalendarProfile.startDay}
                  onChange={(event) => onChangeStartDay(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                <span>{startMinutesLabel}</span>
                <input
                  type="number"
                  min="0"
                  max="10079"
                  value={timeCalendarProfile.startMinutes}
                  onChange={(event) => onChangeStartMinutes(event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)] md:col-span-2">
                <span>{dayLabelPrefixLabel}</span>
                <input
                  type="text"
                  value={timeCalendarProfile.dayLabelPrefix}
                  onChange={(event) =>
                    onChangeDayLabelPrefix(event.target.value)
                  }
                  placeholder="Day"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={Boolean(
                  timeCalendarProfile.showExactClockToComposer
                )}
                onChange={(event) =>
                  onChangeExactClockVisibility(event.target.checked)
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              <span>{exactClockLabel}</span>
            </label>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-6 text-[var(--muted)]">
              <p>
                Module ID:{" "}
                <span className="text-[var(--foreground)]">{moduleId}</span>
              </p>
              <p>
                Status:{" "}
                <span className="text-[var(--foreground)]">{statusLabel}</span>
              </p>
              <p>
                Runtime behavior:{" "}
                <span className="text-[var(--foreground)]">
                  {runtimeBehaviorLabel}
                </span>
              </p>
              <p>
                Current turn pacing:{" "}
                <span className="text-[var(--foreground)]">
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
