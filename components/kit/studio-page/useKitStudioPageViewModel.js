export function useKitStudioPageViewModel(props) {
  return {
    harnessSlot: props?.harnessSlot ?? null,
    headerSlot: props?.headerSlot ?? null,
    headerAlign: props?.headerAlign ?? "left",
    filterBarSlot: props?.filterBarSlot ?? null,
    bannerSlot: props?.bannerSlot ?? null,
    children: props?.children ?? null,
  };
}
