"use client";

// Portable Skin (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape),
// rebuilt by ED1C (docs/plans/ED1B-EDITOR-PAGE-SPEC.md): artwork
// hero, one-section-at-a-time accordion of section boxes, sticky
// right ToC rail (switcher + always-visible save state + per-section
// marks) on desktop, sticky bottom control bar + bottom sheet (the
// O11 seat) on mobile. Layout and presentation only: no Creation
// client, no Next.js, no components/studio/my-creations/** import;
// every section body arrives pre-composed in `sectionNodes`.
import { Check, ChevronDown, ChevronsUpDown, List, Loader2, Save } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { useState } from "react";

// Anchors sit under the sticky top bar; the scroll margin keeps a
// jumped-to box header visible below it.
const ANCHOR_SCROLL_CLASS = "scroll-mt-[calc(var(--topbar-h)+var(--space-4))]";

function scrollToSection(sectionId) {
  if (typeof document === "undefined") return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document
        .getElementById(`editor-section-box-${sectionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Per-section state mark: a subtle gold dot for unsaved edits, a
// success check once those edits are saved. The words ride along for
// assistive tech per the status-color law.
function StateMark({ mark }) {
  if (mark === "dirty") {
    return (
      <span className="flex flex-none items-center" aria-hidden="false">
        <span className="h-[6px] w-[6px] rounded-[var(--radius-full)] bg-[var(--gold-action)]" />
        <span className="sr-only">unsaved changes</span>
      </span>
    );
  }
  if (mark === "saved") {
    return (
      <span className="flex flex-none items-center text-[var(--status-success)]">
        <Check size={14} aria-hidden="true" />
        <span className="sr-only">saved</span>
      </span>
    );
  }
  return null;
}

function SwitcherBlock({ isDirty, onOpenSwitcher }) {
  const [confirming, setConfirming] = useState(false);

  function activate() {
    if (isDirty) {
      setConfirming(true);
      return;
    }
    onOpenSwitcher?.();
  }

  return (
    <div>
      {/* D15: the switcher was the page's only strong-border control;
          it is a standard secondary button like every other control
          on the page. */}
      <button
        type="button"
        onClick={activate}
        className="cf-btn cf-btn--secondary w-full"
      >
        Switch creation
        <ChevronsUpDown size={14} aria-hidden="true" />
      </button>

      {confirming ? (
        <div className="mt-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-3)]">
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
            You have unsaved changes. Switch creations anyway?
          </p>
          <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="cf-btn cf-btn--secondary cf-btn--sm"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onOpenSwitcher?.();
              }}
              className="cf-btn cf-btn--primary cf-btn--sm"
            >
              Discard and switch
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function saveStateWord({ isDirty, saveStatus, saveErrorCopy }) {
  if (saveStatus === "saving") return "Saving";
  if (saveStatus === "error") {
    return saveErrorCopy || "Your changes could not be saved. Please try again.";
  }
  if (isDirty) return "Unsaved changes";
  return "All changes saved";
}

// The always-visible save block (rail and sheet). Clean state is a
// quiet check + words; dirty shows Save and Discard; saving and
// error carry their own words.
function SaveBlock({ isDirty, saveStatus, saveErrorCopy, onSave, onDiscard }) {
  const isSaving = saveStatus === "saving";
  const isError = saveStatus === "error";
  const word = saveStateWord({ isDirty, saveStatus, saveErrorCopy });

  return (
    <div>
      <p
        role={isError ? "alert" : undefined}
        aria-live="polite"
        className={`flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
          isError
            ? "text-[var(--status-danger-text)]"
            : isDirty || isSaving
              ? "text-[var(--ink)]"
              : "text-[var(--ink-dim)]"
        }`}
      >
        {isSaving ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : !isDirty && !isError ? (
          <Check size={14} className="text-[var(--status-success)]" aria-hidden="true" />
        ) : null}
        {word}
      </p>

      {isDirty || isError ? (
        <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave?.()}
            className="cf-btn cf-btn--primary"
          >
            <Save size={14} aria-hidden="true" />
            {isSaving ? "Saving" : "Save"}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onDiscard?.()}
            className="cf-btn cf-btn--secondary"
          >
            Discard
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TocList({ groups, openSectionId, sectionMarks, onSelect }) {
  return (
    <nav aria-label="Editor sections" className="flex flex-col gap-[var(--space-3)]">
      {(groups || []).map((group) => (
        <div key={group.id}>
          {/* Tier 4 group label (section 3): gold-ornament with the
              trailing grad-rule mark, distinct from tier 6 item rows. */}
          <p className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:flex-1 after:bg-[image:var(--grad-rule)]">
            {group.label}
          </p>
          <div className="mt-[var(--space-1)] flex flex-col">
            {(group.sections || []).map((section) => {
              const active = openSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect?.(section.id)}
                  className={`flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-1)] pl-[var(--space-5)] pr-[var(--space-3)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
                    active
                      ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                      : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className="min-w-0 truncate">{section.label}</span>
                  <StateMark mark={sectionMarks?.[section.id]} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SectionBox({ section, mark, isOpen, onToggle, children }) {
  return (
    <div
      id={`editor-section-box-${section.id}`}
      className={`rounded-[var(--radius-lg)] border bg-[var(--surface-2)] transition-colors ${ANCHOR_SCROLL_CLASS} ${
        isOpen ? "border-[var(--line)]" : "border-[var(--line-whisper)]"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex min-h-[var(--control-lg)] w-full items-center justify-between gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-2)] text-left"
      >
        <span className="flex min-w-0 items-center gap-[var(--space-3)]">
          <span className="truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {section.label}
          </span>
          <StateMark mark={mark} />
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`flex-none text-[var(--ink-dim)] transition-transform motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <div className="px-[var(--space-5)] pb-[var(--space-6)] pt-[var(--space-4)]">{children}</div>
      ) : null}
    </div>
  );
}

