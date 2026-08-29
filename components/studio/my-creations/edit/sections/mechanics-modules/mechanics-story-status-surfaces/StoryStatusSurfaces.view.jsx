"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

import {
  STORY_STATUS_SURFACE_MECHANICS_BUCKETS,
  STORY_STATUS_SURFACE_PLACEMENTS,
  STORY_STATUS_SURFACE_PROGRESSION_VALUE_OPTIONS,
  STORY_STATUS_SURFACE_SOURCE_DOMAINS,
  STORY_STATUS_SURFACE_STATS_KINDS,
} from "./StoryStatusSurfaces.contract.js";

function Field({ label, value, onChange, placeholder = "", help = "", list }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span>{label}</span>
      <input
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        list={list}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]"
      />
      {help ? <span className="text-[11px] leading-5 text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}

function SelectField({ label, value, onChange, options, help = "" }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted)]">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
      >
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
      {help ? <span className="text-[11px] leading-5 text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}

function SmallButton({ children, onClick, title, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => onClick?.()}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-red-300/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          : "border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)] hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function ReadoutCard({
  surfaceIndex,
  readout,
  readoutIndex,
  readoutCount,
  mechanicsSourceOptions,
  patchReadout,
  removeReadout,
  moveReadout,
}) {
  const domain = readout.source?.domain || "MECHANICS";
  const mechanicsOptions = useMemo(
    () =>
      mechanicsSourceOptions.filter(
        (option) => !readout.source?.bucket || option.bucket === readout.source.bucket
      ),
    [mechanicsSourceOptions, readout.source?.bucket]
  );
  const dataListId = `story-status-mechanics-${surfaceIndex}-${readoutIndex}`;

  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Readout {readoutIndex + 1}
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]">
            {readout.label || readout.source?.valueId || "Unconfigured readout"}
          </p>
        </div>
        <div className="flex gap-2">
          <SmallButton
            title="Move readout up"
            disabled={readoutIndex === 0}
            onClick={() => moveReadout(surfaceIndex, readoutIndex, -1)}
          >
            <ArrowUp size={13} />
          </SmallButton>
          <SmallButton
            title="Move readout down"
            disabled={readoutIndex === readoutCount - 1}
            onClick={() => moveReadout(surfaceIndex, readoutIndex, 1)}
          >
            <ArrowDown size={13} />
          </SmallButton>
          <SmallButton
            title="Remove readout"
            danger
            onClick={() => removeReadout(surfaceIndex, readoutIndex)}
          >
            <Trash2 size={13} />
          </SmallButton>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field
          label="Display Label"
          value={readout.label}
          onChange={(value) => patchReadout(surfaceIndex, readoutIndex, { label: value })}
          placeholder="HP"
          help="Player-facing label only. It does not rename the authoritative value."
        />
        <SelectField
          label="Source Domain"
          value={domain}
          onChange={(value) =>
            patchReadout(surfaceIndex, readoutIndex, {
              source: { domain: value },
            })
          }
          options={STORY_STATUS_SURFACE_SOURCE_DOMAINS.map((value) => ({
            value,
            label:
              value === "MECHANICS"
                ? "This Mechanics Module"
                : value === "STATS_POOLS"
                  ? "Stats & Pools"
                  : value === "PROGRESSION"
                    ? "Progression"
                    : "Wallet",
          }))}
          help="The HUD reads the source live; it never copies that value into this module."
        />

        {domain === "MECHANICS" ? (
          <>
            <SelectField
              label="Mechanics State Type"
              value={readout.source?.bucket || "COUNTER"}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { bucket: value },
                })
              }
              options={STORY_STATUS_SURFACE_MECHANICS_BUCKETS}
            />
            <Field
              label="Mechanics Value"
              value={readout.source?.valueId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { valueId: value },
                })
              }
              placeholder="weather"
              list={mechanicsOptions.length ? dataListId : undefined}
              help={
                mechanicsOptions.length
                  ? "Choose an existing module value or enter its stable ID."
                  : "Enter the stable Mechanics state ID used by this module."
              }
            />
            {mechanicsOptions.length ? (
              <datalist id={dataListId}>
                {mechanicsOptions.map((option) => (
                  <option key={`${option.bucket}:${option.valueId}`} value={option.valueId}>
                    {option.label}
                  </option>
                ))}
              </datalist>
            ) : null}
          </>
        ) : null}

        {domain === "STATS_POOLS" ? (
          <>
            <SelectField
              label="Value Type"
              value={readout.source?.kind || "POOL"}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { kind: value },
                })
              }
              options={STORY_STATUS_SURFACE_STATS_KINDS.map((value) => ({
                value,
                label: value === "STAT" ? "Stat" : "Pool",
              }))}
            />
            <Field
              label="Stats Binding ID"
              value={readout.source?.bindingId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { bindingId: value },
                })
              }
              placeholder="stats"
              help="Optional when only one matching Stats & Pools binding is active; use the Actor Mechanics binding ID when disambiguation is needed."
            />
            <Field
              label="Stat / Pool ID"
              value={readout.source?.valueId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { valueId: value },
                })
              }
              placeholder="pool.health"
              help="Stable definition ID from the authoritative Stats & Pools Profile."
            />
          </>
        ) : null}


        {domain === "PROGRESSION" ? (
          <>
            <Field
              label="Progression Binding ID"
              value={readout.source?.bindingId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { bindingId: value },
                })
              }
              placeholder="progression"
              help="Optional when only one matching Progression binding is active; use the Actor Mechanics binding ID when disambiguation is needed."
            />
            <SelectField
              label="Progression Value"
              value={readout.source?.valueId || "level"}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { valueId: value },
                })
              }
              options={STORY_STATUS_SURFACE_PROGRESSION_VALUE_OPTIONS}
              help="Reads the authoritative Progression state. Existing valid aliases are preserved when loaded; new selections use canonical value IDs."
            />
          </>
        ) : null}

        {domain === "WALLET" ? (
          <>
            <Field
              label="Wallet Binding ID"
              value={readout.source?.bindingId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { bindingId: value },
                })
              }
              placeholder="wallet"
              help="Optional when only one matching Wallet binding is active."
            />
            <Field
              label="Currency ID"
              value={readout.source?.valueId || ""}
              onChange={(value) =>
                patchReadout(surfaceIndex, readoutIndex, {
                  source: { valueId: value },
                })
              }
              placeholder="currency.gold"
              help="Stable currency ID from the authoritative Wallet Profile."
            />
          </>
        ) : null}

        <Field
          label="Prefix"
          value={readout.prefix || ""}
          onChange={(value) => patchReadout(surfaceIndex, readoutIndex, { prefix: value })}
          placeholder=""
          help="Optional display text before the live value."
        />
        <Field
          label="Suffix"
          value={readout.suffix || ""}
          onChange={(value) => patchReadout(surfaceIndex, readoutIndex, { suffix: value })}
          placeholder=""
          help="Optional display text after the live value."
        />
        <Field
          label="Unavailable Label"
          value={readout.missingLabel || ""}
          onChange={(value) =>
            patchReadout(surfaceIndex, readoutIndex, { missingLabel: value })
          }
          placeholder="Unavailable"
          help="Shown when the authoritative source cannot resolve safely."
        />
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={readout.enabled !== false}
            onChange={(event) =>
              patchReadout(surfaceIndex, readoutIndex, { enabled: event.target.checked })
            }
            className="h-4 w-4 accent-[var(--muted-gold)]"
          />
          Readout enabled
        </label>
      </div>
    </div>
  );
}

