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
    // B7 viewer final (ED1F propagation plan group G3): the header's
    // icon row and the bottom bar's Generate Variant action.
    // onReassignAsset is accepted for forward compatibility but the
    // view always renders that action as an honest stub (CR-055).
    onDelete: toCallback(props?.onDelete),
    onReport: toCallback(props?.onReport),
    onDetails: toCallback(props?.onDetails),
    onDownload: toCallback(props?.onDownload),
    onGenerateVariant: toCallback(props?.onGenerateVariant),
    onReassignAsset: toCallback(props?.onReassignAsset),
  };
}
