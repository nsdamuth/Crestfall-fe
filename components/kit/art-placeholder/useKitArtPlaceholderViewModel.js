const VALID_SIZES = ["sm", "md", "lg"];

export function useKitArtPlaceholderViewModel(props) {
  const size = VALID_SIZES.includes(props?.size) ? props.size : "md";

  return { size };
}
