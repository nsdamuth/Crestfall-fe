"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import KitDropdown from "@/components/kit/KitDropdown";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";

const SETTINGS_ROWS = [
  {
    title: "Subscription",
    body: "Plan, billing, renewal, and future premium access controls.",
    href: "/studio/v2/account/subscription",
  },
  {
    title: "Preferences",
    body: "Language, creator workflow defaults, discovery preferences, and page-level display settings.",
    href: "/studio/v2/account/preferences",
  },
  {
    title: "Appearance",
    body: "Theme, density, list/grid defaults, and future Studio display controls.",
    href: "/studio/v2/account/appearance",
  },
  {
    title: "Notifications",
    body: "Email preferences, product updates, room activity, creator alerts, and review notifications.",
    href: "/studio/v2/account/notifications",
  },
  {
    title: "Privacy",
    body: "Profile visibility, public activity, blocked users, and account discoverability controls.",
    href: "/studio/v2/account/privacy",
  },
  {
    title: "Safety & Content Settings",
    body: "Content boundaries, rating preferences, comfort settings, and moderation controls as they become available.",
    href: "/studio/v2/account/safety",
  },
];

const FIELD_RECIPE =
  "mt-[var(--space-2)] min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]";

export default function AccountV2LiveView({
  isLoading = false,
  isMetricsLoading = false,
  isSaving = false,
  hasUnsavedChanges = false,
  loadErrorMessage = "",
  metricsErrorMessage = "",
  saveErrorMessage = "",
  statusMessage = "",
  userEmail = "",
  username = "",
  displayName = "",
  hasPublicProfile = false,
  publicProfileHref = null,
  coinBalance = 0,
  metricItems = [],
  fields = {},
  contentRating = {},
  defaultPlayerCharacter = null,
  hasDefaultPlayerCharacterSelection = false,
  isAgeGateOpen = false,
  ageGateLabel = "",
  isBuyCoinsOpen = false,
  onRetryLoad = null,
  onRetryMetrics = null,
  onSubmit = null,
  onContactEmailChange = null,
  onUsernameChange = null,
  onDisplayNameChange = null,
  onTaglineChange = null,
  onDescriptionChange = null,
  onAnnouncementChange = null,
  onContentRatingChange = null,
  onCloseAgeGate = null,
  onOpenBuyCoins = null,
  onCloseBuyCoins = null,
  onOpenDefaultPlayerCharacterPicker = null,
  onClearDefaultPlayerCharacter = null,
}) {
  return (
    <>
      <KitStudioPageView
        headerSlot={
          <StudioPageHeaderView
            eyebrow="Account"
            title="Profile & Preferences"
            description="Manage your private account settings, Studio preferences, coin balance, and public creator profile."
          />
        }
      >
        {isLoading ? (
          <StatusPanel message="Loading your account…" />
        ) : loadErrorMessage ? (
          <StatusPanel
            tone="danger"
            message={loadErrorMessage}
            actionLabel="Try again"
            onAction={onRetryLoad}
          />
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-[var(--space-6)]">
            <SectionCard id="public-profile">
              <div className="flex flex-wrap items-start justify-between gap-[var(--space-5)]">
                <div className="flex min-w-0 items-center gap-[var(--space-4)]">
                  <div className="flex h-[var(--space-16)] w-[var(--space-16)] shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-ornament)] bg-[var(--fill)] font-display text-[length:var(--text-title)] text-[var(--gold-ornament)]">
                    {(displayName || username || userEmail || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                      Crestfall Creator
                    </p>
                    <h2 className="mt-[var(--space-1)] truncate font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                      @{username || "unset"}
                    </h2>
                    <p className="mt-[var(--space-1)] break-all text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {userEmail || "No login email loaded"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-[var(--space-3)]">
                  {hasPublicProfile && publicProfileHref ? (
                    <Link href={publicProfileHref} className="cf-btn cf-btn--secondary">
                      View public profile
                    </Link>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSaving || !hasUnsavedChanges}
                    className="cf-btn cf-btn--primary"
                  >
                    {isSaving ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </div>

              {saveErrorMessage ? (
                <InlineMessage tone="danger" message={saveErrorMessage} />
              ) : null}
              {statusMessage ? (
                <InlineMessage tone="success" message={statusMessage} />
              ) : null}
              {hasUnsavedChanges && !saveErrorMessage && !statusMessage ? (
                <InlineMessage
                  message="Unsaved changes. Save profile to persist them."
                />
              ) : null}
            </SectionCard>

            <SectionCard label="Profile Media">
              <p className="mb-[var(--space-4)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                Profile images will later be selected from internally generated media. No external upload path is active here yet.
              </p>
              <div className="grid gap-[var(--space-3)] min-[700px]:grid-cols-2">
                <ChooseSoonStub label="Avatar" />
                <ChooseSoonStub label="Banner" />
              </div>
            </SectionCard>

            <SectionCard label="Stats">
              {metricsErrorMessage ? (
                <InlineMessage
                  tone="danger"
                  message={metricsErrorMessage}
                  compact
                  actionLabel="Retry metrics"
                  onAction={onRetryMetrics}
                />
              ) : isMetricsLoading ? (
                <InlineMessage message="Refreshing account metrics…" compact />
              ) : null}
              <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-4">
                {metricItems.map((item) => (
                  <StatTile key={item.id} value={item.value} label={item.label} />
                ))}
              </div>
            </SectionCard>

            <SectionCard id="coins">
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-4)]">
                <div>
                  <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    Coins
                  </p>
                  <h2 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                    {new Intl.NumberFormat().format(coinBalance)} Crestfall Coins
                  </h2>
                  <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    Your live balance is used by supported paid actions such as image generation and media transactions. Direct coin purchases are not available yet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenBuyCoins?.()}
                  className="cf-btn cf-btn--secondary inline-flex items-center gap-[var(--space-1)]"
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Buy coins soon
                </button>
              </div>
            </SectionCard>

            <SectionCard id="account-contact" label="Account Contact">
              <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
                <ReadOnlyValue
                  label="Login Email"
                  value={userEmail || "No login email loaded"}
                  note="Read-only here. This does not change your Google/Supabase login."
                />
                <LabeledInput
                  label="Contact Email"
                  type="email"
                  {...fields.contactEmail}
                  onChange={onContactEmailChange}
                  note="Only changes where Crestfall can contact you."
                />
              </div>
            </SectionCard>

            <SectionCard id="content-preference">
              <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
                <LabeledInput
                  label="Username"
                  {...fields.username}
                  onChange={onUsernameChange}
                />
                <LabeledInput
                  label="Display Name"
                  {...fields.displayName}
                  onChange={onDisplayNameChange}
                />

                <div className="min-[700px]:col-span-2">
                  <FieldLabel label="Content Preference" />
                  <div className="mt-[var(--space-2)]">
                    <KitDropdown
                      ariaLabel="Content Preference"
                      label={contentRating.selectedLabel || "Everyone"}
                      options={(contentRating.tiers || []).map((tier) => ({
                        value: tier.tier,
                        label: tier.label,
                        tooltip: tier.tooltip,
                      }))}
                      selectedValues={[contentRating.selectedTier || "EVERYONE"]}
                      isMultiSelect={false}
                      onToggleOption={onContentRatingChange}
                    />
                  </div>
                  <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                    Everyone maps to the current SFW backend value. Young Adult and Adult remain gated until the required age/content controls are active.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="default-player-character" label="Default Player Character">
              <p className="max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                Your preferred player identity for new story rooms. The picker only loads Player Characters owned by this account.
              </p>

              {defaultPlayerCharacter ? (
                <DefaultPlayerCharacterCard playerCharacter={defaultPlayerCharacter} />
              ) : (
                <p className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  No default Player Character selected.
                </p>
              )}

              <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
                <button
                  type="button"
                  onClick={() => onOpenDefaultPlayerCharacterPicker?.()}
                  className="cf-btn cf-btn--secondary"
                >
                  Choose default PC
                </button>

                {hasDefaultPlayerCharacterSelection ? (
                  <button
                    type="button"
                    onClick={() => onClearDefaultPlayerCharacter?.()}
                    className="cf-btn cf-btn--danger"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </SectionCard>

            <SectionCard label="Public Profile Text">
              <div className="grid gap-[var(--space-4)] min-[1100px]:grid-cols-3">
                <LabeledTextarea
                  label="Tagline"
                  {...fields.tagline}
                  onChange={onTaglineChange}
                />
                <LabeledTextarea
                  label="Description"
                  {...fields.description}
                  onChange={onDescriptionChange}
                />
                <LabeledTextarea
                  label="Announcement"
                  {...fields.announcement}
                  onChange={onAnnouncementChange}
                />
              </div>
            </SectionCard>

            <SectionCard label="Settings">
              <div className="grid gap-[var(--space-3)] min-[700px]:grid-cols-2">
                {SETTINGS_ROWS.map((row) => (
                  <Link
                    key={row.title}
                    href={row.href}
                    className="group rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)] transition-colors hover:border-[var(--line-strong)]"
                  >
                    <div className="flex items-start justify-between gap-[var(--space-3)]">
                      <div>
                        <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                          {row.title}
                        </p>
                        <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                          {row.body}
                        </p>
                      </div>
                      <span className="mt-[var(--space-1)] flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] opacity-70 transition-opacity group-hover:opacity-100">
                        Open
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>

            <div className="pt-[var(--space-2)] text-center">
              <a href="/logout" className="cf-btn cf-btn--secondary">
                Sign Out
              </a>
            </div>
          </form>
        )}
      </KitStudioPageView>

      {isAgeGateOpen ? (
        <AgeGateModal
          requestedLabel={ageGateLabel}
          onClose={onCloseAgeGate}
        />
      ) : null}

      {isBuyCoinsOpen ? <BuyCoinsModal onClose={onCloseBuyCoins} /> : null}
    </>
  );
}

function SectionCard({ id, label, children }) {
  return (
    <section id={id} className="scroll-mt-[var(--space-8)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)]">
      {label ? (
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {label}
        </p>
      ) : null}
      <div className={label ? "mt-[var(--space-4)]" : ""}>{children}</div>
    </section>
  );
}

function StatTile({ value, label }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)] text-center">
      <p className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
        {new Intl.NumberFormat().format(Number(value) || 0)}
      </p>
      <p className="mt-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
        {label}
      </p>
    </div>
  );
}

function ChooseSoonStub({ label }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)]">
      <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {label}
      </span>
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Choose Soon
      </span>
    </div>
  );
}

