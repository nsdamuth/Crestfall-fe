export const WALLET_PROFILE_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";
export const WALLET_PROFILE_CONTRACT_VERSION = "wallet_profile_contract_v0";
export const WALLET_CURRENCY_DEFINITION_VERSION =
  "wallet_currency_definition_v0";

export const WALLET_PROFILE_LIMITS = Object.freeze({
  maxCurrencies: 32,
  maxIdentifierLength: 96,
  maxTitleLength: 160,
  maxDescriptionLength: 2400,
  maxSymbolLength: 16,
  minBalance: Number.MIN_SAFE_INTEGER,
  maxBalance: Number.MAX_SAFE_INTEGER,
});

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeIdentifier(value, fallback = "") {
  return normalizeString(value).toLowerCase() || fallback;
}

function normalizeSafeInteger(
  value,
  fallback = 0,
  minimum = WALLET_PROFILE_LIMITS.minBalance,
  maximum = WALLET_PROFILE_LIMITS.maxBalance
) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function uniqueStrings(values, limit = 24) {
  const source = Array.isArray(values)
    ? values
    : typeof values === "string"
      ? values.split(",")
      : [];
  const seen = new Set();
  const result = [];

  for (const value of source) {
    const candidate = normalizeString(value).toLowerCase();
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    result.push(candidate);
    if (result.length >= limit) break;
  }

  return result;
}

