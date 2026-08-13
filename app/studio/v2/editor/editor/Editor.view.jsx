"use client";

// Portable Skin (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape),
// rebuilt by ED1B (docs/plans/ED1B-EDITOR-PAGE-SPEC.md): ONE
// scrolling document per creation on the canvas, no stacked floating
// panels. Layout and presentation only: no Creation client, no
// Next.js, no components/studio/my-creations/** import. Every
// functional surface (header, save bar, every section body, media
// panel, pickers) arrives pre-composed as a ReactNode slot from the
// Binding Shell (../Editor.jsx). Mobile-first at 390: compact header
// art, single column, the O11 bottom-sheet group/section jump list,
// no horizontal overflow; the same column widens to max-w-3xl and
// stays a single document at 1440.
import { ChevronDown } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

// Anchors sit under two sticky layers (top bar + save bar); the
// scroll margin keeps a jumped-to group heading visible below them.
const ANCHOR_SCROLL_CLASS =
  "scroll-mt-[calc(var(--topbar-h)+var(--space-14))]";

function sectionCountWord(count) {
  return count === 1 ? "1 section" : `${count} sections`;
}

function scrollToAnchor(anchorId) {
  if (typeof document === "undefined") return;
  // Two frames: the first lets a just-expanded group commit to the
  // DOM before the section anchor inside it is looked up.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document
        .getElementById(anchorId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// No subhead row of its own: every rehosted section component
// renders its own heading, and a second label above it read as
// duplicate chrome on the ED1B render. The section label still
// appears in the O11 sheet.
function SectionBlock({
  section,
  node,
  lead = null,
  badge = null,
  seat = null,
}) {
  return (
    <div id={`editor-section-${section?.id}`} className={ANCHOR_SCROLL_CLASS}>
      {badge}
      {lead}
      <div className="min-w-0 overflow-x-auto">{node}</div>
      {seat}
    </div>
  );
}

function GroupBody({
  group,
  sectionNodes,
  sectionLeads,
  sectionBadges,
  seats,
  mediaPanel,
  imageLibraryLink,
}) {
  return (
    <div className="space-y-[var(--space-8)]">
      {group?.hostsMedia ? (
        // The media panel was designed for a narrow rail; bounded
        // here so the featured art never balloons to column width.
        <div className="max-w-sm space-y-[var(--space-4)]">
          {mediaPanel}
          {imageLibraryLink}
        </div>
      ) : null}
      {(group?.sections || []).map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          node={sectionNodes?.[section.id] || null}
          lead={sectionLeads?.[section.id] || null}
          badge={sectionBadges?.[section.id] || null}
          seat={seats?.[section.id] || null}
        />
      ))}
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

function SectionsSheet({ groups, onJump, onClose }) {
  return (
    <KitModalFrame variant="sheet" onClose={onClose} ariaLabel="Editor sections">
      <div className="max-h-[75vh] overflow-y-auto p-[var(--space-4)]">
        {(groups || []).map((group) => (
          <div key={group.id} className="mb-[var(--space-4)]">
            <button
              type="button"
              onClick={() => onJump?.(group.id, null)}
              className="kit-focus flex min-h-[var(--control-md)] w-full items-center rounded-[var(--radius-md)] px-[var(--space-3)] text-left font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)] transition hover:bg-[var(--state-hover-fill)]"
            >
              {group.label}
            </button>
            <div className="mt-[var(--space-1)] flex flex-col gap-[var(--space-1)]">
              {(group.sections || []).map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onJump?.(group.id, section.id)}
                  className="kit-focus flex min-h-[var(--control-md)] items-center rounded-[var(--radius-md)] px-[var(--space-3)] pl-[var(--space-6)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]"
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </KitModalFrame>
  );
}

export default function EditorView({
  groups = [],
  openGroupIds = [],
  onToggleGroup,
  onJumpToGroup,
  sectionNodes = {},
  sectionLeads = {},
  sectionBadges = {},
  sectionSeats = {},
  mediaPanel = null,
  imageLibraryHref = null,
  backLabel = "Back",
  onBack,
  header = null,
  saveBar = null,
  featuredImagePicker = null,
  creationPicker = null,
  loadError = null,
  onRetryLoad,
  onOpenPickerFromError,
  harnessSlot = null,
  isLoading = false,
  mobileNavOpen = false,
  onToggleMobileNav,
}) {
  const essentialsGroup = groups[0] || null;
  const advancedGroups = groups.slice(1);

  const imageLibraryLink = imageLibraryHref ? (
    <a
      href={imageLibraryHref}
      className="kit-focus flex min-h-[var(--control-md)] w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:border-[var(--gold-action)] hover:text-[var(--ink)]"
    >
      Manage image library
    </a>
  ) : null;

  function handleJump(groupId, sectionId) {
    onJumpToGroup?.(groupId);
    scrollToAnchor(sectionId ? `editor-section-${sectionId}` : `editor-group-${groupId}`);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-[var(--space-4)] pb-[var(--space-16)] pt-[var(--space-4)] sm:px-[var(--space-6)]">
      {harnessSlot ? <div className="mb-[var(--space-4)]">{harnessSlot}</div> : null}

      {isLoading ? (
        <div className="animate-pulse space-y-[var(--space-4)]">
          <div className="h-40 rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
          <div className="h-24 rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
          <div className="h-24 rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
          <div className="h-24 rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
        </div>
      ) : loadError ? (
        <LoadErrorState onRetry={onRetryLoad} onOpenPicker={onOpenPickerFromError} />
      ) : (
        <>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="kit-focus inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            >
              ← {backLabel}
            </button>
          ) : null}

          <div className="mt-[var(--space-3)]">{header}</div>
          <div
            className="mb-[var(--space-4)] mt-[var(--space-5)] border-b border-[var(--line)]"
            aria-hidden="true"
          />

          {/* Rendered directly in the tall column: sticky positioning
              travels the whole page, not a bar-height wrapper. */}
          {saveBar}

          {essentialsGroup ? (
            <div
              id={`editor-group-${essentialsGroup.id}`}
              className={`mt-[var(--space-5)] ${ANCHOR_SCROLL_CLASS}`}
            >
              <h2 className="font-display text-[length:var(--text-subhead-m)] leading-[var(--lh-subhead-m)] text-[var(--ink)] sm:text-[length:var(--text-subhead)] sm:leading-[var(--lh-subhead)]">
                {essentialsGroup.label}
              </h2>
              <div className="mt-[var(--space-4)]">
                <GroupBody
                  group={essentialsGroup}
                  sectionNodes={sectionNodes}
                  sectionLeads={sectionLeads}
                  sectionBadges={sectionBadges}
                  seats={sectionSeats}
                  mediaPanel={mediaPanel}
                  imageLibraryLink={imageLibraryLink}
                />
              </div>
            </div>
          ) : null}

          {advancedGroups.length ? (
            <div className="mt-[var(--space-6)]">
              {advancedGroups.map((group) => {
                const isOpen = openGroupIds.includes(group.id);
                return (
                  <div
                    key={group.id}
                    id={`editor-group-${group.id}`}
                    className={`border-t border-[var(--line)] ${ANCHOR_SCROLL_CLASS}`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => onToggleGroup?.(group.id)}
                      className="kit-focus flex min-h-[var(--control-lg)] w-full items-center justify-between gap-[var(--space-3)] py-[var(--space-2)] text-left"
                    >
                      <span className="flex min-w-0 flex-wrap items-baseline gap-x-[var(--space-3)] gap-y-0">
                        <span className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                          {group.label}
                        </span>
                        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                          {sectionCountWord(
                            (group.sections?.length || 0) + (group.hostsMedia ? 1 : 0)
                          )}
                        </span>
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
                      <div className="pb-[var(--space-8)] pt-[var(--space-4)]">
                        <GroupBody
                          group={group}
                          sectionNodes={sectionNodes}
                          sectionLeads={sectionLeads}
                          sectionBadges={sectionBadges}
                          seats={sectionSeats}
                          mediaPanel={mediaPanel}
                          imageLibraryLink={imageLibraryLink}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}

      {mobileNavOpen ? (
        <SectionsSheet
          groups={groups}
          onJump={(groupId, sectionId) => handleJump(groupId, sectionId)}
          onClose={() => onToggleMobileNav?.()}
        />
      ) : null}

      {featuredImagePicker}
      {creationPicker}
    </section>
  );
}
