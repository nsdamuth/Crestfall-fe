import {
  normalizeAbilitySpellProfileEditorValue,
  validateAbilitySpellProfileEditorValue,
} from "../ability-spell-profile-editor/AbilitySpellProfileEditor.contract.js";

const FORBIDDEN_KEY_PATTERN = /^(?:known|unlocked|knownStatus|unlockStatus|currentMastery|masteryCurrent|cooldownRemaining|remainingCooldown|currentCharges|chargesCurrent|currentResourceState|temporaryModifiers|actorState|stateRevision|ownerId|participantId|namespace|mutationHistory)$/i;

function findForbiddenKeys(value, path = "$", issues = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => findForbiddenKeys(entry, `${path}[${index}]`, issues));
    return issues;
  }
  if (!value || typeof value !== "object") return issues;

  Object.entries(value).forEach(([key, entry]) => {
    const nextPath = `${path}.${key}`;
    if (FORBIDDEN_KEY_PATTERN.test(key)) {
      issues.push({
        code: "ABILITY_SPELL_PROFILE_ACTOR_STATE_FORBIDDEN",
        path: nextPath,
        message: "Ability & Spell Profiles own reusable definitions only; actor knowledge, mastery progress, cooldown state, charges, resources, and temporary modifiers are not allowed.",
        severity: "ERROR",
      });
    }
    findForbiddenKeys(entry, nextPath, issues);
  });
  return issues;
}

export function parseAndValidateAbilitySpellProfileJson(text) {
  let parsed;
  try {
    parsed = JSON.parse(String(text || ""));
  } catch (error) {
    return {
      valid: false,
      normalized: null,
      errors: [{ code: "ABILITY_SPELL_PROFILE_JSON_INVALID", path: "$", message: error?.message || "The JSON could not be parsed.", severity: "ERROR" }],
      warnings: [],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      normalized: null,
      errors: [{ code: "ABILITY_SPELL_PROFILE_JSON_OBJECT_REQUIRED", path: "$", message: "The Ability & Spell Profile must be one JSON object.", severity: "ERROR" }],
      warnings: [],
    };
  }

  const forbiddenIssues = findForbiddenKeys(parsed);
  const validation = validateAbilitySpellProfileEditorValue(parsed);
  const errors = [...forbiddenIssues, ...validation.errors];
  return {
    valid: errors.length === 0,
    normalized: normalizeAbilitySpellProfileEditorValue(validation.normalized),
    errors,
    warnings: validation.warnings,
  };
}

export function formatAbilitySpellProfileJsonData(value) {
  return JSON.stringify(normalizeAbilitySpellProfileEditorValue(value), null, 2);
}

export function formatAbilitySpellProfileJsonText(text) {
  try {
    return { valid: true, text: JSON.stringify(JSON.parse(String(text || "")), null, 2), error: null };
  } catch (error) {
    return { valid: false, text: String(text || ""), error: { code: "ABILITY_SPELL_PROFILE_JSON_INVALID", path: "$", message: error?.message || "The JSON could not be parsed.", severity: "ERROR" } };
  }
}

export function validateAbilitySpellProfileJsonText(text) {
  const result = parseAndValidateAbilitySpellProfileJson(text);
  return {
    valid: result.valid,
    data: result.normalized,
    errors: result.errors,
    warnings: result.warnings,
    formattedText: result.valid ? JSON.stringify(result.normalized, null, 2) : String(text || ""),
  };
}
