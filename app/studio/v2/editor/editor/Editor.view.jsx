"use client";

// Portable Skin (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape). Layout
// and presentation only: no Creation client, no Next.js, no
// components/studio/my-creations/** import. Every functional surface
// arrives pre-composed as a ReactNode slot from the Binding Shell
// (../Editor.jsx). Mobile-first at 390 (docs/STUDIO-SPEC.md 4.2,
// brief S3 item 2): single column, thumb-reachable (44px floor)
// horizontally-scrolling section navigation, no horizontal overflow,
// sticky action bar inside the R4 grammar (full-bleed, no clipping).
// Widens to the two-column rail at the xl breakpoint; the same
// wrapping applies uniformly to every section including the
// rehosted Lore document surface (the ruling's ADDITIONAL item),
// which gets no lower-quality or desktop-only treatment.
import { UserRound } from "lucide-react";

export default function EditorView({
  creationId,
  creationType = "",
  title = "Untitled Creation",
  isTemplate = false,
  activeSection = "overview",
  activeSections = [],
  onSelectSection,
  canSetDefaultPc = false,
  settingDefaultPc = false,
  onSetDefaultPc,
  defaultPcStatus = null,
  defaultPcError = null,
  showMechanicsQuickNav = false,
  backLabel = "Back",
  onBack,
  mediaPanel = null,
  mechanicsQuickNav = null,
  sectionContent = null,
  seats = {},
  stickyActionBar = null,
  featuredImagePicker = null,
  loadError = null,
  harnessSlot = null,
}) {
  const activeTab = activeSections.find((section) => section.id === activeSection);
  const seatSlot =
    activeSection === "body"
      ? seats.bodyDetail
      : activeSection === "behavior"
        ? seats.behaviorDetail
        : activeSection === "advanced"
          ? seats.advancedPrompting
          : null;

  return (
    <section className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-32 pt-[var(--space-4)] sm:px-[var(--space-6)] lg:pb-28">
      {harnessSlot ? <div className="mb-[var(--space-4)]">{harnessSlot}</div> : null}

      {loadError ? (
        <div className="mb-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
          {loadError.message}
        </div>
      ) : null}

      {/* Editor header: identity, back action, Set Default PC */}
      <header className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
        <div className="flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {isTemplate ? "Editing Template" : "Editing"}
              {creationType ? ` · ${creationType.replaceAll("_", " ")}` : ""}
            </p>
            <h1 className="mt-[var(--space-2)] truncate font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
              {title}
            </h1>
            <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
              Creation ID: <span className="text-[var(--ink-dim)]">{creationId}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            {canSetDefaultPc ? (
              <button
                type="button"
                onClick={() => onSetDefaultPc?.()}
                disabled={settingDefaultPc}
                className="cf-btn cf-btn--secondary"
              >
                <UserRound size={14} />
                {settingDefaultPc ? "Setting..." : "Set default PC"}
              </button>
            ) : null}

            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="cf-btn cf-btn--secondary"
              >
                ← {backLabel}
              </button>
            ) : null}
          </div>
        </div>

        {defaultPcStatus ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] text-[var(--status-success)]">
            {defaultPcStatus}
          </p>
        ) : null}
        {defaultPcError ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] text-[var(--status-danger)]">
            {defaultPcError}
          </p>
        ) : null}

        {/* Section navigation: horizontally scrolling pill row, 44px
            thumb floor, no wrap-induced overflow at 390. */}
        <nav
          aria-label="Editor sections"
          className="mt-[var(--space-4)] -mx-[var(--space-4)] flex gap-[var(--space-2)] overflow-x-auto px-[var(--space-4)] pb-[var(--space-1)] [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {activeSections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelectSection?.(section.id)}
                aria-pressed={active}
                className={`kit-focus inline-flex min-h-[var(--control-md)] shrink-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                  active
                    ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
                    : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {Icon ? <Icon size={14} /> : null}
                {section.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Body: single column at <lg, media rail + content at lg+. */}
      <div className="mt-[var(--space-5)] grid gap-[var(--space-5)] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-[var(--space-4)] lg:self-start">
          {mediaPanel}
          {showMechanicsQuickNav ? mechanicsQuickNav : null}
        </div>

        <div className="min-w-0 space-y-[var(--space-4)]">
          <div className="min-w-0 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
            {activeTab ? (
              <p className="mb-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {activeTab.label}
              </p>
            ) : null}
            {sectionContent}
          </div>

          {seatSlot}
        </div>
      </div>

      {stickyActionBar}
      {featuredImagePicker}
    </section>
  );
}
