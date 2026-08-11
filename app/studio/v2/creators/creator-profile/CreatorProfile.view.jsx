// Portable View: presentation only, no data access, no routing
// decisions, no business rules (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md
// LOOM shape). Composition, top to bottom, exhaustive: back button ->
// page header (StudioPageHeaderView, left-aligned eyebrow and short
// gold rule) -> identity block (avatar, handle, bio, tabular stat
// tiles, engagement action row) -> Creations grid (KitCreationCard,
// no onPlay/onGenerate, expand fallback only) with load-more ->
// Activity section -> Badges section -> bottom banner routing to
// Lore. A profile-level load-error banner replaces the whole content
// area below the header when errorMessage is set.
import { Bookmark, Coins, Heart, Share2, Users, VolumeX } from "lucide-react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import KitCreationCardView from "@/components/kit/creation-card/KitCreationCard.view";
import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import KitAlertStripView from "@/components/kit/alert-strip/KitAlertStrip.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitFormFieldView from "@/components/kit/form-field/KitFormField.view";
import ProfileBackButton from "@/components/studio/profile/ProfileBackButton";
import FixtureActionNotice from "@/app/studio/v2/FixtureActionNotice";

// Same left-aligned eyebrow-with-trailing-rule recipe as every other
// v2 page's section labels (Lore.view.jsx SectionLabel, LORE HEADER
// RULING).
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
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{message}</p>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] px-[var(--space-3)] py-[var(--space-3)]">
      <span className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] tabular-nums text-[var(--ink)]">
        {value ?? "0"}
      </span>
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>
    </div>
  );
}

// Soft-cornered rectangle action, same recipe as KitCreatorCardView's
// RectButton so the identity block's engagement row reads as one
// button family with the hub's creator card.
function RectAction({ label, icon: Icon, tone = "ghost", isPressed = false, onClick = null }) {
  const toneClasses =
    tone === "primary"
      ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
      : "border-[var(--line-strong)] bg-transparent text-[var(--gold-action)] hover:border-[var(--gold-action)]";

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      aria-pressed={isPressed}
      className={`kit-focus inline-flex min-h-[var(--control-sm)] items-center justify-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] transition-colors hover:shadow-[var(--glow-hover)] active:bg-[var(--state-pressed-fill)] ${toneClasses}`}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {label}
    </button>
  );
}

// Quiet secondary action, never a filled button: icon plus word, no
// border, no fill. Used for Mute (item 36, CR-028) in both placement
// variants.
function QuietAction({ label, icon: Icon, isPressed = false, onClick = null }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      aria-pressed={isPressed}
      className="kit-focus inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] whitespace-nowrap text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {label}
    </button>
  );
}

function CreationsGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[700px]:gap-[var(--space-4)] min-[1100px]:grid-cols-4">
      {items.map((item) => (
        <KitCreationCardView key={item.id} {...item} />
      ))}
    </div>
  );
}

function ActivityList({ items }) {
  return (
    <ul className="flex flex-col gap-[var(--space-2)]">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)]"
        >
          <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">{item.label}</span>
          <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">{item.timestamp}</span>
        </li>
      ))}
    </ul>
  );
}

function BadgeGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]"
        >
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] text-[var(--ink)]">
            {item.label}
          </p>
          <p className="text-[length:var(--text-label)] text-[var(--ink-dim)]">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function DonateModal({
  recipientDisplayName = "",
  amount = "",
  onAmountChange = null,
  amountError = "",
  message = "",
  onMessageChange = null,
  isAnonymous = false,
  onAnonymousChange = null,
  onSubmit = null,
  onClose = null,
}) {
  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-md" onClose={onClose} ariaLabel="Donate">
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          Donate to {recipientDisplayName}
        </h2>

        <KitFormFieldView
          label="Amount"
          type="number"
          value={amount}
          placeholder="0"
          error={amountError}
          isDisabled={false}
          onChange={onAmountChange}
        />

        <div className="flex flex-col gap-[var(--space-1)]">
          <label
            htmlFor="creator-donate-message"
            className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]"
          >
            Message
          </label>
          <textarea
            id="creator-donate-message"
            value={message}
            onChange={(event) => onMessageChange?.(event.target.value)}
            placeholder="Say something kind (optional)"
            rows={3}
            className="kit-focus cf-field min-h-[6rem] resize-y rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
          />
        </div>

        <label className="kit-focus flex items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => onAnonymousChange?.(event.target.checked)}
            className="h-[var(--space-4)] w-[var(--space-4)] rounded-[var(--radius-xs)] border border-[var(--line-strong)] accent-[var(--gold-action)]"
          />
          Donate anonymously
        </label>

        <div className="flex items-center justify-end gap-[var(--space-2)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <button type="button" onClick={() => onClose?.()} className="kit-focus cf-btn cf-btn--secondary">
            Cancel
          </button>
          <button type="button" onClick={() => onSubmit?.()} className="kit-focus cf-btn cf-btn--primary">
            Send donation
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