function createIssue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function normalizeWalletCurrencyDefinition(value = {}, index = 0) {
  const source = normalizeObject(value);
  const minimumBalance = normalizeSafeInteger(source.minimumBalance, 0);
  const maximumBalance = normalizeSafeInteger(
    source.maximumBalance,
    WALLET_PROFILE_LIMITS.maxBalance
  );
  const boundedMaximum = Math.max(minimumBalance, maximumBalance);
  const startingBalance = normalizeSafeInteger(
    source.startingBalance,
    0,
    minimumBalance,
    boundedMaximum
  );

  return {
    definitionVersion:
      normalizeString(source.definitionVersion) ||
      WALLET_CURRENCY_DEFINITION_VERSION,
    id: normalizeIdentifier(source.id, `currency.${index + 1}`),
    title: normalizeString(source.title),
    symbol: normalizeString(source.symbol),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    startingBalance,
    minimumBalance,
    maximumBalance: boundedMaximum,
    tags: uniqueStrings(source.tags),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeWalletProfileEditorValue(value = {}) {
  const source = normalizeObject(value);

  return {
    contractVersion:
      normalizeString(source.contractVersion) || WALLET_PROFILE_CONTRACT_VERSION,
    title: normalizeString(source.title),
    description: normalizeString(source.description),
    enabled: source.enabled !== false,
    currencies: normalizeArray(source.currencies)
      .slice(0, WALLET_PROFILE_LIMITS.maxCurrencies)
      .map(normalizeWalletCurrencyDefinition),
    metadata: normalizeObject(source.metadata),
  };
}

function validateIdentifier({ value, path, issues }) {
  if (!IDENTIFIER_PATTERN.test(value)) {
    issues.push(
      createIssue(
        "WALLET_CURRENCY_ID_INVALID",
        path,
        "Currency IDs must use lowercase letters, numbers, dots, colons, underscores, or hyphens."
      )
    );
  }

  if (value.length > WALLET_PROFILE_LIMITS.maxIdentifierLength) {
    issues.push(
      createIssue(
        "WALLET_CURRENCY_ID_INVALID_TOO_LONG",
        path,
        `Identifiers must not exceed ${WALLET_PROFILE_LIMITS.maxIdentifierLength} characters.`
      )
    );
  }
}

export function validateWalletProfileEditorValue(value = {}) {
  const raw = normalizeObject(value);
  const normalized = normalizeWalletProfileEditorValue(value);
  const issues = [];

  if (normalized.contractVersion !== WALLET_PROFILE_CONTRACT_VERSION) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_CONTRACT_VERSION_UNSUPPORTED",
        "contractVersion",
        `Expected ${WALLET_PROFILE_CONTRACT_VERSION}.`
      )
    );
  }

  if (!normalized.title) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_TITLE_REQUIRED",
        "title",
        "A Wallet Profile title is required."
      )
    );
  } else if (normalized.title.length > WALLET_PROFILE_LIMITS.maxTitleLength) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_TITLE_TOO_LONG",
        "title",
        `Title must not exceed ${WALLET_PROFILE_LIMITS.maxTitleLength} characters.`
      )
    );
  }

  if (normalized.description.length > WALLET_PROFILE_LIMITS.maxDescriptionLength) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_DESCRIPTION_TOO_LONG",
        "description",
        `Description must not exceed ${WALLET_PROFILE_LIMITS.maxDescriptionLength} characters.`
      )
    );
  }

  if (normalizeArray(raw.currencies).length > WALLET_PROFILE_LIMITS.maxCurrencies) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_CURRENCY_LIMIT_EXCEEDED",
        "currencies",
        `At most ${WALLET_PROFILE_LIMITS.maxCurrencies} currencies are supported.`
      )
    );
  }

  const currencyIds = new Set();
  const enabledCurrencyIds = new Set();

  normalized.currencies.forEach((currency, index) => {
    const path = `currencies[${index}]`;

    if (currency.definitionVersion !== WALLET_CURRENCY_DEFINITION_VERSION) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_DEFINITION_VERSION_UNSUPPORTED",
          `${path}.definitionVersion`,
          `Expected ${WALLET_CURRENCY_DEFINITION_VERSION}.`
        )
      );
    }

    validateIdentifier({
      value: currency.id,
      path: `${path}.id`,
      issues,
    });

    if (currencyIds.has(currency.id)) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_ID_DUPLICATE",
          `${path}.id`,
          `Duplicate currency ID '${currency.id}'.`
        )
      );
    }
    currencyIds.add(currency.id);
    if (currency.enabled) enabledCurrencyIds.add(currency.id);

    if (!currency.title) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_TITLE_REQUIRED",
          `${path}.title`,
          "Every currency requires a title."
        )
      );
    }

    if (currency.symbol.length > WALLET_PROFILE_LIMITS.maxSymbolLength) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_SYMBOL_TOO_LONG",
          `${path}.symbol`,
          `Currency symbols must not exceed ${WALLET_PROFILE_LIMITS.maxSymbolLength} characters.`
        )
      );
    }

    const rawCurrency = normalizeObject(raw.currencies?.[index]);
    const rawMinimum = Object.prototype.hasOwnProperty.call(
      rawCurrency,
      "minimumBalance"
    )
      ? Number(rawCurrency.minimumBalance)
      : 0;
    const rawMaximum = Object.prototype.hasOwnProperty.call(
      rawCurrency,
      "maximumBalance"
    )
      ? Number(rawCurrency.maximumBalance)
      : WALLET_PROFILE_LIMITS.maxBalance;
    const rawStarting = Object.prototype.hasOwnProperty.call(
      rawCurrency,
      "startingBalance"
    )
      ? Number(rawCurrency.startingBalance)
      : 0;

    for (const [field, rawValue] of [
      ["startingBalance", rawStarting],
      ["minimumBalance", rawMinimum],
      ["maximumBalance", rawMaximum],
    ]) {
      if (!Number.isSafeInteger(rawValue)) {
        issues.push(
          createIssue(
            "WALLET_CURRENCY_BALANCE_NOT_SAFE_INTEGER",
            `${path}.${field}`,
            `${field} must be a safe integer amount.`
          )
        );
      }
    }

    if (
      Number.isSafeInteger(rawMinimum) &&
      Number.isSafeInteger(rawMaximum) &&
      rawMinimum > rawMaximum
    ) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_BALANCE_BOUNDS_INVALID",
          path,
          "minimumBalance must not exceed maximumBalance."
        )
      );
    }

    if (
      Number.isSafeInteger(rawStarting) &&
      Number.isSafeInteger(rawMinimum) &&
      Number.isSafeInteger(rawMaximum) &&
      (rawStarting < rawMinimum || rawStarting > rawMaximum)
    ) {
      issues.push(
        createIssue(
          "WALLET_CURRENCY_STARTING_BALANCE_OUT_OF_RANGE",
          `${path}.startingBalance`,
          "startingBalance must remain inside the authored currency bounds."
        )
      );
    }
  });

  if (normalized.enabled && !enabledCurrencyIds.size) {
    issues.push(
      createIssue(
        "WALLET_PROFILE_EMPTY",
        "currencies",
        "An enabled Wallet Profile has no enabled currencies.",
        "WARNING"
      )
    );
  }

  const errors = issues.filter((issue) => issue.severity !== "WARNING");
  const warnings = issues.filter((issue) => issue.severity === "WARNING");

  return {
    valid: errors.length === 0,
    normalized,
    issues,
    errors,
    warnings,
    metrics: {
      currencyDefinitionCount: normalized.currencies.length,
      enabledCurrencyDefinitionCount: enabledCurrencyIds.size,
    },
  };
}

export function createEmptyWalletProfile() {
  return normalizeWalletProfileEditorValue({
    title: "New Wallet Profile",
    description:
      "Reusable gameplay currency definitions for actor-owned Wallet state.",
    enabled: true,
    currencies: [
      {
        id: "currency.coins",
        title: "Coins",
        symbol: "",
        description: "Replace this starter currency with the game's authored currency.",
        enabled: true,
        startingBalance: 0,
        minimumBalance: 0,
        maximumBalance: 1000000,
        tags: ["currency"],
      },
    ],
  });
}
