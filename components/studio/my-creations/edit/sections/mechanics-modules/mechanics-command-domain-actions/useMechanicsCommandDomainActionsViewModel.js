import {
  changeMechanicsCommandDomainActionType,
  patchMechanicsCommandDomainAction,
  toggleMechanicsCommandDomainActionOutcome,
} from "./mechanicsCommandDomainActionsOperations.js";
import { projectMechanicsCommandDomainAction } from "./mechanicsCommandDomainActionsNormalization.js";

export default function useMechanicsCommandDomainActionsViewModel({
  domainAction,
  invocation,
  onChange,
}) {
  const projection = projectMechanicsCommandDomainAction(domainAction, invocation);
  const emit = (next) => {
    if (typeof onChange === "function") onChange(next);
  };

  return {
    ...projection,
    changeType: (type) =>
      emit(
        changeMechanicsCommandDomainActionType(
          projection.domainAction,
          type,
          invocation
        )
      ),
    patchDomainAction: (patch) =>
      emit(patchMechanicsCommandDomainAction(projection.domainAction, patch)),
    toggleOutcome: (outcome, checked) =>
      emit(
        toggleMechanicsCommandDomainActionOutcome(
          projection.domainAction,
          outcome,
          checked
        )
      ),
  };
}
