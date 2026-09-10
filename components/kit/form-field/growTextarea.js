// One row until content needs more, then the field grows with the
// text, capped so a long paste never pushes the panel off screen.
// Moved out of KitImageCreatorPanel.view.jsx (FE/MEDIA-STUDIO session
// 2, notes 3 and 4) so the composer prompts and the custom asset
// modal share one growth rule by construction. Applied as a callback
// ref (sizes correctly on mount, fixtures included) and again on every
// change. Presentation only: no effect, no fetch. The field recipe it
// pairs with must carry resize-none and overflow-hidden, or the
// scrollHeight measurement is wrong.
export const TEXTAREA_MAX_HEIGHT_PX = 320;

export function growTextarea(element) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${Math.min(element.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
}
