export const mechanicsCommandDomainQueryAbilitySpellFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: true,
      domain: "ABILITY_SPELL",
      operation: "QUERY_AVAILABILITY",
      argumentBindings: [
        {
          parameter: "ability",
          sourceArgumentName: "ability_name",
        },
        {
          parameter: "target",
          sourceArgumentName: "target",
        },
      ],
    },
    argumentOptions: [
      {
        name: "ability_name",
        label: "Ability",
        type: "TEXT",
      },
      {
        name: "target",
        label: "Target",
        type: "CHARACTER_PRESENT",
      },
    ],
  });

export const mechanicsCommandDomainQueryStatsPoolsFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: true,
      domain: "STATS_POOLS",
      operation: "QUERY_STATE",
      argumentBindings: [
        {
          parameter: "subject",
          sourceArgumentName: "subject",
        },
      ],
    },
    argumentOptions: [
      {
        name: "subject",
        label: "Subject",
        type: "CHARACTER_BOUND",
      },
    ],
  });

export const mechanicsCommandDomainQueryIncompleteFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: true,
      domain: "",
      operation: "",
      argumentBindings: [
        {
          parameter: "ability",
          sourceArgumentName: "",
        },
      ],
    },
    argumentOptions: [
      {
        name: "ability_name",
        label: "Ability",
        type: "TEXT",
      },
    ],
  });

export const mechanicsCommandDomainQueryUnknownArgumentFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: true,
      domain: "ABILITY_SPELL",
      operation: "QUERY_AVAILABILITY",
      argumentBindings: [
        {
          parameter: "ability",
          sourceArgumentName: "removed_argument",
        },
      ],
    },
    argumentOptions: [
      {
        name: "ability_name",
        label: "Ability",
        type: "TEXT",
      },
    ],
  });

export const mechanicsCommandDomainQueryDisabledFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: false,
      domain: "",
      operation: "",
      argumentBindings: [],
    },
    argumentOptions: [],
  });

export const mechanicsCommandDomainQueryBindingLimitFixture =
  Object.freeze({
    domainQuery: {
      version: "mechanics_command_domain_query_v1",
      enabled: true,
      domain: "STATS_POOLS",
      operation: "QUERY_STATE",
      argumentBindings: Array.from(
        { length: 12 },
        (_, index) => ({
          parameter: `parameter_${index + 1}`,
          sourceArgumentName: `argument_${index + 1}`,
        })
      ),
    },
    argumentOptions: Array.from(
      { length: 12 },
      (_, index) => ({
        name: `argument_${index + 1}`,
        label: `Argument ${index + 1}`,
        type: "TEXT",
      })
    ),
  });