function LoadErrorState({ onRetry, onOpenPicker }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-3)] py-[var(--space-16)] text-center">
      <h1 className="font-display text-[length:var(--text-subhead-m)] leading-[var(--lh-subhead-m)] text-[var(--ink)] sm:text-[length:var(--text-subhead)] sm:leading-[var(--lh-subhead)]">
        This creation could not be loaded.
      </h1>
      <p className="max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        It may have been removed, or you may not have access to it.
      </p>
      <div className="mt-[var(--space-2)] flex flex-wrap justify-center gap-[var(--space-2)]">
        {onRetry ? (
          <button type="button" onClick={() => onRetry?.()} className="cf-btn cf-btn--secondary">
            Try again
          </button>
        ) : null}
        {onOpenPicker ? (
          <button type="button" onClick={() => onOpenPicker?.()} className="cf-btn cf-btn--primary">
            Pick another creation
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function EditorView({
  groups = [],
  openSectionId = null,
  onOpenSection,
  sectionMarks = {},
  isDirty = false,
  saveStatus = "idle",
  saveErrorCopy = "",
  onSave = null,
  onDiscard = null,
  onOpenSwitcher = null,
  sectionNodes = {},
  sectionLeads = {},
  sectionBadges = {},
  sectionSeats = {},
  backLabel = "Back",
  onBack,
  hero = null,
  featuredImagePicker = null,
  creationPicker = null,
  loadError = null,
  onRetryLoad,
  onOpenPickerFromError,
  isLoading = false,
  mobileNavOpen = false,
  onToggleMobileNav,
  harnessSlot = null,
}) {
  function handleSelect(sectionId) {
    onOpenSection?.(sectionId);
    scrollToSection(sectionId);
  }

  function handleSheetSelect(sectionId) {
    onToggleMobileNav?.();
    onOpenSection?.(sectionId);
    scrollToSection(sectionId);
  }

  const statusWord = saveStateWord({ isDirty, saveStatus, saveErrorCopy });

  return (
    <section className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-[var(--space-16)] pt-[var(--space-4)] sm:px-[var(--space-6)]">
      {harnessSlot ? <div className="mb-[var(--space-4)]">{harnessSlot}</div> : null}

      {isLoading ? (
        <div className="animate-pulse space-y-[var(--space-4)]">
          <div className="h-[16rem] rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="h-[var(--space-16)] rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="h-[var(--space-16)] rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="h-[var(--space-16)] rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
        </div>
      ) : loadError ? (
        <LoadErrorState onRetry={onRetryLoad} onOpenPicker={onOpenPickerFromError} />
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_264px] lg:gap-[var(--space-8)]">
          <div className="min-w-0 pb-[var(--space-14)] lg:pb-0">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
              >
                ← {backLabel}
              </button>
            ) : null}

            <div className="mt-[var(--space-3)]">{hero}</div>

            <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
              {groups.map((group) => (
                <div key={group.id}>
                  {/* Tier 4 group label (section 3), same recipe as
                      the rail's own group labels. */}
                  <p className="mb-[var(--space-2)] flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:flex-1 after:bg-[image:var(--grad-rule)]">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-[var(--space-3)]">
                    {(group.sections || []).map((section) => {
                      const isOpen = openSectionId === section.id;
                      return (
                        <SectionBox
                          key={section.id}
                          section={section}
                          mark={sectionMarks?.[section.id]}
                          isOpen={isOpen}
                          onToggle={() => onOpenSection?.(isOpen ? null : section.id)}
                        >
                          {sectionBadges?.[section.id]}
                          {sectionLeads?.[section.id]}
                          <div className="min-w-0">{sectionNodes?.[section.id]}</div>
                          {sectionSeats?.[section.id]}
                        </SectionBox>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            {/* Section 7: the rail never scrolls inside itself (D12).
                No max-h, no overflow-y-auto; the page scroll reaches
                any tail content past the working viewport. Order top
                to bottom: save block, switcher, ToC. */}
            <div className="sticky top-[calc(var(--topbar-h)+var(--space-4))] flex flex-col gap-[var(--space-4)]">
              <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
                <SaveBlock
                  isDirty={isDirty}
                  saveStatus={saveStatus}
                  saveErrorCopy={saveErrorCopy}
                  onSave={onSave}
                  onDiscard={onDiscard}
                />
              </div>
              <SwitcherBlock isDirty={isDirty} onOpenSwitcher={onOpenSwitcher} />
              <TocList
                groups={groups}
                openSectionId={openSectionId}
                sectionMarks={sectionMarks}
                onSelect={handleSelect}
              />
            </div>
          </aside>
        </div>
      )}

      {!isLoading && !loadError ? (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-[var(--space-3)] border-t border-[var(--line)] bg-[var(--chrome-wash)] backdrop-blur-[var(--blur-chrome)] px-[var(--space-4)] py-[var(--space-2)] lg:hidden">
          <button
            type="button"
            onClick={() => onToggleMobileNav?.()}
            className="flex min-h-[var(--control-md)] flex-none items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]"
          >
            <List size={14} aria-hidden="true" />
            Sections
          </button>
          <p
            aria-live="polite"
            className={`min-w-0 flex-1 truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
              saveStatus === "error"
                ? "text-[var(--status-danger-text)]"
                : isDirty
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-dim)]"
            }`}
          >
            {statusWord}
          </p>
          {isDirty || saveStatus === "error" ? (
            <button
              type="button"
              disabled={saveStatus === "saving"}
              onClick={() => onSave?.()}
              className="cf-btn cf-btn--primary flex-none"
            >
              <Save size={14} aria-hidden="true" />
              Save
            </button>
          ) : null}
        </div>
      ) : null}

      {mobileNavOpen ? (
        <KitModalFrame variant="sheet" onClose={() => onToggleMobileNav?.()} ariaLabel="Editor sections">
          {/* 7.3: a visible structural title, never a titleless band
              behind only an sr-only ariaLabel. No inner max-h/scroll
              (section 7): KitModalFrame's own sheet panel already
              owns the one scroll container (92dvh cap). */}
          <div className="p-[var(--space-4)]">
            <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Sections
            </p>
            <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
              <SaveBlock
                isDirty={isDirty}
                saveStatus={saveStatus}
                saveErrorCopy={saveErrorCopy}
                onSave={onSave}
                onDiscard={onDiscard}
              />
            </div>
            <div className="mt-[var(--space-3)]">
              <SwitcherBlock isDirty={isDirty} onOpenSwitcher={onOpenSwitcher} />
            </div>
            <div className="mt-[var(--space-4)]">
              <TocList
                groups={groups}
                openSectionId={openSectionId}
                sectionMarks={sectionMarks}
                onSelect={handleSheetSelect}
              />
            </div>
          </div>
        </KitModalFrame>
      ) : null}

      {featuredImagePicker}
      {creationPicker}
    </section>
  );
}
