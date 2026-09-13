// Pass-through ViewModel for ShareLanding (contract 1.0.0): every prop
// the View reads is accepted, normalized, and returned. The server
// composition calls buildShareLandingViewProps (no hook name, so the
// hook rules stay quiet in an async component); a client consumer may
// call the hook-named alias.

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildShareLandingViewProps(props = {}) {
  return {
    kindLabel: text(props.kindLabel),
    isCanon: props.isCanon === true,
    title: text(props.title) || "Untitled",
    byline: text(props.byline),
    creatorHref: text(props.creatorHref) || null,
    excerpt: text(props.excerpt),
    imageSrc: text(props.imageSrc),
    actionLabel: text(props.actionLabel) || "Play free on Crestfall Studio",
    actionHref: text(props.actionHref) || "/login",
    errorMessage: text(props.errorMessage),
  };
}

export function useShareLandingViewModel(props = {}) {
  return buildShareLandingViewProps(props);
}
