"use client";

import { Bell, Coins, ShoppingBag, UserRound, X } from "lucide-react";

export default function StudioTopBarView({
  eyebrow = "Studio",
  description = "",
  formattedCoins = "0",
  buyCoinsLabel = "Buy Coins",
  notificationsLabel = "Notifications",
  accountHref = "/studio/account",
  accountAriaLabel = "Account",
  accountLinkSlot = null,
  utilityModal = null,
  onOpenBuyCoins = () => {},
  onOpenNotifications = () => {},
  onCloseUtility = () => {},
}) {
  return (
    <>
      <header className="mb-8 hidden items-center justify-between gap-6 rounded-2xl border border-[var(--gold-ornament)]/15 bg-black/45 px-5 py-4 backdrop-blur-md lg:flex">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <p className="mt-1 truncate text-sm text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-2 text-sm text-[var(--gold-ornament)]">
            <Coins size={16} />
            <span>{formattedCoins}</span>
          </div>

          <button
            type="button"
            onClick={onOpenBuyCoins}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/25 hover:text-[var(--ink)]"
          >
            <ShoppingBag size={14} />
            {buyCoinsLabel}
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="rounded-full border border-white/10 p-2.5 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label={notificationsLabel}
          >
            <Bell size={17} />
          </button>

          {accountLinkSlot || (
            <a
              href={accountHref}
              className="rounded-full border border-[var(--gold-ornament)]/25 p-2.5 text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/50 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
              aria-label={accountAriaLabel}
            >
              <UserRound size={17} />
            </a>
          )}
        </div>
      </header>

      {utilityModal ? (
        <StudioUtilityModal
          title={utilityModal.title}
          body={utilityModal.body}
          dismissLabel={utilityModal.dismissLabel}
          onClose={onCloseUtility}
        />
      ) : null}
    </>
  );
}

function StudioUtilityModal({
  title = "",
  body = "",
  dismissLabel = "Got it",
  onClose = () => {},
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]">
      <section className="w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[#080706] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Crestfall
            </p>
            <h2 className="mt-2 font-display text-3xl">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-[var(--ink-dim)]">{body}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
        >
          {dismissLabel}
        </button>
      </section>
    </div>
  );
}
