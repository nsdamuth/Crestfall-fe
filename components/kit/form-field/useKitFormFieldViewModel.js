"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Value, error, success, and
// count are always caller-owned; the fold's open/closed state is the
// View's own sanctioned presentation-only local state.
export function useKitFormFieldViewModel({
  label = "",
  value = "",
  placeholder = "",
  helper = "",
  error = "",
  success = "",
  maxLength = null,
  count = null,
  isFolded = null,
  onToggleFold = null,
  children = null,
  isDisabled = false,
  type = "text",
  onChange = null,
} = {}) {
  return {
    label,
    value,
    placeholder,
    helper,
    error,
    success,
    maxLength,
    count,
    isFolded,
    onToggleFold,
    children,
    isDisabled: Boolean(isDisabled),
    type,
    onChange,
  };
}
