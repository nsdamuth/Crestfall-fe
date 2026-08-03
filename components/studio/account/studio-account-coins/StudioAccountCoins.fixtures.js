const noop = () => {};

const baseFixture = {
  balanceLabel: "2,450",
  balanceErrorMessage: "",
  statItems: [
    { id: "characters", value: "0", label: "Characters" },
    { id: "canon", value: "0", label: "Canon" },
    { id: "messages", value: "0", label: "Messages" },
    { id: "likes", value: "0", label: "Likes" },
  ],
  purchaseInfoOpen: false,
  onOpenPurchaseInfo: noop,
  onClosePurchaseInfo: noop,
};

export const studioAccountCoinsReadyFixture = {
  ...baseFixture,
};

export const studioAccountCoinsLoadingFixture = {
  ...baseFixture,
  balanceLabel: "...",
};

export const studioAccountCoinsErrorFixture = {
  ...baseFixture,
  balanceLabel: "0",
  balanceErrorMessage: "Coin balance could not be loaded.",
};

export const studioAccountCoinsPurchaseInfoFixture = {
  ...baseFixture,
  purchaseInfoOpen: true,
};

export const studioAccountCoinsLargeBalanceFixture = {
  ...baseFixture,
  balanceLabel: "987,654,321",
  statItems: [
    { id: "characters", value: "1,248", label: "Characters" },
    { id: "canon", value: "386", label: "Canon" },
    { id: "messages", value: "99,999+", label: "Messages" },
    { id: "likes", value: "4,208,117", label: "Likes" },
  ],
};
