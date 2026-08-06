"use client";

import {
  Check,
  Fingerprint,
  Heart,
  ImageIcon,
  ShieldCheck,
  SmilePlus,
  User,
  X,
} from "lucide-react";

const STOP_ICONS = {
  name: User,
  kind: Fingerprint,
  face: SmilePlus,
  silhouette: User,
  heart: Heart,
  seal: ShieldCheck,
  payoff: ImageIcon,
};

export default function CreatorStopsView({
  activeStop = "name",
  activeIndex = 0,
  stopItems = [],
  isLastStop = false,
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  onSelectStop = null,
  onBack = null,
  onNext = null,
  onSave = null,
  onClose = null,
  stopContent = null,
} = {}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-3)] sm:p-[var(--space-8)]">
      <button
        type="button"
        aria-label="Close character creator"
        onClick={() => onClose?.()}
        className="absolute inset-0 cursor-pointer border-0 bg-[var(--scrim-strong)] p-0 backdrop-blur-[2px]"
      />

      <div
        className="relative flex h-[min(44rem,calc(100dvh-var(--space-3)*2))] w-[min(46rem,calc(100vw-var(--space-3)*2))] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] shadow-[var(--shadow-modal)] sm:h-[min(44rem,calc(100dvh-var(--space-5)*2))] sm:w-[min(46rem,calc(100vw-var(--space-8)*2))]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--surface-2) 88%, var(--canvas))",
          backgroundImage:
            "linear-gradient(var(--fill-whisper), var(--fill-whisper))",
        }}
      >
        <div className="relative flex flex-none items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] after:absolute after:bottom-0 after:left-[var(--space-6)] after:right-[var(--space-6)] after:h-px after:bg-[var(--line-whisper)]">
          <div className="flex min-w-0 flex-1 items-center justify-center gap-0">
            {stopItems.map((stop, index) => {
              const Icon = STOP_ICONS[stop.iconKey] || User;
              const isFirst = index === 0;
              const state = stop.active
                ? "on"
                : stop.seen && !stop.active
                  ? index < activeIndex
                    ? "done"
                    : "seen"
                  : "none";

              return (
                <div key={stop.id} className="flex items-center">
                  {!isFirst ? (
                    <span
                      className={`h-px w-[var(--space-2)] flex-none bg-[var(--line)] sm:w-[var(--space-5)] ${
                        index <= activeIndex
                          ? "bg-[var(--gold-action)] opacity-70"
                          : ""
                      }`}
                    />
                  ) : null}

                  <button
                    type="button"
                    onClick={() => (stop.reachable ? onSelectStop?.(stop.id) : null)}
                    disabled={!stop.reachable}
                    aria-label={stop.label}
                    aria-current={stop.active ? "step" : undefined}
                    className={`grid h-7 w-7 flex-none place-items-center rounded-[var(--radius-full)] border p-0 transition sm:h-8 sm:w-8 ${
                      state === "done"
                        ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
                        : state === "on"
                          ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                          : state === "seen"
                            ? "border-[var(--gold-ornament)] text-[var(--gold-ornament)] cursor-pointer"
                            : "cursor-default border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-faint)]"
                    }`}
                  >
                    <Icon size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close · your work is kept"
            className="ml-auto flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[var(--space-5)] pb-[var(--space-6)] pt-[var(--space-5)]">
          {stopContent}
        </div>

        <div className="relative flex flex-none items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] before:absolute before:left-[var(--space-6)] before:right-[var(--space-6)] before:top-0 before:h-px before:bg-[var(--line-whisper)]">
          <button
            type="button"
            onClick={() => onBack?.()}
            disabled={activeIndex === 0}
            aria-label="Back"
            className="flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] disabled:cursor-default disabled:opacity-35"
          >
            <span className="text-lg leading-none">&larr;</span>
          </button>

          <button
            type="button"
            onClick={() => onSave?.()}
            className={`inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] transition ${
              saveStatus === "saving"
                ? "text-[var(--gold-ornament)] opacity-100"
                : "text-[var(--ink-faint)] opacity-65 hover:text-[var(--gold-action)] hover:opacity-100"
            }`}
          >
            <Check size={12} />
            <span className="hidden sm:inline">
              {saveStatus === "saving" ? "Saving..." : "Saved · draft secured"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSave?.()}
            disabled={saveDisabled}
            className="cf-btn cf-btn--secondary"
          >
            Save
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => onNext?.()}
            disabled={saveDisabled}
            className="cf-btn cf-btn--primary"
          >
            {isLastStop ? "Finish" : "Next"}{" "}
            <span className="cf-btn__arrow">&rarr;</span>
          </button>
        </div>

        {saveMessage ? (
          <p className="absolute bottom-[calc(var(--control-md)+var(--space-6))] left-1/2 -translate-x-1/2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-4)] px-[var(--space-3)] py-[var(--space-1)] text-[var(--text-label)] text-[var(--ink)]">
            {saveMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
