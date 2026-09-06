const noop = () => {};

const baseFixture = {
  layoutMode: "expanded",
  balanceLabel: "2,450",
  lowBalance: false,
  buyInfoOpen: false,
  notificationsInfoOpen: false,
  onOpenBuyInfo: noop,
  onCloseBuyInfo: noop,
  onOpenNotificationsInfo: noop,
  onCloseNotificationsInfo: noop,
};

export const studioEconomyWidgetExpandedFixture = {
  ...baseFixture,
};

export const studioEconomyWidgetCollapsedFixture = {
  ...baseFixture,
  layoutMode: "collapsed",
};

export const studioEconomyWidgetMobileHeaderFixture = {
  ...baseFixture,
  layoutMode: "mobileHeader",
};

export const studioEconomyWidgetLoadingFixture = {
  ...baseFixture,
  balanceLabel: "...",
};

export const studioEconomyWidgetBuyInfoFixture = {
  ...baseFixture,
  buyInfoOpen: true,
};

export const studioEconomyWidgetNotificationsInfoFixture = {
  ...baseFixture,
  notificationsInfoOpen: true,
};

// Widest full-number label under the coin display law (6 Sep 2026):
// five digits plus one separator.
export const studioEconomyWidgetCeilingBalanceFixture = {
  ...baseFixture,
  balanceLabel: "99,999",
};

// Below the cost of one standard generation (5 coins, 6 Sep 2026):
// the balance row reads amber, the Upgrade button stays gold.
export const studioEconomyWidgetLowBalanceFixture = {
  ...baseFixture,
  balanceLabel: "3",
  lowBalance: true,
};

// Collapsed shows only the gold coin button (batch 2 fixes, 6 Sep
// 2026): the low state has no collapsed presentation, this fixture
// proves nothing amber leaks into that mode.
export const studioEconomyWidgetCollapsedLowBalanceFixture = {
  ...baseFixture,
  layoutMode: "collapsed",
  balanceLabel: "3",
  lowBalance: true,
};

// From 100,000 the label is compact (987,654,321 reads 987.7M).
export const studioEconomyWidgetLargeBalanceFixture = {
  ...baseFixture,
  balanceLabel: "987.7M",
};
