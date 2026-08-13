"use client";

// Portable Skin (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape). Layout
// and presentation only: no Creation client, no Next.js, no
// components/studio/my-creations/** import. Every functional surface
// arrives pre-composed as a ReactNode slot from the Binding Shell
// (../Editor.jsx). Mobile-first at 390 (docs/STUDIO-SPEC.md 4.2):
// single column, thumb-reachable (44px floor) horizontally-scrolling
// group tabs plus in-group section flow, the O11 bottom-sheet section
// picker on phone, no horizontal overflow. Widens to the two-column
// rail at the xl breakpoint; the same wrapping applies uniformly to
// every section including the rehosted Lore document surface, which
// gets no lower-quality or desktop-only treatment.
import { UserRound, Menu } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import KitBadge from "@/components/kit/KitBadge";

const CONTENT_RATING_LABELS = {
  SFW: "Everyone",
  MATURE: "Teen",
  EXPLICIT: "Adult",
};

function OverviewSummaryCard({ description, contentRating }) {
  return (
    <div className="mb-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Overview
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {description || "No description yet."}
      </p>
      {contentRating ? (
        <div className="mt-[var(--space-3)]">
          <KitBadge
            label={CONTENT_RATING_LABELS[contentRating] || contentRating}
            variant="meta"
            surface="canvas"
          />
        </div>
      ) : null}
    </div>
  );
}

