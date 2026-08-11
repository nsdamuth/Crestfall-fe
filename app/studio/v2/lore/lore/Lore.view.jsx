"use client";

// Lore (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.9; docs/SPRINT-G-
// PLAN.md section 4; docs/SPRINT-H-PLAN.md section 5.7). Portable
// View: presentation only, no data access, no routing decisions, no
// business rules. Composition, top to bottom, exhaustive: top banner
// (promo-banner top treatment) with the write-lore CTA, item 39
// RULED 10 Aug 2026 -> the sticky filter bar (search plus approval
// state, world or faction, and recency facets, no separate sort) ->
// left-aligned editorial labels, the standard design-system section-
// label treatment (LORE HEADER, RULING CHANGED, 10 Aug 2026 defect
// ruling: Lore no longer centers, matching the other eight pages) ->
// two creation-card grids, Community Lore then Your Lore -> load-more
// on the community grid -> bottom banner routing to Home, the loop's
// closing banner. The write-lore CTA opens the creation modal
// (modal-frame plus KitFormField fields and KitAlertStrip approval
// notice, item 39 RULED 10 Aug 2026), unrelated to page flow order.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitFormFieldView from "@/components/kit/form-field/KitFormField.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

// Standard section-label treatment (StudioPageHeaderView's eyebrow
// recipe, LORE HEADER RULING): gold uppercase, one short gold rule to
// its right via the after: pseudo-element, never a line on the left,
// no arrow or caret. Reused here for the two grid section labels
// (Community Lore, Your Lore), which are page-local labels, not the
// page eyebrow itself (that's StudioPageHeaderView, below).
function SectionLabel({ children }) {
  return (
    <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
      {children}
    </p>
  );
}

function EmptySection({ message }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] py-[var(--space-10)] text-center">
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {message}
      </p>
    </div>
  );
}

function CardGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4">
      {items.map((item) => (
        <KitCreationCardView key={item.id} {...item} />
      ))}
    </div>
  );
}

function LoreCreateModal({
  title = "",
  onTitleChange = null,
  titleError = "",
  world = "",
  onWorldChange = null,
  content = "",
  onContentChange = null,
  onSubmit = null,
  onClose = null,
}) {
  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-xl" onClose={onClose} ariaLabel="Write lore">
      <div className="flex max-h-[85vh] flex-col gap-[var(--space-4)] overflow-y-auto p-[var(--space-6)] pt-[var(--space-8)]">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          Write lore
        </h2>

        <KitAlertStripView
          tone="neutral"
          title="New lore is reviewed before it becomes canon."
          body="Submissions enter the community archive as pending, and the best of it becomes part of play."
        />

        <KitFormFieldView
          label="Title"
          value={title}
          placeholder="Name your lore"
          error={titleError}
          isDisabled={false}
          onChange={onTitleChange}
        />

        <KitFormFieldView
          label="World or faction"
          value={world}
          placeholder="e.g. Aethelgard, Eden, the Sundered Choir"
          helper="Optional. Leave blank if this lore spans the whole setting."
          isDisabled={false}
          onChange={onWorldChange}
        />

        <div className="flex flex-col gap-[var(--space-1)]">
          <label
            htmlFor="lore-create-content"
            className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]"
          >
            Lore
          </label>
          <textarea
            id="lore-create-content"
            value={content}
            onChange={(event) => onContentChange?.(event.target.value)}
            placeholder="Write into the world..."
            rows={8}
            className="kit-focus cf-field min-h-[10rem] resize-y rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
          />
        </div>

        <div className="flex items-center justify-end gap-[var(--space-2)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <button type="button" onClick={() => onClose?.()} className="kit-focus cf-btn cf-btn--secondary">
            Cancel
          </button>
          <button type="button" onClick={() => onSubmit?.()} className="kit-focus cf-btn cf-btn--primary">
            Submit for review
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

export default function LoreView({
  topBanner,
  filterBar,
  communityItems = [],
  communityEmptyMessage = null,
  communityLoadMore,
  mineItems = [],
  mineEmptyMessage = null,
  bottomBanner,
  isCreateModalOpen = false,
  createModal = null,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
        headerSlot={
          <StudioPageHeaderView
            eyebrow="The Archive"
            title="Lore"
            description="Read the world, write into it, and let the best of it become part of play."
          />
        }
        filterBarSlot={
          <KitStudioFilterBarView
            searchValue={filterBar?.searchValue ?? ""}
            searchPlaceholder={filterBar?.searchPlaceholder}
            onSearchChange={filterBar?.onSearchChange}
            filterGroups={filterBar?.filterGroups ?? []}
            selectedValues={filterBar?.selectedValues ?? {}}
            onFilterToggle={filterBar?.onFilterToggle}
            sortOptions={[]}
          />
        }
        bannerSlot={
          <KitPromoBannerView
            treatment="bottom"
            bottomVariant="uniform"
            eyebrow={bottomBanner?.eyebrow}
            title={bottomBanner?.title}
            line=""
            ctaLabel={bottomBanner?.ctaLabel}
            imageSrc={bottomBanner?.imageSrc ?? null}
            onCtaClick={() => bottomBanner?.onCtaClick?.()}
          />
        }
      >
        <KitPromoBannerView
          treatment="top"
          eyebrow={topBanner?.eyebrow}
          title={topBanner?.title}
          line=""
          ctaLabel={topBanner?.ctaLabel}
          imageSrc={topBanner?.imageSrc ?? null}
          onCtaClick={() => topBanner?.onCtaClick?.()}
        />

        <div className="flex flex-col gap-[var(--space-4)]">
          <SectionLabel>Community Lore</SectionLabel>
          {communityEmptyMessage ? (
            <EmptySection message={communityEmptyMessage} />
          ) : (
            <>
              <CardGrid items={communityItems} />
              <KitLoadMoreView
                isLoading={communityLoadMore?.isLoading}
                hasMore={communityLoadMore?.hasMore}
                remainingCount={communityLoadMore?.remainingCount ?? null}
                onLoadMore={() => communityLoadMore?.onLoadMore?.()}
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-[var(--space-4)]">
          <SectionLabel>Your Lore</SectionLabel>
          {mineEmptyMessage ? <EmptySection message={mineEmptyMessage} /> : <CardGrid items={mineItems} />}
        </div>
      </KitStudioPageView>

      {isCreateModalOpen && (
        <LoreCreateModal
          title={createModal?.title}
          onTitleChange={createModal?.onTitleChange}
          titleError={createModal?.titleError}
          world={createModal?.world}
          onWorldChange={createModal?.onWorldChange}
          content={createModal?.content}
          onContentChange={createModal?.onContentChange}
          onSubmit={createModal?.onSubmit}
          onClose={createModal?.onClose}
        />
      )}

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
