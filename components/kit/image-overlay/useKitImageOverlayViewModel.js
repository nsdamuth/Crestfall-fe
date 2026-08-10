function toCallback(value) {
  return typeof value === "function" ? value : null;
}

export function useKitImageOverlayViewModel(props) {
  return {
    imageSrc: typeof props?.imageSrc === "string" ? props.imageSrc : null,
    title: typeof props?.title === "string" ? props.title : "",
    isLoved: Boolean(props?.isLoved),
    isSaved: Boolean(props?.isSaved),
    onLove: toCallback(props?.onLove),
    onSave: toCallback(props?.onSave),
    onShare: toCallback(props?.onShare),
    onClose: toCallback(props?.onClose),
  };
}
