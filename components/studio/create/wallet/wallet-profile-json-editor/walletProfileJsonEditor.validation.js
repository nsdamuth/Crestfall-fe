import {
  normalizeWalletProfileEditorValue,
  validateWalletProfileEditorValue,
} from "../wallet-profile-editor/WalletProfileEditor.contract.js";

const FORBIDDEN_KEY_PATTERN =
  /^(?:balance|balances|currentBalance|walletActorState|actorState|stateRevision|revision|ownerId|participantId|stateNamespace|transactionLedger|mutationHistory|transactionHistory)$/i;

function findForbiddenKeys(value, path = "$", issues = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      findForbiddenKeys(entry, `${path}[${index}]`, issues)
    );
    return issues;
  }

  if (!value || typeof value !== "object") return issues;

  Object.entries(value).forEach(([key, entry]) => {
    const nextPath = `${path}.${key}`;
    if (FORBIDDEN_KEY_PATTERN.test(key)) {
      issues.push({
        code: "WALLET_PROFILE_ACTOR_STATE_FORBIDDEN",
        path: nextPath,
        message:
          "Wallet Profiles own reusable currency definitions only; live balances and mutable actor state are not allowed.",
        severity: "ERROR",
      });
    }
    findForbiddenKeys(entry, nextPath, issues);
  });

  return issues;
}

export function parseAndValidateWalletProfileJson(text) {
  let parsed;

  try {
    parsed = JSON.parse(String(text || ""));
  } catch (error) {
    return {
      valid: false,
      normalized: null,
      errors: [
        {
          code: "WALLET_PROFILE_JSON_INVALID",
          path: "$",
          message: error?.message || "The JSON could not be parsed.",
          severity: "ERROR",
        },
      ],
      warnings: [],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      normalized: null,
      errors: [
        {
          code: "WALLET_PROFILE_JSON_OBJECT_REQUIRED",
          path: "$",
          message: "The Wallet Profile must be one JSON object.",
          severity: "ERROR",
        },
      ],
      warnings: [],
    };
  }

  const forbiddenIssues = findForbiddenKeys(parsed);
  const validation = validateWalletProfileEditorValue(parsed);
  const errors = [...forbiddenIssues, ...validation.errors];

  return {
    valid: errors.length === 0,
    normalized: normalizeWalletProfileEditorValue(validation.normalized),
    errors,
    warnings: validation.warnings,
  };
}

export function formatWalletProfileJsonData(value) {
  return JSON.stringify(normalizeWalletProfileEditorValue(value), null, 2);
}

export function formatWalletProfileJsonText(text) {
  try {
    return {
      valid: true,
      text: JSON.stringify(JSON.parse(String(text || "")), null, 2),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      text: String(text || ""),
      error: {
        code: "WALLET_PROFILE_JSON_INVALID",
        path: "$",
        message: error?.message || "The JSON could not be parsed.",
        severity: "ERROR",
      },
    };
  }
}

export function validateWalletProfileJsonText(text) {
  const result = parseAndValidateWalletProfileJson(text);

  return {
    valid: result.valid,
    data: result.normalized,
    errors: result.errors,
    warnings: result.warnings,
    formattedText: result.valid
      ? JSON.stringify(result.normalized, null, 2)
      : String(text || ""),
  };
}
