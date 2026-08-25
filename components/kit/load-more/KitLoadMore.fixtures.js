const noop = () => {};

export const kitLoadMoreDefaultFixture = {
  isLoading: false,
  hasMore: true,
  remainingCount: 24,
  onLoadMore: noop,
};

export const kitLoadMoreLoadingFixture = {
  ...kitLoadMoreDefaultFixture,
  isLoading: true,
};

export const kitLoadMoreExhaustedFixture = {
  ...kitLoadMoreDefaultFixture,
  hasMore: false,
  remainingCount: 0,
};

export const kitLoadMoreUnknownCountFixture = {
  ...kitLoadMoreDefaultFixture,
  remainingCount: null,
};
