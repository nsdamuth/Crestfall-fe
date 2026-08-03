import {
  normalizeMechanicsGuard,
  normalizeMechanicsGuardCondition,
  normalizeMechanicsGuards,
  slugifyMechanicsGuardId,
} from "./mechanicsGuardsNormalization.js";

function uniqueGuardId(guards = []) {
  const existing = new Set(guards.map((guard) => String(guard?.id || "")));
  let index = guards.length + 1;
  let candidate = `guard_${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `guard_${index}`;
  }
  return candidate;
}

export function addMechanicsGuard(guards) {
  const normalized = normalizeMechanicsGuards(guards);
  const id = uniqueGuardId(normalized);
  return [
    ...normalized,
    normalizeMechanicsGuard(
      {
        id,
        label: `Guard ${normalized.length + 1}`,
        enforcement: "HARD_LOCK",
        mode: "ALL",
        conditions: [],
        onFail: { summary: "", composerGuidance: "" },
        onPass: { summary: "" },
        composerVisibility: "SUMMARY_ONLY",
        publicVisibility: "HIDDEN",
      },
      normalized.length
    ),
  ];
}

export function patchMechanicsGuard(guards, guardIndex, patch) {
  const normalized = normalizeMechanicsGuards(guards);
  return normalized.map((guard, index) => {
    if (index !== guardIndex) return guard;
    const next = {
      ...guard,
      ...patch,
      ...(patch?.onFail
        ? { onFail: { ...guard.onFail, ...patch.onFail } }
        : {}),
      ...(patch?.onPass
        ? { onPass: { ...guard.onPass, ...patch.onPass } }
        : {}),
      ...(patch?.id !== undefined
        ? {
            id: slugifyMechanicsGuardId(
              patch.id,
              `guard_${guardIndex + 1}`
            ),
          }
        : {}),
    };
    return normalizeMechanicsGuard(next, index);
  });
}

export function removeMechanicsGuard(guards, guardIndex) {
  return normalizeMechanicsGuards(guards).filter(
    (_guard, index) => index !== guardIndex
  );
}

export function addMechanicsGuardCondition(guards, guardIndex) {
  const normalized = normalizeMechanicsGuards(guards);
  const guard = normalized[guardIndex];
  if (!guard) return normalized;
  const conditions = guard.conditions || [];
  return patchMechanicsGuard(normalized, guardIndex, {
    conditions: [
      ...conditions,
      normalizeMechanicsGuardCondition(
        {
          conditionType: "COUNTER",
          id: `condition_${conditions.length + 1}`,
          field: "value",
          operator: "lt",
          value: 1,
        },
        conditions.length
      ),
    ],
  });
}

export function patchMechanicsGuardCondition(
  guards,
  guardIndex,
  conditionIndex,
  patch
) {
  const normalized = normalizeMechanicsGuards(guards);
  const guard = normalized[guardIndex];
  if (!guard) return normalized;
  return patchMechanicsGuard(normalized, guardIndex, {
    conditions: guard.conditions.map((condition, index) =>
      index === conditionIndex
        ? normalizeMechanicsGuardCondition(
            {
              ...condition,
              ...patch,
              ...(patch?.id !== undefined
                ? {
                    id: slugifyMechanicsGuardId(
                      patch.id,
                      `condition_${conditionIndex + 1}`
                    ),
                  }
                : {}),
            },
            index
          )
        : condition
    ),
  });
}

export function removeMechanicsGuardCondition(
  guards,
  guardIndex,
  conditionIndex
) {
  const normalized = normalizeMechanicsGuards(guards);
  const guard = normalized[guardIndex];
  if (!guard) return normalized;
  return patchMechanicsGuard(normalized, guardIndex, {
    conditions: guard.conditions.filter((_condition, index) => index !== conditionIndex),
  });
}
