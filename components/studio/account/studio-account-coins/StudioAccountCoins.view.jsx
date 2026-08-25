import { ShoppingBag } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

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
              <p className="mt-2 text-xs leading-5 text-[var(--status-danger)]">
                {balanceErrorMessage}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onOpenPurchaseInfo?.()}
            className="cf-btn cf-btn--secondary"
          >
            <ShoppingBag size={14} />
            Buy coins soon
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          {statItems.map((item, index) => (
            <div
              key={item?.id || item?.label || index}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-3"
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
        <KitModalFrame
          onClose={onClosePurchaseInfo}
          ariaLabelledBy="studio-account-coins-purchase-info-title"
          panelClassName="w-full max-w-sm p-[var(--space-5)]"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Crestfall
          </p>
          <h2
            id="studio-account-coins-purchase-info-title"
            className="mt-2 font-display text-3xl"
          >
            Buy Coins
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--ink-dim)]">
            Coin purchases are coming later. For private testing, an admin can
            manually add coins to your account.
          </p>

          <button
            type="button"
            onClick={() => onClosePurchaseInfo?.()}
            className="cf-btn cf-btn--primary mt-5 w-full"
          >
            Got it
          </button>
        </KitModalFrame>
      ) : null}
    </>
  );
}
