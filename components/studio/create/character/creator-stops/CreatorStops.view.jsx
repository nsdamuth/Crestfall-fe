"use client";

import { useEffect, useRef } from "react";
import {
  BookOpen,
  Compass,
  Fingerprint,
  Heart,
  ImageIcon,
  Palette,
  ShieldCheck,
  Shirt,
  SmilePlus,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";

import SecondaryPanel from "./shared/SecondaryPanel";

const STOP_ICONS = {
  name: User,
  kind: Fingerprint,
  face: SmilePlus,
  silhouette: User,
  heart: Heart,
  seal: ShieldCheck,
  payoff: ImageIcon,
  // Additive, RULED (world-quick-create fixes): the Worlds quick
  // create's non-"name" stop ids. Character's own icons above are
  // unchanged.
  premise: BookOpen,
  setting: Compass,
  tone: Palette,
  look: ImageIcon,
  // Additive, RULED (look-quick-create brief): the Looks
  // quick create's non-"name", non-"look" stop ids. World's and
  // Character's icons above are unchanged.
  vibe: Sparkles,
  garments: Shirt,
  palette: Palette,
  // Additive, RULED (story-quick-create brief): the
  // Stories quick create's non-"name" stop ids. "setting" already
  // resolves to Compass above (shared with World's setting stop); no
  // change needed there. Every prior package's icons are unchanged.
  cast: Users,
  cover: ImageIcon,
};

export default function CreatorStopsView({
  activeStop = "name",
  activeIndex = 0,
  stopItems = [],
  isLastStop = false,
  saveDisabled = false,
  hasUnsavedChanges = false,
  confirmDiscardOpen = false,
  isSaving = false,
  saveError = null,
  // The save-and-reaccess loop, RULED 11 Aug 2026: true immediately
  // after a confirmed save, cleared by the consumer the moment the
  // form changes again. Swaps the footer to the two-action post-save
  // state (onContinueInEditor, onDone) in place of the normal footer.
  justSaved = false,
  onSelectStop = null,
  onBack = null,
  onNext = null,
  onSave = null,
  onFinishAndSave = null,
  onContinueInEditor = null,
  onDone = null,
  onClose = null,
  onKeepEditing = null,
  onConfirmDiscard = null,
  // Per-creator close label, RULED 23 Aug 2026 (build-0823 pass 5):
  // additive, defaults to the pre-existing Character copy so no
  // caller is forced to pass it. World/Look/Story modals each pass
  // their own creator name.
  closeAriaLabel = "Close character creator",
  stopContent = null,
  // A field that needs more room than a fold hands this in to take
  // over the content area in place: { eyebrow, title, description,
  // body, onCancel, applyLabel, onApply, applyDisabled }. onApply is
  // optional, some panels apply their choice immediately per item and
  // only need Cancel.
  secondaryPanel = null,
} = {}) {
  const contentRef = useRef(null);
  const savedScrollRef = useRef(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      if (confirmDiscardOpen) {
        onKeepEditing?.();
      } else if (secondaryPanel) {
        secondaryPanel.onCancel?.();
      } else {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmDiscardOpen, secondaryPanel, onClose, onKeepEditing]);

  // The panel takes over the same scrollable region a stop's fields
  // live in, so a user returns to the exact scroll position they left
  // on that stop, not the top of it.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    if (secondaryPanel) {
      savedScrollRef.current = node.scrollTop;
      node.scrollTop = 0;
    } else {
      node.scrollTop = savedScrollRef.current;
    }
  }, [secondaryPanel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-[var(--space-8)]">
      <button
        type="button"
        aria-label={closeAriaLabel}
        onClick={() => onClose?.()}
        className="absolute inset-0 cursor-pointer border-0 bg-[var(--scrim-strong)] p-0 backdrop-blur-[2px]"
      />

      {/* R4 full-height sheet under 700px: full-bleed vertically and
          horizontally with internal thumb scrolling, RULED 23 Aug
          2026 (build-0823 pass 5). At 700px and up, the ruled
          centered floating panel, unchanged in size. Panel surface:
          --grad-panel-lift (B3), replacing the prior color-mix plus
          fill-whisper gradient background. */}
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-[var(--line)] bg-[image:var(--grad-panel-lift)] shadow-[var(--shadow-modal)] min-[700px]:h-[min(44rem,calc(100dvh-var(--space-8)*2))] min-[700px]:w-[min(46rem,calc(100vw-var(--space-8)*2))] min-[700px]:rounded-[var(--radius-lg)]">
        {confirmDiscardOpen ? (
          <div className="flex h-full flex-col items-center justify-center gap-[var(--space-4)] px-[var(--space-8)] text-center">
            <h2 className="font-display text-2xl text-[var(--ink)]">
              Discard unsaved changes?
            </h2>
            <p className="max-w-sm text-sm leading-6 text-[var(--ink-dim)]">
              Anything changed since the last save is lost. Closing now
              discards it.
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
                Discard unsaved changes
              </button>
            </div>
          </div>
        ) : (
          <>
        <div className="relative grid flex-none grid-cols-[var(--control-md)_1fr_var(--control-md)] items-center gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-3)] after:absolute after:bottom-0 after:left-[var(--space-8)] after:right-[var(--space-8)] after:h-px after:bg-[image:var(--line-fade)]">
          <span aria-hidden="true" />

          <div
            className={`flex min-w-0 items-center justify-center gap-0 transition-opacity ${
              secondaryPanel ? "pointer-events-none opacity-40" : ""
            }`}
          >
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
                    disabled={!stop.reachable || Boolean(secondaryPanel)}
                    aria-label={stop.label}
                    aria-current={stop.active ? "step" : undefined}
                    className={`grid h-7 w-7 flex-none place-items-center rounded-[var(--radius-full)] border p-0 transition sm:h-8 sm:w-8 ${
                      state === "done"
                        ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
                        : state === "on"
                          ? "border-[var(--gold-action)] bg-[var(--gold-ornament)]/15 text-[var(--gold-bright)]"
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
            onClick={() => (secondaryPanel ? secondaryPanel.onCancel?.() : onClose?.())}
            aria-label={secondaryPanel ? "Cancel" : closeAriaLabel}
            className="flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center justify-self-end rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[var(--space-6)] pb-[var(--space-6)] pt-[var(--space-5)]"
        >
          {secondaryPanel ? (
            <SecondaryPanel
              eyebrow={secondaryPanel.eyebrow}
              title={secondaryPanel.title}
              description={secondaryPanel.description}
            >
              {secondaryPanel.body}
            </SecondaryPanel>
          ) : (
            stopContent
          )}
        </div>

        <div className="relative flex flex-none flex-col gap-[var(--space-2)] px-[var(--space-5)] py-[var(--space-3)] before:absolute before:left-[var(--space-8)] before:right-[var(--space-8)] before:top-0 before:h-px before:bg-[image:var(--line-fade)]">
          <div className="flex items-center gap-[var(--space-3)]">
          {secondaryPanel ? (
            <>
              <button
                type="button"
                onClick={() => secondaryPanel.onCancel?.()}
                className="cf-btn cf-btn--secondary"
              >
                Cancel
              </button>

              <div className="flex-1" />

              {secondaryPanel.onApply ? (
                <button
                  type="button"
                  onClick={() => secondaryPanel.onApply?.()}
                  disabled={secondaryPanel.applyDisabled}
                  className="cf-btn cf-btn--primary"
                >
                  {secondaryPanel.applyLabel || "Apply"}
                </button>
              ) : null}
            </>
          ) : justSaved && isLastStop ? (
            <>
              {/* The save-and-reaccess loop, RULED 11 Aug 2026,
                  two-tier since (supersedes the any-stop reading): the
                  two-action footer appears only on a confirmed save
                  from the final stop. Exactly two actions replace the
                  whole normal footer; the Saved confirmation sits
                  where the save status used to, always with the word
                  per the status-color law, no layout jump. Actions
                  RELABELED 23 Aug 2026 (build-0823 pass 5, RULED):
                  "Open in advanced editor" replaces "Keep editing" as
                  the lawful exit label (same onContinueInEditor
                  handler, already routes to /studio/v2/editor/{id});
                  "Done" unchanged. */}
              <span aria-live="polite" className="inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--status-success)]">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--status-success)]" />
                <span className="inline">Saved</span>
              </span>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => onContinueInEditor?.()}
                className="cf-btn cf-btn--secondary"
              >
                Open in advanced editor
              </button>

              <button
                type="button"
                onClick={() => onDone?.()}
                className="cf-btn cf-btn--primary"
              >
                Done
              </button>
            </>
          ) : (
            <>
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
                {saveError ? (
                  <span role="alert" className="inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--status-danger)]" />
                    <span className="inline">Save unsuccessful</span>
                  </span>
                ) : hasUnsavedChanges ? (
                  // Status word always visible, RULED 23 Aug 2026
                  // (build-0823 pass 5): the sm:inline gate is
                  // removed so this word renders at every width, the
                  // same as "Saved" and "Save unsuccessful" above.
                  <span className="inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--gold-ornament)]">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--gold-ornament)]" />
                    <span className="inline">Unsaved changes</span>
                  </span>
                ) : justSaved ? (
                  // Two-tier save-and-reaccess loop, RULED 11 Aug 2026:
                  // a confirmed save from a non-final stop shows the
                  // Saved confirmation only, the rest of the footer
                  // (Back, Save, Next) unchanged. Unmissable at 390:
                  // the word stays visible at every width, not hidden
                  // behind sm:inline like "Unsaved changes" above.
                  <span className="inline-flex items-center gap-[var(--space-1)] whitespace-nowrap text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--status-success)]">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--status-success)]" />
                    <span className="inline">Saved</span>
                  </span>
                ) : null}
              </span>

              <div className="flex-1" />

              {/* The last-stop footer button "Save and open the
                  advanced editor" is REMOVED, RULED 23 Aug 2026
                  (build-0823 pass 5, the footer max-two-actions
                  ruling): it duplicated "Finish and save" (both ran
                  the same handleSave). Advanced-editor entry lives in
                  the saved state below (onContinueInEditor,
                  "Open in advanced editor"), the lawful exit. */}
              <button
                type="button"
                onClick={() =>
                  isLastStop ? onFinishAndSave?.() : onNext?.()
                }
                disabled={saveDisabled || (isLastStop && isSaving)}
                aria-busy={isLastStop ? isSaving : undefined}
                className="cf-btn cf-btn--primary"
              >
                {isLastStop
                  ? isSaving
                    ? "Saving..."
                    : "Finish and save"
                  : "Next"}{" "}
                <span className="cf-btn__arrow">&rarr;</span>
              </button>
            </>
          )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
