"use client";

import { MapPin, Plus, X } from "lucide-react";

import SelectionCardView from "@/components/studio/room-templates/selection-card/SelectionCard.view";

export default function StoryOpeningLocationAuthoringView({
  mode = "FIXED",
  fixedLocation = null,
  allowedLocations = [],
  onChangeMode = null,
  onOpenFixedLocationPicker = null,
  onOpenAllowedLocationsPicker = null,
  onRemoveAllowedLocation = null,
} = {}) {
  const playerSelect = mode === "PLAYER_SELECT";
  const safeAllowedLocations = Array.isArray(allowedLocations)
    ? allowedLocations
    : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Opening Location
        </p>
        <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
          Choose how the Story begins
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          Use one fixed opening Location, or let the player choose from an
          authored set when the Story starts.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChangeMode?.("FIXED")}
          className={`rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
            !playerSelect
              ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
              : "border-[var(--line)] bg-black/20 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35"
          }`}
        >
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Fixed Location
          </span>
          <span className="mt-1 block text-sm leading-5">
            The Story always begins in one authored Location.
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode?.("PLAYER_SELECT")}
          className={`rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
            playerSelect
              ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
              : "border-[var(--line)] bg-black/20 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35"
          }`}
        >
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Player Selects
          </span>
          <span className="mt-1 block text-sm leading-5">
            The player chooses from the allowed opening Locations at launch.
          </span>
        </button>
      </div>

      {!playerSelect ? (
        <div className="mt-4">
          <SelectionCardView
            label="Fixed Opening Location"
            icon={MapPin}
            value={fixedLocation}
            placeholder="Optional Location"
            onOpen={onOpenFixedLocationPicker}
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Allowed Opening Locations
              </p>
              <p className="mt-1 text-sm leading-5 text-[var(--ink-dim)]">
                {safeAllowedLocations.length
                  ? `${safeAllowedLocations.length} Location${safeAllowedLocations.length === 1 ? "" : "s"} available at Story launch.`
                  : "No opening Locations selected yet."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenAllowedLocationsPicker?.()}
              className="cf-btn cf-btn--secondary"
            >
              <Plus size={14} />
              Select allowed Locations
            </button>
          </div>

          {safeAllowedLocations.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {safeAllowedLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-black/20 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl text-[var(--ink)]">
                      {location.title || "Attached Location"}
                    </p>
                    {location.subtitle || location.description ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
                        {location.subtitle || location.description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveAllowedLocation?.(location.id)}
                    className="shrink-0 text-[var(--status-danger)] transition hover:opacity-80"
                    aria-label={`Remove ${location.title || "opening Location"}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
