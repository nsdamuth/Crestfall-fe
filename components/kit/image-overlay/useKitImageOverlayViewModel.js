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
    // B7 viewer final: application-owned callbacks remain outside the View.
    // Reassignment is live when the caller supplies the current Chassis binding.
    onDelete: toCallback(props?.onDelete),
    onReport: toCallback(props?.onReport),
    onDetails: toCallback(props?.onDetails),
    onDownload: toCallback(props?.onDownload),
    onGenerateVariant: toCallback(props?.onGenerateVariant),
    onReassignAsset: toCallback(props?.onReassignAsset),
  };
}
