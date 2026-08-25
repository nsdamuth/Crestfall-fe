const VALID_VARIANTS = new Set(["canon", "status", "meta"]);
const VALID_SURFACES = new Set(["canvas", "art"]);

export function useKitBadgeViewModel(props) {
  const label = typeof props?.label === "string" ? props.label : "";
  const variant = VALID_VARIANTS.has(props?.variant) ? props.variant : "status";
  const surface = VALID_SURFACES.has(props?.surface) ? props.surface : "canvas";

  return { label, variant, surface };
}