function FieldLabel({ label, count }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-3)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {label}
      </span>
      {count ? (
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {count}
        </span>
      ) : null}
    </div>
  );
}

function LabeledInput({
  label,
  value = "",
  onChange = null,
  count = "",
  note = "",
  type = "text",
  maxLength,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} count={count} />
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange?.(event.target.value)}
        className={FIELD_RECIPE}
      />
      {note ? (
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {note}
        </p>
      ) : null}
    </label>
  );
}

function LabeledTextarea({
  label,
  value = "",
  onChange = null,
  count = "",
  maxLength,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} count={count} />
      <textarea
        value={value}
        maxLength={maxLength}
        rows={5}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${FIELD_RECIPE} resize-none`}
      />
    </label>
  );
}

function ReadOnlyValue({ label, value, note = "" }) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="mt-[var(--space-2)] min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {value}
      </div>
      {note ? (
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function DefaultPlayerCharacterCard({ playerCharacter }) {
  return (
    <div className="mt-[var(--space-4)] flex items-start gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
      {playerCharacter.imageUrl ? (
        <div
          className="h-[var(--space-16)] w-[var(--space-16)] shrink-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-cover bg-center"
          style={{ backgroundImage: `url(${playerCharacter.imageUrl})` }}
          role="img"
          aria-label={`${playerCharacter.title} portrait`}
        />
      ) : (
        <div className="flex h-[var(--space-16)] w-[var(--space-16)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--fill)] font-display text-[length:var(--text-heading)] text-[var(--gold-ornament)]">
          {(playerCharacter.title || "P").slice(0, 1).toUpperCase()}
        </div>
      )}

      <div className="min-w-0">
        <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
          {playerCharacter.title}
        </p>
        <p className="mt-[var(--space-1)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {playerCharacter.description}
        </p>
      </div>
    </div>
  );
}

function StatusPanel({
  message,
  tone = "neutral",
  actionLabel = "",
  onAction = null,
}) {
  const toneClass =
    tone === "danger"
      ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
      : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)]";

  return (
    <div className={`rounded-[var(--radius-md)] border p-[var(--space-5)] ${toneClass}`}>
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)]">{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={() => onAction?.()}
          className="cf-btn cf-btn--secondary mt-[var(--space-4)]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function InlineMessage({
  message,
  tone = "neutral",
  compact = false,
  actionLabel = "",
  onAction = null,
}) {
  const toneClass =
    tone === "danger"
      ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
      : tone === "success"
        ? "border-[var(--status-success-border)] bg-[var(--status-success-bed)] text-[var(--status-success)]"
        : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)]";

  return (
    <div
      className={`${compact ? "mb-[var(--space-3)]" : "mt-[var(--space-4)]"} flex flex-wrap items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${toneClass}`}
    >
      <p>{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={() => onAction?.()}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function AgeGateModal({ requestedLabel, onClose }) {
  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-md"
      onClose={onClose}
      ariaLabel="Age verification required"
    >
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Age Verification Required
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          {requestedLabel} access coming soon
        </h2>
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          This preference is not activated by this page yet. Crestfall will require the appropriate age and content controls before higher content tiers become available.
        </p>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="cf-btn cf-btn--primary mt-[var(--space-5)] w-full"
        >
          OK
        </button>
      </div>
    </KitModalFrame>
  );
}

function BuyCoinsModal({ onClose }) {
  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-sm"
      onClose={onClose}
      ariaLabel="Buy coins"
    >
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Crestfall
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          Buy Coins
        </h2>
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Direct coin purchases are not connected yet. Your current live balance remains usable by supported Crestfall actions.
        </p>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="cf-btn cf-btn--primary mt-[var(--space-5)] w-full"
        >
          Got it
        </button>
      </div>
    </KitModalFrame>
  );
}