function SurfaceCard({
  surface,
  surfaceIndex,
  surfaceCount,
  foldSignal,
  mechanicsSourceOptions,
  patchSurface,
  removeSurface,
  moveSurface,
  addReadout,
  patchReadout,
  removeReadout,
  moveReadout,
}) {
  const [expanded, setExpanded] = useState(surfaceIndex === 0);
  const host = String(surface.presentation?.host || "INLINE").toUpperCase();
  const inlineHost = host === "INLINE";

  useEffect(() => {
    if (!foldSignal?.revision) return;
    setExpanded(foldSignal.expanded === true);
  }, [foldSignal?.revision, foldSignal?.expanded]);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Story Status Surface
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-xl text-[var(--foreground)]">
                {surface.title || surface.id || `Status Surface ${surfaceIndex + 1}`}
              </h4>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{surface.summary}</p>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--muted-gold)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <div className="flex gap-2">
          <SmallButton
            title="Move surface up"
            disabled={surfaceIndex === 0}
            onClick={() => moveSurface(surfaceIndex, -1)}
          >
            <ArrowUp size={13} />
          </SmallButton>
          <SmallButton
            title="Move surface down"
            disabled={surfaceIndex === surfaceCount - 1}
            onClick={() => moveSurface(surfaceIndex, 1)}
          >
            <ArrowDown size={13} />
          </SmallButton>
          <SmallButton
            danger
            title="Remove status surface"
            onClick={() => removeSurface(surfaceIndex)}
          >
            <Trash2 size={13} />
          </SmallButton>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-white/10 p-5">
          {!inlineHost ? (
            <div className="mb-5 rounded-xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
              This surface uses the future host <strong>{host}</strong>. This editor preserves it and will not silently convert it to an inline header/footer.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Surface ID"
              value={surface.id}
              onChange={(value) => patchSurface(surfaceIndex, { id: value })}
              placeholder="character_status"
            />
            <Field
              label="Title"
              value={surface.title || ""}
              onChange={(value) => patchSurface(surfaceIndex, { title: value })}
              placeholder="Character"
              help="Optional heading displayed with this group of readouts."
            />
            <label className="grid gap-2 text-sm text-[var(--muted)]">
              <span>Presentation Host</span>
              <input
                readOnly
                value={host === "INLINE" ? "Inline in Story Room" : host}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--muted)] outline-none"
              />
              <span className="text-[11px] leading-5 text-[var(--muted)]">
                V1 supports inline presentation only. The readout contract is separate so modal/drawer hosts can be added later without redefining these values.
              </span>
            </label>
            {inlineHost ? (
              <SelectField
                label="Placement"
                value={surface.presentation?.placement || "BOTTOM"}
                onChange={(value) =>
                  patchSurface(surfaceIndex, {
                    presentation: { placement: value },
                  })
                }
                options={STORY_STATUS_SURFACE_PLACEMENTS.map((value) => ({
                  value,
                  label: value === "TOP" ? "Top / Header" : "Bottom / Footer",
                }))}
                help="Presentation only; changing placement never changes gameplay state."
              />
            ) : null}
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={surface.enabled !== false}
                onChange={(event) =>
                  patchSurface(surfaceIndex, { enabled: event.target.checked })
                }
                className="h-4 w-4 accent-[var(--muted-gold)]"
              />
              Surface enabled
            </label>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                  Authoritative Readouts
                </p>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--muted)]">
                  Choose what the player sees. These are read-only projections of the authoritative source; the HUD does not own a duplicate value.
                </p>
              </div>
              <SmallButton onClick={() => addReadout(surfaceIndex)}>
                <Plus size={13} />
                Add Readout
              </SmallButton>
            </div>

            {surface.readouts.length ? (
              <div className="mt-4 grid gap-3">
                {surface.readouts.map((readout, readoutIndex) => (
                  <ReadoutCard
                    key={readout.id || readoutIndex}
                    surfaceIndex={surfaceIndex}
                    readout={readout}
                    readoutIndex={readoutIndex}
                    readoutCount={surface.readouts.length}
                    mechanicsSourceOptions={mechanicsSourceOptions}
                    patchReadout={patchReadout}
                    removeReadout={removeReadout}
                    moveReadout={moveReadout}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--muted)]">
                No readouts yet. Add a value from this Mechanics Module, Stats & Pools, Progression, or Wallet.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function StoryStatusSurfacesView({
  statusSurfaces = [],
  foldSignal,
  mechanicsSourceOptions = [],
  addSurface,
  patchSurface,
  removeSurface,
  moveSurface,
  addReadout,
  patchReadout,
  removeReadout,
  moveReadout,
}) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-3xl">Story Status Surfaces</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Show live Mechanics, Stats & Pools, Progression, or Wallet values in a Story Room header or footer without duplicating their authoritative state. V1 renders inline; future modal or drawer hosts can reuse the same readouts.
          </p>
        </div>
        <SmallButton onClick={addSurface}>
          <Plus size={14} />
          Add Status Surface
        </SmallButton>
      </div>

      {statusSurfaces.length ? (
        <div className="mt-6 grid gap-4">
          {statusSurfaces.map((surface, surfaceIndex) => (
            <SurfaceCard
              key={surface.id || surfaceIndex}
              surface={surface}
              surfaceIndex={surfaceIndex}
              surfaceCount={statusSurfaces.length}
              foldSignal={foldSignal}
              mechanicsSourceOptions={mechanicsSourceOptions}
              patchSurface={patchSurface}
              removeSurface={removeSurface}
              moveSurface={moveSurface}
              addReadout={addReadout}
              patchReadout={patchReadout}
              removeReadout={removeReadout}
              moveReadout={moveReadout}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          No Story Status Surfaces yet. Add one when this module should expose live state persistently in the Story UI.
        </div>
      )}
    </section>
  );
}
