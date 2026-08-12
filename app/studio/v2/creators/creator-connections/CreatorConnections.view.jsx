// Portable View: presentation only, no data access, no routing
// decisions, no business rules (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md
// LOOM shape). Composition, top to bottom, exhaustive: back button ->
// page header (StudioPageHeaderView, left-aligned eyebrow and short
// gold rule) -> tab switcher (Followers / Following) -> capped
// connection list with load-more -> bottom banner routing to Lore. A
// page-level load-error banner replaces the list when errorMessage is
// set.
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import ProfileBackButton from "@/components/studio/profile/ProfileBackButton";

// Same left-aligned eyebrow-with-trailing-rule recipe as every other
// v2 page's section labels (Lore.view.jsx SectionLabel, LORE HEADER
// RULING; also CreatorProfile.view.jsx SectionLabel).
function EmptySection({ message }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-2)] py-[var(--space-10)] text-center">
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{message}</p>
    </div>
  );
}

// Tab switcher, legacy connections-page precedent (rows 814-817 name
// it "tabs" directly): a compact two-way switch rather than two
// stacked sections, matching the content volume of a single follower/
// following list rendered at a time.
function TabSwitcher({ activeTab, followersCount, followingCount, onChangeTab }) {
  return (
    <div
      role="tablist"
      aria-label="Followers and following"
      className="inline-flex w-fit rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-1)]"
    >
      <TabButton
        id="followers"
        label="Followers"
        count={followersCount}
        isActive={activeTab === "followers"}
        onClick={() => onChangeTab?.("followers")}
      />
      <TabButton
        id="following"
        label="Following"
        count={followingCount}
        isActive={activeTab === "following"}
        onClick={() => onChangeTab?.("following")}
      />
    </div>
  );
}

function TabButton({ id, label, count, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      id={`creator-connections-tab-${id}`}
      aria-selected={isActive}
      onClick={onClick}
      className={`kit-focus min-h-[var(--control-sm)] rounded-[var(--radius-sm)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] tabular-nums transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
        isActive
          ? "bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
          : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
      }`}
    >
      {count ?? 0} {label}
    </button>
  );
}

// Soft-cornered rectangle action, same recipe as KitCreatorCardView's
// RectButton so the per-connection Follow control reads as one button
// family with the hub's creator card and the profile page's own
// engagement row.
function FollowButton({ isFollowing, onClick }) {
  const toneClasses = isFollowing
    ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
    : "border-[var(--line-strong)] bg-transparent text-[var(--gold-action)] hover:border-[var(--gold-action)]";

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      aria-pressed={isFollowing}
      className={`kit-focus inline-flex min-h-[var(--control-sm)] flex-none items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] transition-colors hover:shadow-[var(--glow-hover)] active:bg-[var(--state-pressed-fill)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${toneClasses}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

function ConnectionRow({ item }) {
  return (
    <li className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <span className="flex h-[var(--space-10)] w-[var(--space-10)] flex-none items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--surface-3)]">
        {item.avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.avatarSrc} alt="" width={40} height={40} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            {item.displayName ? item.displayName.charAt(0).toUpperCase() : "?"}
          </span>
        )}
      </span>

      <button
        type="button"
        onClick={() => item.onOpenProfile?.()}
        className="kit-focus min-w-0 flex-1 text-left"
      >
        <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] text-[var(--ink)]">
          {item.displayName || "Unknown creator"}
        </p>
        <p className="truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          @{item.handle}
        </p>
      </button>

      <FollowButton isFollowing={item.isFollowing} onClick={item.onToggleFollow} />
    </li>
  );
}

// Two-up list treatment, RULED (11 Aug list-density law, extended 12
// Aug): full-width single-column rows with large blank middles are
// banned where the two-up law applies. Same grid Community's own list
// layout uses (CommunityV2Mockup.jsx), single column below 1100px,
// two columns at 1100px and up.
function ConnectionList({ items }) {
  return (
    <ul className="grid grid-cols-1 gap-[var(--space-3)] min-[1100px]:grid-cols-2">
      {items.map((item) => (
        <ConnectionRow key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default function CreatorConnectionsView({
  displayName = "",
  handle = "",
  activeTab = "followers",
  onChangeTab = null,
  followersCount = null,
  followingCount = null,
  items = [],
  emptyMessage = null,
  loadMore,
  errorMessage = null,
  isLoading = false,
  bottomBanner,
  harnessSlot = null,
}) {
  return (
    <KitStudioPageView
      harnessSlot={harnessSlot}
      headerSlot={
        <div className="flex flex-col gap-[var(--space-4)]">
          <ProfileBackButton fallbackHref={handle ? `/studio/v2/creators/${handle}` : "/studio/v2/creators"} />
          <StudioPageHeaderView
            eyebrow="Creator Profile"
            title={displayName ? `${displayName}'s connections` : "Connections"}
            description={handle ? `@${handle}` : ""}
          />
        </div>
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
      {errorMessage ? (
        <KitAlertStripView tone="danger" title={errorMessage} body="Try refreshing the page." />
      ) : isLoading ? (
        <div className="flex flex-col gap-[var(--space-3)]">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-[var(--space-14)] w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-[var(--space-4)]">
          <TabSwitcher
            activeTab={activeTab}
            followersCount={followersCount}
            followingCount={followingCount}
            onChangeTab={onChangeTab}
          />

          {emptyMessage ? (
            <EmptySection message={emptyMessage} />
          ) : (
            <>
              <ConnectionList items={items} />
              <KitLoadMoreView
                isLoading={loadMore?.isLoading}
                hasMore={loadMore?.hasMore}
                remainingCount={loadMore?.remainingCount ?? null}
                onLoadMore={() => loadMore?.onLoadMore?.()}
              />
            </>
          )}
        </div>
      )}
    </KitStudioPageView>
  );
}
