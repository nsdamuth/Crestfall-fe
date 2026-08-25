export const LOCATION_ONLY_SCENERY_PROMPT_FRAGMENT =
  "no_humans, scenery, (empty_stage:1.1), wide_shot, scenery_porn, cinematic, detailed_background, highly_detailed, sharp_focus";

export function isLocationOnlyImageComposition(selectedIngredients = {}) {
  return Boolean(
    selectedIngredients?.location &&
      !selectedIngredients?.character &&
      !selectedIngredients?.playerCharacter
  );
}

export function appendPromptFragment(prompt, fragment) {
  const basePrompt = String(prompt || "").trim();
  const nextFragment = String(fragment || "").trim();

  if (!nextFragment) return basePrompt;
  if (!basePrompt) return nextFragment;

  return `${basePrompt.replace(/[,\s]+$/, "")}, ${nextFragment}`;
}
