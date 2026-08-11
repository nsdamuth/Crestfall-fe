function toCallback(value) {
  return typeof value === "function" ? value : null;
}

export function useKitDestinationTileViewModel(props) {
  return {
    label: typeof props?.label === "string" ? props.label : "",
    supportingLine: typeof props?.supportingLine === "string" ? props.supportingLine : "",
    imageSrc: typeof props?.imageSrc === "string" ? props.imageSrc : null,
    onOpen: toCallback(props?.onOpen),
  };
}
