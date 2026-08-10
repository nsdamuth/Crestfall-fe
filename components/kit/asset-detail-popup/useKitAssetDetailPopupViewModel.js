"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Primary-action label is
// derived here (display concern only, not a data transform) since it
// is a pure function of assetKind, not a caller responsibility.
const PRIMARY_ACTION_LABEL = {
  character: "Play",
  story: "Play",
  adventure: "Continue",
};

function toCallback(value) {
  return typeof value === "function" ? value : null;
}

export function useKitAssetDetailPopupViewModel({
  assetKind = "character",
  title = "",
  subtitle = "",
  imageSrc = null,
  badges = [],
  stats = {},
  description = "",
  isSaved = false,
  onPrimaryAction = null,
  onShare = null,
  onSave = null,
  onClose = null,
} = {}) {
  return {
    assetKind,
    primaryActionLabel: PRIMARY_ACTION_LABEL[assetKind] || "Play",
    title,
    subtitle,
    imageSrc: typeof imageSrc === "string" ? imageSrc : null,
    badges: Array.isArray(badges) ? badges : [],
    stats: stats || {},
    description,
    isSaved: Boolean(isSaved),
    onPrimaryAction: toCallback(onPrimaryAction),
    onShare: toCallback(onShare),
    onSave: toCallback(onSave),
    onClose: toCallback(onClose),
  };
}