function GroupTabs({ groups, activeGroupId, onSelectGroup }) {
  if (!groups?.length) return null;

  return (
    <nav
      aria-label="Editor groups"
      className="flex gap-[var(--space-2)] overflow-x-auto pb-[var(--space-1)] [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible"
    >
      {groups.map((group) => {
        const active = activeGroupId === group.id;
        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onSelectGroup?.(group.id)}
            aria-pressed={active}
            className={`kit-focus inline-flex min-h-[var(--control-md)] shrink-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
              active
                ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {group.label}
          </button>
        );
      })}
    </nav>
  );
}

function InGroupSectionFlow({ sections, activeSection, onSelectSection }) {
  if (!sections?.length || sections.length < 2) return null;

  return (
    <nav
      aria-label="Editor sections in this group"
      className="mt-[var(--space-2)] -mx-[var(--space-4)] flex gap-[var(--space-2)] overflow-x-auto px-[var(--space-4)] pb-[var(--space-1)] [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {sections.map((section) => {
        const Icon = section.icon;
        const active = activeSection === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection?.(section.id)}
            aria-pressed={active}
            className={`kit-focus inline-flex min-h-[var(--control-sm)] shrink-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition ${
              active
                ? "border-[var(--line-strong)] text-[var(--ink)]"
                : "border-transparent text-[var(--ink-faint)] hover:text-[var(--ink-dim)]"
            }`}
          >
            {Icon ? <Icon size={13} /> : null}
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}

function MobileSectionsSheet({ groups, activeSection, onSelectSection, onClose }) {
  return (
    <KitModalFrame variant="sheet" onClose={onClose} ariaLabel="Editor sections">
      <div className="max-h-[75vh] overflow-y-auto p-[var(--space-4)]">
        {groups.map((group) => (
          <div key={group.id} className="mb-[var(--space-4)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              {group.label}
            </p>
            <div className="mt-[var(--space-2)] flex flex-col gap-[var(--space-1)]">
              {group.sections.map((section) => {
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onSelectSection?.(section.id)}
                    className={`kit-focus flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] px-[var(--space-3)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                      active
                        ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                        : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </KitModalFrame>
  );
}

export default function EditorView({
  creationId,
  title = "Untitled Creation",
  isTemplate = false,
  activeSection = "overview",
  activeSections = [],
  activeSectionGroups = [],
  activeGroupId = null,
  onSelectSection,
  onSelectGroup,
  canSetDefaultPc = false,
  settingDefaultPc = false,
  onSetDefaultPc,
  defaultPcStatus = null,
  defaultPcError = null,
  showMechanicsQuickNav = false,
  backLabel = "Back",
  onBack,
  header = null,
  saveBar = null,
  mediaPanel = null,
  mechanicsQuickNav = null,
  sectionContent = null,
  seats = {},
  featuredImagePicker = null,
  creationPicker = null,
  loadError = null,
  harnessSlot = null,
  isLoreDraftPreview = false,
  imageLibraryHref = null,
  isLoading = false,
  mobileNavOpen = false,
  onToggleMobileNav,
  overviewDescription = null,
  overviewContentRating = null,
}) {
  const seatSlot =
    activeSection === "body"
      ? seats.bodyDetail
      : activeSection === "behavior"
        ? seats.behaviorDetail
        : activeSection === "advanced"
          ? seats.advancedPrompting
          : null;

  const sectionsById = new Map(activeSections.map((section) => [section.id, section]));
  const groupsWithSections = activeSectionGroups.map((group) => ({
    ...group,
    sections: group.sectionIds.map((id) => sectionsById.get(id)).filter(Boolean),
  }));
  const activeGroup = groupsWithSections.find((group) => group.id === activeGroupId) || null;
  const inGroupSections = activeGroup?.sections || [];
  const isFirstGroup = activeSectionGroups[0]?.id === activeGroupId;
  const showOverviewSummary = isFirstGroup && activeSection === "overview";

  return (
    <section className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-32 pt-[var(--space-4)] sm:px-[var(--space-6)] lg:pb-28">
      {harnessSlot ? <div className="mb-[var(--space-4)]">{harnessSlot}</div> : null}

      {loadError ? (
        <div className="mb-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
          {loadError.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="animate-pulse space-y-[var(--space-4)]">
          <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="h-64 rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
        </div>
      ) : (
        <>
          {header}
          {saveBar}

          <div className="mt-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)]">
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
                {isTemplate ? "Editing Template" : "Editing"} · Creation ID:{" "}
                <span className="text-[var(--ink-dim)]">{creationId}</span>
              </p>

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

                <button
                  type="button"
                  onClick={() => onToggleMobileNav?.()}
                  className="kit-focus cf-btn cf-btn--secondary lg:hidden"
                >
                  <Menu size={14} />
                  Sections
                </button>

                {onBack ? (
                  <button type="button" onClick={onBack} className="cf-btn cf-btn--secondary">
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

            <div className="mt-[var(--space-4)]">
              <GroupTabs
                groups={activeSectionGroups}
                activeGroupId={activeGroupId}
                onSelectGroup={onSelectGroup}
              />
              <InGroupSectionFlow
                sections={inGroupSections}
                activeSection={activeSection}
                onSelectSection={onSelectSection}
              />
            </div>
          </div>

          {/* Body: single column at <lg, media rail + content at lg+. */}
          <div className="mt-[var(--space-5)] grid gap-[var(--space-5)] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-[var(--space-4)] lg:self-start">
              {mediaPanel}
              {imageLibraryHref ? (
                <a
                  href={imageLibraryHref}
                  className="kit-focus flex min-h-[var(--control-md)] w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)]"
                >
                  Manage image library
                </a>
              ) : null}
              {showMechanicsQuickNav ? mechanicsQuickNav : null}
            </div>

            <div className="min-w-0 space-y-[var(--space-4)]">
              <div className="min-w-0 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
                {showOverviewSummary ? (
                  <OverviewSummaryCard
                    description={overviewDescription}
                    contentRating={overviewContentRating}
                  />
                ) : null}
                {isLoreDraftPreview ? (
                  <p className="mb-[var(--space-4)] inline-flex items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
                    Owner-only draft preview
                  </p>
                ) : null}
                {sectionContent}
              </div>

              {seatSlot}
            </div>
          </div>
        </>
      )}

      {mobileNavOpen ? (
        <MobileSectionsSheet
          groups={groupsWithSections}
          activeSection={activeSection}
          onSelectSection={(sectionId) => onSelectSection?.(sectionId)}
          onClose={() => onToggleMobileNav?.()}
        />
      ) : null}

      {featuredImagePicker}
      {creationPicker}
    </section>
  );
}