export default function CreatorProfileView({
  displayName = "",
  handle = "",
  bio = "",
  avatarSrc = null,
  stats = {},
  engagement = {},
  mutePlacement = "engagement",
  workItems = [],
  worksEmptyMessage = null,
  worksLoadMore,
  activityItems = [],
  activityEmptyMessage = null,
  badgeItems = [],
  badgesEmptyMessage = null,
  errorMessage = null,
  isLoading = false,
  isDonateModalOpen = false,
  donateModal = null,
  bottomBanner,
  notice = null,
  onCloseNotice = null,
  harnessSlot = null,
}) {
  const muteAction = (
    <QuietAction
      label={engagement?.isMuted ? "Muted" : "Mute"}
      icon={VolumeX}
      isPressed={engagement?.isMuted}
      onClick={engagement?.onToggleMute}
    />
  );

  return (
    <>
      <KitStudioPageView
        harnessSlot={harnessSlot}
        headerSlot={
          <div className="flex flex-col gap-[var(--space-4)]">
            <ProfileBackButton fallbackHref="/studio/v2/creators" />
            <StudioPageHeaderView
              eyebrow="Creator Profile"
              title={displayName || "Unknown creator"}
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
          <div className="flex flex-col gap-[var(--space-4)]">
            <div className="h-[var(--space-14)] w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-2)]" />
            <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="aspect-[4/3] animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-2)]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)] min-[700px]:p-[var(--space-6)]">
              <div className="flex flex-col gap-[var(--space-4)] min-[700px]:flex-row min-[700px]:items-start min-[700px]:justify-between">
                <div className="flex items-start gap-[var(--space-4)]">
                  <span className="flex h-[var(--space-14)] w-[var(--space-14)] flex-none items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line-strong)] bg-[var(--surface-3)]">
                    {avatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarSrc} alt="" width={56} height={56} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-[length:var(--text-heading)] text-[var(--ink-dim)]">
                        {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </span>
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <p className="max-w-[36rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {bio || "No public bio yet."}
                    </p>
                    {mutePlacement === "standalone" && muteAction}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-[var(--space-2)]">
                  <StatTile label="Followers" value={stats?.followers} />
                  <StatTile label="Following" value={stats?.following} />
                  <StatTile label="Plays" value={stats?.plays} />
                  <StatTile label="Works" value={stats?.works} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-[var(--space-3)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
                <RectAction
                  label={engagement?.isFollowing ? "Following" : "Follow"}
                  icon={Users}
                  tone={engagement?.isFollowing ? "primary" : "ghost"}
                  isPressed={engagement?.isFollowing}
                  onClick={engagement?.onFollow}
                />
                <RectAction
                  label="Donate"
                  icon={Coins}
                  tone="ghost"
                  onClick={engagement?.onOpenDonate}
                />
                <QuietAction
                  label={engagement?.isLiked ? "Liked" : "Like"}
                  icon={Heart}
                  isPressed={engagement?.isLiked}
                  onClick={engagement?.onLike}
                />
                <QuietAction
                  label={engagement?.isBookmarked ? "Saved" : "Save"}
                  icon={Bookmark}
                  isPressed={engagement?.isBookmarked}
                  onClick={engagement?.onBookmark}
                />
                <QuietAction label="Share" icon={Share2} onClick={engagement?.onShare} />
                {mutePlacement === "engagement" && muteAction}
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <SectionLabel>Creations</SectionLabel>
              {worksEmptyMessage ? (
                <EmptySection message={worksEmptyMessage} />
              ) : (
                <>
                  <CreationsGrid items={workItems} />
                  <KitLoadMoreView
                    isLoading={worksLoadMore?.isLoading}
                    hasMore={worksLoadMore?.hasMore}
                    remainingCount={worksLoadMore?.remainingCount ?? null}
                    onLoadMore={() => worksLoadMore?.onLoadMore?.()}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <SectionLabel>Activity</SectionLabel>
              {activityEmptyMessage ? <EmptySection message={activityEmptyMessage} /> : <ActivityList items={activityItems} />}
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <SectionLabel>Badges</SectionLabel>
              {badgesEmptyMessage ? <EmptySection message={badgesEmptyMessage} /> : <BadgeGrid items={badgeItems} />}
            </div>
          </>
        )}
      </KitStudioPageView>

      {isDonateModalOpen && (
        <DonateModal
          recipientDisplayName={donateModal?.recipientDisplayName}
          amount={donateModal?.amount}
          onAmountChange={donateModal?.onAmountChange}
          amountError={donateModal?.amountError}
          message={donateModal?.message}
          onMessageChange={donateModal?.onMessageChange}
          isAnonymous={donateModal?.isAnonymous}
          onAnonymousChange={donateModal?.onAnonymousChange}
          onSubmit={donateModal?.onSubmit}
          onClose={donateModal?.onClose}
        />
      )}

      <FixtureActionNotice notice={notice} onClose={onCloseNotice} />
    </>
  );
}
