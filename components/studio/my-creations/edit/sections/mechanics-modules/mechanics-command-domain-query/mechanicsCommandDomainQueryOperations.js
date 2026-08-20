import {
  MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
} from "./MechanicsCommandDomainQuery.contract.js";
import {
  normalizeMechanicsCommandDomainQuery,
} from "./mechanicsCommandDomainQueryNormalization.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function patchMechanicsCommandDomainQuery(current, patch = {}) {
  return normalizeMechanicsCommandDomainQuery({
    ...normalizeMechanicsCommandDomainQuery(current),
    ...patch,
  });
}

export function addMechanicsCommandDomainQueryBinding(current) {
  const query = normalizeMechanicsCommandDomainQuery(current);
  if (query.argumentBindings.length >= MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS) {
    return query;
  }

  const existing = new Set(query.argumentBindings.map((binding) => binding.parameter));
  let index = query.argumentBindings.length + 1;
  let parameter = `parameter_${index}`;
  while (existing.has(parameter)) {
    index += 1;
    parameter = `parameter_${index}`;
  }

  return normalizeMechanicsCommandDomainQuery({
    ...query,
    argumentBindings: [
      ...query.argumentBindings,
      {
        parameter,
        sourceArgumentName: "",
      },
    ],
  });
}

export function patchMechanicsCommandDomainQueryBinding(current, index, patch = {}) {
  const query = normalizeMechanicsCommandDomainQuery(current);
  return normalizeMechanicsCommandDomainQuery({
    ...query,
    argumentBindings: asArray(query.argumentBindings).map((binding, bindingIndex) =>
      bindingIndex === index ? { ...binding, ...patch } : binding
    ),
  });
}

export function removeMechanicsCommandDomainQueryBinding(current, index) {
  const query = normalizeMechanicsCommandDomainQuery(current);
  return normalizeMechanicsCommandDomainQuery({
    ...query,
    argumentBindings: asArray(query.argumentBindings).filter(
      (_binding, bindingIndex) => bindingIndex !== index
    ),
  });
}
