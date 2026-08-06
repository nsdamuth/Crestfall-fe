"use client";

import { useEffect } from "react";
import {
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
  saveDisabled = false,
  hasUnsavedChanges = false,
  confirmDiscardOpen = false,
  onSelectStop = null,
  onBack = null,
  onNext = null,
  onSave = null,
  onClose = null,
  onKeepEditing = null,
  onConfirmDiscard = null,
  stopContent = null,
} = {}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      if (confirmDiscardOpen) {
        onKeepEditing?.();
      } else {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmDiscardOpen, onClose, onKeepEditing]);

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
        {confirmDiscardOpen ? (
          <div className="flex h-full flex-col items-center justify-center gap-[var(--space-4)] px-[var(--space-8)] text-center">
            <h2 className="font-display text-2xl text-[var(--ink)]">
              Discard this character?
            </h2>
            <p className="max-w-sm text-sm leading-6 text-[var(--ink-dim)]">
              Nothing on this character has been saved. Closing now discards
              it completely.
            </p>
            <div className="mt-[var(--space-2)] flex items-center gap-[var(--space-3)]">
              <button
                type="button"
                onClick={() => onKeepEditing?.()}
                className="cf-btn cf-btn--secondary"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={() => onConfirmDiscard?.()}
                className="cf-btn cf-btn--danger-filled"
              >
                Discard character
              </button>
            </div>
          </div>
        ) : (
          <>
        <div className="relative flex flex-none items-center gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-3)] after:absolute after:bottom-0 after:left-[var(--space-8)] after:right-[var(--space-8)] after:h-px after:bg-[var(--line-whisper)]">
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
            aria-label="Close character creator"
            className="ml-auto flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[var(--space-6)] pb-[var(--space-6)] pt-[var(--space-5)]">
          {stopContent}
        </div>

        <div className="relative flex flex-none items-center gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-3)] before:absolute before:left-[var(--space-8)] before:right-[var(--space-8)] before:top-0 before:h-px before:bg-[var(--line-whisper)]">
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
            disabled={saveDisabled}
            className="cf-btn cf-btn--secondary"
          >
            Save
          </button>

          <span aria-live="polite" className="inline-flex items-center">
            {hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--gold-ornament)]">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--gold-ornament)]" />
                <span className="hidden sm:inline">Unsaved changes</span>
              </span>
            ) : null}
          </span>

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
          </>
        )}
      </div>
    </div>
  );
}
