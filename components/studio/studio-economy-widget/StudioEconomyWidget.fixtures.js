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

export const studioEconomyWidgetLargeBalanceFixture = {
  ...baseFixture,
  balanceLabel: "987,654,321",
};
