"use client";

import {
  getMechanicsCommandDomainQueryArgumentOptions,
  normalizeMechanicsCommandDomainQuery,
} from "./mechanicsCommandDomainQueryNormalization.js";
import {
  addMechanicsCommandDomainQueryBinding,
  patchMechanicsCommandDomainQuery,
  patchMechanicsCommandDomainQueryBinding,
  removeMechanicsCommandDomainQueryBinding,
} from "./mechanicsCommandDomainQueryOperations.js";

export default function useMechanicsCommandDomainQueryViewModel({
  domainQuery,
  invocation,
  onChange,
}) {
  const query = normalizeMechanicsCommandDomainQuery(domainQuery);
  const argumentOptions = getMechanicsCommandDomainQueryArgumentOptions(invocation);
  const emit = (next) => onChange?.(normalizeMechanicsCommandDomainQuery(next));

  return {
    domainQuery: query,
    argumentOptions,
    onPatch: (patch) => emit(patchMechanicsCommandDomainQuery(query, patch)),
    onAddBinding: () => emit(addMechanicsCommandDomainQueryBinding(query)),
    onPatchBinding: (index, patch) =>
      emit(patchMechanicsCommandDomainQueryBinding(query, index, patch)),
    onRemoveBinding: (index) =>
      emit(removeMechanicsCommandDomainQueryBinding(query, index)),
  };
}
