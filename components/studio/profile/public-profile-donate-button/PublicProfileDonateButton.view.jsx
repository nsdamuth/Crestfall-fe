"use client";

import { Gift, Loader2, X } from "lucide-react";
import { PUBLIC_PROFILE_DONATION_MESSAGE_TONES } from "./PublicProfileDonateButton.contract";

export default function PublicProfileDonateButtonView({
  isVisible = false,
  isOpen = false,
  recipientHandle = "creator",
  minimumDonation = 100,
  amountValue = minimumDonation,
  messageValue = "",
  isAnonymous = false,
  isBusy = false,
  isSuccess = false,
  balanceLabel = 0,
  amountNet = 0,
  taxAmount = 0,
  taxPercent = 0,
  submitLabel = `Donate ${minimumDonation} coins`,
  statusMessage = "",
  statusTone = "",
  onOpenDonation = null,
  onCloseDonation = null,
  onChangeAmount = null,
  onChangeMessage = null,
  onChangeAnonymous = null,
  onSubmitDonation = null,
}) {
  if (!isVisible) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenDonation?.()}
        className="cf-btn cf-btn--primary"
      >
        <Gift size={14} />
        Donate
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]">
          <section className="w-full max-w-lg rounded-[var(--radius-lg)] border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-pink-200">
                  Donate Coins
                </p>
                <h3 className="mt-1 font-display text-3xl">
                  Support @{recipientHandle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                  Send coins directly to this creator. Minimum donation is{" "}
                  {minimumDonation} coins.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onCloseDonation?.()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                aria-label="Close donation dialog"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitDonation?.();
              }}
              className="mt-5 space-y-4"
            >
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  Amount
                </span>
                <input
                  type="number"
                  min={minimumDonation}
                  step="1"
                  value={amountValue}
                  disabled={isBusy || isSuccess}
                  onChange={(event) => onChangeAmount?.(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 disabled:opacity-60"
                />
              </label>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-[var(--ink-dim)]">
                <p>Your balance: {balanceLabel} coins</p>
                <p>Creator receives: {amountNet} coins</p>
                <p>
                  Platform tax: {taxAmount} coins ({taxPercent}%)
                </p>
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  Message optional
                </span>
                <textarea
                  value={messageValue}
                  disabled={isBusy || isSuccess}
                  onChange={(event) => onChangeMessage?.(event.target.value)}
                  rows={4}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 disabled:opacity-60"
                  placeholder="Add a message to your donation..."
                />
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/35 p-3">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  disabled={isBusy || isSuccess}
                  onChange={(event) =>
                    onChangeAnonymous?.(event.target.checked)
                  }
                  className="mt-1"
                />
                <span className="text-sm leading-6 text-[var(--ink-dim)]">
                  Donate anonymously. You will appear as Mystery Donor publicly.
                </span>
              </label>

              {statusMessage ? (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    statusTone ===
                    PUBLIC_PROFILE_DONATION_MESSAGE_TONES.SUCCESS
                      ? "border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
                      : "border-red-500/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {statusMessage}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                {isSuccess ? (
                  <button
                    type="button"
                    onClick={() => onCloseDonation?.()}
                    className="cf-btn cf-btn--primary"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onCloseDonation?.()}
                      className="cf-btn cf-btn--secondary"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isBusy}
                      className="cf-btn cf-btn--primary"
                    >
                      {isBusy ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Gift size={14} />
                      )}
                      {submitLabel}
                    </button>
                  </>
                )}
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
