"use client";

import { MapPin, Plus, X } from "lucide-react";
import CrestfallSelect from "@/components/ui/CrestfallSelect";

export default function StoryOpeningLocationAuthoringPanelView({
  mode = "FIXED",
  modeOptions = [],
  allowedLocations = [],
  validationMessage = "",
  onModeChange = null,
  onOpenLocationPicker = null,
  onRemoveAllowedLocation = null,
} = {}) {
  const playerSelect = mode === "PLAYER_SELECT";

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            <MapPin size={14} />
            Opening Location
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            Choose whether this Story begins at one fixed Location or lets the
            player choose from an authored allowed set before the Story room is
            created.
          </p>
        </div>

        <CrestfallSelect
          label="Opening Location Mode"
          value={mode}
          options={modeOptions}
          onChange={(value) => onModeChange?.(value)}
        />
      </div>

      {playerSelect ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Allowed Starting Locations
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                Only these Locations can be committed as the opening hard state.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenLocationPicker?.()}
              className="cf-btn cf-btn--secondary"
            >
              <Plus size={14} />
              Add Location
            </button>
          </div>

          {allowedLocations.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {allowedLocations.map((location) => (
                <span
                  key={location.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs text-[var(--ink)]"
                >
                  {location.title}
                  <button
                    type="button"
                    onClick={() =>
                      onRemoveAllowedLocation?.(location.id)
                    }
                    className="text-[var(--ink-dim)] transition hover:text-red-200"
                    aria-label={`Remove ${location.title}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-white/10 px-4 py-3 text-sm text-[var(--ink-dim)]">
              Add at least one allowed starting Location.
            </p>
          )}

          {validationMessage ? (
            <p className="mt-3 text-xs leading-5 text-amber-200">
              {validationMessage}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-[var(--ink-dim)]">
          The existing Location / Scene selection below remains the
          authoritative fixed opening Location.
        </p>
      )}
    </div>
  );
}
