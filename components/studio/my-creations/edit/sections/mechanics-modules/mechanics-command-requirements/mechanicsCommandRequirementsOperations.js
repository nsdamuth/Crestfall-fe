import {
  normalizeMechanicsCommandRequirement,
  normalizeMechanicsCommandRequirements,
} from "./mechanicsCommandRequirementsNormalization.js";

function uniqueRequirementId(requirements = []) {
  const existing = new Set(requirements.map((item) => item?.id).filter(Boolean));
  let index = existing.size + 1;
  let candidate = `requirement_${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `requirement_${index}`;
  }
  return candidate;
}

export function createMechanicsCommandRequirementsController({
  requirements,
  commandIndex,
  onPatchCommand,
}) {
  const normalizedRequirements = normalizeMechanicsCommandRequirements(requirements);

  function replaceRequirements(nextRequirements) {
    const normalized = normalizeMechanicsCommandRequirements(nextRequirements);
    onPatchCommand?.(commandIndex, { requirements: normalized });
    return normalized;
  }

  function addRequirement() {
    return replaceRequirements([
      ...normalizedRequirements,
      normalizeMechanicsCommandRequirement(
        {
          id: uniqueRequirementId(normalizedRequirements),
          type: "FLAG",
          targetId: "",
          operator: "EQ",
          value: true,
          message: "",
        },
        normalizedRequirements.length
      ),
    ]);
  }

  function patchRequirement(requirementIndex, patch) {
    return replaceRequirements(
      normalizedRequirements.map((requirement, index) =>
        index === requirementIndex
          ? normalizeMechanicsCommandRequirement(
              { ...requirement, ...patch },
              requirementIndex
            )
          : requirement
      )
    );
  }

  function removeRequirement(requirementIndex) {
    return replaceRequirements(
      normalizedRequirements.filter((_requirement, index) => index !== requirementIndex)
    );
  }

  return {
    requirements: normalizedRequirements,
    addRequirement,
    patchRequirement,
    removeRequirement,
  };
}
