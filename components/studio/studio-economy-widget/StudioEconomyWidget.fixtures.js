const noop = () => {};

const baseFixture = {
  layoutMode: "expanded",
  balanceLabel: "2,450",
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

// From 100,000 the label is compact (987,654,321 reads 987.7M).
export const studioEconomyWidgetLargeBalanceFixture = {
  ...baseFixture,
  balanceLabel: "987.7M",
};
