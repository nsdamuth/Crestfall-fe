export function useKitLoadMoreViewModel(props) {
  const isLoading = Boolean(props?.isLoading);
  const hasMore = props?.hasMore !== false;
  const remainingCount =
    typeof props?.remainingCount === "number" &&
    Number.isFinite(props.remainingCount)
      ? props.remainingCount
      : null;
  const onLoadMore =
    typeof props?.onLoadMore === "function" ? props.onLoadMore : null;

  return { isLoading, hasMore, remainingCount, onLoadMore };
}
