import {
  MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
  MECHANICS_COMMAND_DOMAIN_QUERY_CONTRACT_VERSION,
} from "./MechanicsCommandDomainQuery.contract.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

function normalizeIdentifier(value) {
  return normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeOperationIdentifier(value) {
  return normalizeString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9._:-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getMechanicsCommandDomainQueryArgumentOptions(invocation = {}) {
  return asArray(asObject(invocation).arguments)
    .map((argument) => {
      const source = asObject(argument);
      const name = normalizeIdentifier(source.name || source.id);
      if (!name) return null;
      return {
        name,
        label: normalizeString(source.label) || name,
        type: normalizeOperationIdentifier(source.type),
      };
    })
    .filter(Boolean);
}

export function normalizeMechanicsCommandDomainQuery(value = {}) {
  const source = asObject(value);
  const domain = normalizeOperationIdentifier(
    source.domain || source.domainId || source.domain_id
  );
  const operation = normalizeOperationIdentifier(
    source.operation || source.operationId || source.operation_id
  );
  const argumentBindings = asArray(
    source.argumentBindings ||
      source.argument_bindings ||
      source.arguments ||
      source.bindings
  )
    .slice(0, MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS)
    .map((binding, index) => {
      const entry = asObject(binding);
      const parameter = normalizeIdentifier(
        entry.parameter || entry.parameterName || entry.parameter_name
      );
      const sourceArgumentName = normalizeIdentifier(
        entry.sourceArgumentName ||
          entry.source_argument_name ||
          entry.argumentName ||
          entry.argument_name
      );
      return {
        ...entry,
        parameter: parameter || `parameter_${index + 1}`,
        sourceArgumentName,
      };
    });
  const requestedEnabled = normalizeBoolean(
    source.enabled,
    Boolean(domain && operation)
  );

  return {
    ...source,
    version: MECHANICS_COMMAND_DOMAIN_QUERY_CONTRACT_VERSION,
    enabled: requestedEnabled,
    domain,
    operation,
    argumentBindings,
  };
}
