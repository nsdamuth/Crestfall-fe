export const MECHANICS_COMMAND_DOMAIN_QUERY_PRESENTATION_CONTRACT_VERSION =
  "mechanics_command_domain_query.presentation.v1";

export const MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION =
  "mechanics_command_domain_query_v1";

export const MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS = 12;

export const MECHANICS_COMMAND_DOMAIN_QUERY_CALLBACK_KEYS = Object.freeze([
  "onPatch",
  "onAddBinding",
  "onPatchBinding",
  "onRemoveBinding",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function projectArgumentOption(value = {}) {
  const source = object(value);

  return {
    name: text(source.name),
    label: text(source.label) || text(source.name),
    type: text(source.type),
    displayLabel: text(source.type)
      ? `${text(source.label) || text(source.name)} (${text(source.type)})`
      : text(source.label) || text(source.name),
  };
}

function projectBinding(value = {}, index = 0, argumentOptions = []) {
  const source = object(value);
  const parameter = text(source.parameter);
  const sourceArgumentName = text(source.sourceArgumentName);
  const selectedArgument = argumentOptions.find(
    (argument) => argument.name === sourceArgumentName
  );

  const authoringHints = [];

  if (!parameter) {
    authoringHints.push(
      "Domain query binding requires a parameter name."
    );
  }

  if (!sourceArgumentName) {
    authoringHints.push(
      "Domain query binding requires a command argument."
    );
  } else if (!selectedArgument) {
    authoringHints.push(
      `Unknown command argument "${sourceArgumentName}".`
    );
  }

  return {
    index,
    parameter,
    sourceArgumentName,
    parameterLabel: "Query parameter",
    parameterPlaceholder: "subject",
    commandArgumentLabel: "Command argument",
    selectedArgument: selectedArgument || null,
    authoringHints,
    complete: Boolean(parameter && selectedArgument),
    removeLabel: "Remove",
  };
}

export function projectMechanicsCommandDomainQueryPresentation({
  domainQuery = {},
  argumentOptions = [],
} = {}) {
  const query = object(domainQuery);
  const projectedArgumentOptions = array(argumentOptions)
    .map(projectArgumentOption)
    .filter((option) => option.name);

  const bindings = array(query.argumentBindings)
    .slice(0, MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS)
    .map((binding, index) =>
      projectBinding(binding, index, projectedArgumentOptions)
    );

  const enabled = query.enabled === true;
  const domain = text(query.domain);
  const operation = text(query.operation);
  const authoringHints = [];

  if (enabled && !domain) {
    authoringHints.push(
      "Enabled domain query requires a domain identifier."
    );
  }

  if (enabled && !operation) {
    authoringHints.push(
      "Enabled domain query requires an operation identifier."
    );
  }

  const incompleteBindingCount = bindings.filter(
    (binding) => !binding.complete
  ).length;

  return {
    contractVersion:
      MECHANICS_COMMAND_DOMAIN_QUERY_PRESENTATION_CONTRACT_VERSION,
    authoringContractVersion:
      text(query.version) ||
      MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION,

    title: "Domain Query",
    description:
      "Route this creator-authored command to a registered read-only Crestfall domain query. Crestfall owns the typed domain/operation contract; the creator owns the command name. Queries do not mutate state or grant execution authority.",

    enabled,
    enableLabel: "Enable typed domain query",

    domain: {
      value: domain,
      label: "Domain",
      placeholder: "ABILITY_SPELL",
      helper:
        "Typed platform domain identifier. Runtime rejects unregistered domain/operation pairs.",
    },

    operation: {
      value: operation,
      label: "Operation",
      placeholder: "QUERY_AVAILABILITY",
      helper:
        "Domain-owned read operation. This field does not define or execute game rules by itself.",
    },

    argumentBindings: {
      title: "Argument bindings",
      description:
        "Map creator-authored command arguments into generic query parameters.",
      addLabel: "Add binding",
      maxBindings: MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
      canAddBinding:
        bindings.length < MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
      count: bindings.length,
      incompleteCount: incompleteBindingCount,
      rows: bindings,
    },

    argumentOptions: projectedArgumentOptions,

    authoringState: {
      enabled,
      identifiersComplete: Boolean(domain && operation),
      incompleteBindingCount,
      hasIncompleteAuthoring:
        enabled &&
        (
          !domain ||
          !operation ||
          incompleteBindingCount > 0
        ),
      hints: [
        ...authoringHints,
        ...bindings.flatMap((binding) => binding.authoringHints),
      ],
    },

    authority: {
      readOnlyQuery: true,
      statePersistenceAllowed: false,
      mutationAllowed: false,
      executionAuthorityGranted: false,
      providerInvocationAllowed: false,
      runtimeAdapterRegistrationRequired: true,
      invocationArgumentsAreCreatorAuthored: true,
    },
  };
}
