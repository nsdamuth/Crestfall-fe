import { ShoppingBag, X } from "lucide-react";

export default function StudioAccountCoinsView({
  balanceLabel = "0",
  balanceErrorMessage = "",
  statItems = [],
  purchaseInfoOpen = false,
  onOpenPurchaseInfo = null,
  onClosePurchaseInfo = null,
}) {
  return (
    <>
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Coins
            </p>

            <h2 className="mt-1 font-display text-3xl">
              {balanceLabel} Crestfall Coins
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              Wallet, purchases, image generation, and premium actions will
              connect later.
            </p>

            {balanceErrorMessage ? (
              <p className="mt-2 text-xs leading-5 text-red-200">
                {balanceErrorMessage}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onOpenPurchaseInfo?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
          >
            <ShoppingBag size={14} />
            Buy Coins Soon
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          {statItems.map((item, index) => (
            <div
              key={item?.id || item?.label || index}
              className="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <p className="font-display text-2xl">{item?.value ?? "0"}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                {item?.label || "Metric"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {purchaseInfoOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]">
          <section className="w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                  Crestfall
                </p>
                <h2 className="mt-2 font-display text-3xl">Buy Coins</h2>
              </div>

              <button
                type="button"
                onClick={() => onClosePurchaseInfo?.()}
                className="rounded-[var(--radius-full)] border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-[var(--ink-dim)]">
              Coin purchases are coming later. For private testing, an admin can
              manually add coins to your account.
            </p>

            <button
              type="button"
              onClick={() => onClosePurchaseInfo?.()}
              className="mt-5 w-full rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
            >
              Got it
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
