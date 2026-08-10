const VALID_TREATMENTS = new Set(["top", "card", "bottom"]);
const VALID_BOTTOM_VARIANTS = new Set(["uniform", "bottom-fade"]);

export function useKitPromoBannerViewModel(props) {
  return {
    treatment: VALID_TREATMENTS.has(props?.treatment) ? props.treatment : "bottom",
    bottomVariant: VALID_BOTTOM_VARIANTS.has(props?.bottomVariant)
      ? props.bottomVariant
      : "uniform",
    eyebrow: typeof props?.eyebrow === "string" ? props.eyebrow : "",
    title: typeof props?.title === "string" ? props.title : "",
    line: typeof props?.line === "string" ? props.line : "",
    ctaLabel: typeof props?.ctaLabel === "string" ? props.ctaLabel : "",
    imageSrc: typeof props?.imageSrc === "string" ? props.imageSrc : null,
    onCtaClick: typeof props?.onCtaClick === "function" ? props.onCtaClick : null,
  };
}
